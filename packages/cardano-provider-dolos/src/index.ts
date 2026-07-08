import type { Transport } from '@connectrpc/connect';
import {
  type AddressFundsReq,
  type AddressFundsRes,
  type AddressUTxOsReq,
  type AddressUTxOsRes,
  type BlockReq,
  type BlockRes,
  type BlockCursor,
  type BlocksReq,
  type BlocksRes,
  type BlocksWithTxsRes,
  type CursorPaginatedProvider,
  type CursorPaginatedRequest,
  type EpochReq,
  type EpochRes,
  type EpochsReq,
  type EpochsRes,
  type TipRes,
  type TxReq,
  type TxsReq,
  type TxsRes,
  ScriptReq,
  ScriptRes,
  ChainProvider
} from '@laceanatomy/provider-core';
import {
  Address,
  assetNameFromUnit,
  cardano,
  type Cardano,
  Hash,
  HexString,
  hexToBech32,
  policyFromUnit,
  Unit
} from '@laceanatomy/types';
import {
  CardanoAddressesApi,
  CardanoAssetsApi,
  CardanoBlocksApi,
  CardanoScriptsApi,
  Configuration
} from '@laceanatomy/blockfrost-sdk';
import {
  toBigInt,
  u5cToCardanoBlock,
  u5cToCardanoTx,
  validateBlock,
  findTxIndexInBlock
} from '@laceanatomy/cardano-provider-u5c/mappers';
import { UtxoRpcClient } from '@laceanatomy/utxorpc-sdk';
import { query, type cardano as cardanoUtxoRpc } from '@utxorpc/spec';
import { parseDatumInfo } from '@laceanatomy/napi-pallas';
import { TokenRegistryClient } from '@laceanatomy/cardano-token-registry-sdk';
import {
  CIP68_PREFIX_FT,
  CIP68_PREFIX_FT_NONSTANDARD,
  CIP68_PREFIX_NFT,
  CIP68_PREFIX_REF,
  CIP68_PREFIX_RFT,
  parseCip68,
  ScriptType
} from '@laceanatomy/types/cardano';
import assert from 'assert';
import { Buffer } from 'buffer';
import {
  blockfrostAmountToValue,
  blockfrostBlockToBlockRes,
  blockfrostUtxoToCardanoUtxo
} from './mappers.js';
import {
  Cip25MetadataSchema,
  Cip68Ft333Schema,
  Cip68MapV4Schema,
  Cip68Nft222Schema,
  Cip68Rft444Schema,
  OnchainMetadataStandardSchema
} from './schemas.js';

export type DolosProviderParams = {
  /** UTxORPC gRPC transport pointing at a Dolos node */
  transport: Transport;
  blockfrostUrl: string;
  blockfrostApiKey?: string;
  /** Bech32 address prefix: 'addr' for mainnet, 'addr_test' for testnets */
  addressPrefix: string;
};

export class DolosProvider
  implements
    ChainProvider<cardano.UTxO, cardano.Tx, Cardano, cardano.TokenMetadata, ScriptType>,
    CursorPaginatedProvider<cardano.UTxO, cardano.Tx, Cardano, BlockCursor>
{
  private static readonly MAX_BLOCKS_LOOKBACK = 100;

  private utxoRpc: UtxoRpcClient;
  private blockApi: CardanoBlocksApi;
  private addrApi: CardanoAddressesApi;
  private assetsApi: CardanoAssetsApi;
  private scriptApi: CardanoScriptsApi;
  private addressPrefix: string;
  private tokenClient: TokenRegistryClient;

  constructor({ transport, blockfrostUrl, blockfrostApiKey, addressPrefix }: DolosProviderParams) {
    this.utxoRpc = new UtxoRpcClient({ transport });
    this.addressPrefix = addressPrefix;

    const config = new Configuration({
      apiKey: blockfrostApiKey,
      basePath: blockfrostUrl
    });
    this.blockApi = new CardanoBlocksApi(config);
    this.addrApi = new CardanoAddressesApi(config);
    this.assetsApi = new CardanoAssetsApi(config);
    this.tokenClient = new TokenRegistryClient('preprod');
    this.scriptApi = new CardanoScriptsApi(config);
  }

  // ---------------------------------------------------------------------------

  async getTxs(params: TxsReq): Promise<TxsRes<cardano.UTxO, cardano.Tx, Cardano>> {
    const { limit, query: q, offset } = params;
    const count = Number(limit);
    const page = Math.floor(Number(offset ?? 0n) / count) + 1;

    if (!q || !Object.keys(q).length) {
      return this.getLatestTxs(count);
    }
    if (q.block) {
      return this.getTxsByBlock(q.block, count, page);
    }
    if (q.address) {
      return this.getTxsByAddress(q.address, count, page);
    }

    throw new Error('Invalid query');
  }

  private async getLatestTxs(count: number): Promise<TxsRes<cardano.UTxO, cardano.Tx, Cardano>> {
    const latestResp = await this.blockApi.blocksLatestGet();
    const tipHeight = latestResp.data.height ?? 0;

    const heights = Array.from(
      { length: DolosProvider.MAX_BLOCKS_LOOKBACK },
      (_, i) => tipHeight - i
    ).filter((h) => h >= 0);

    // Fetch tx hashes from last N blocks in parallel
    const blockTxResults = await Promise.all(
      heights.map(async (h) => {
        // TODO: take into account when fetching more that in a single block there could be more than 100 txs
        // Right now count < 100 so we are good. But it's something to take into account
        const resp = await this.blockApi.blocksHashOrNumberTxsGet(h.toString(), 100, 1, 'asc');
        return resp.data.map((txHash) => ({ hash: txHash, blockHeight: h }));
      })
    );

    // Flatten (latest block first), take up to count
    const txRefs = blockTxResults.flat().slice(0, count);
    if (txRefs.length === 0) return { data: [], total: 0n };

    const data = await this.fetchTxsFromBlocks(txRefs);
    return { data, total: 0n };
  }

  private async getTxsByAddress(
    addressHex: string,
    count: number,
    page: number
  ): Promise<TxsRes<cardano.UTxO, cardano.Tx, Cardano>> {
    const bech32 = hexToBech32(HexString(addressHex), this.addressPrefix);
    const resp = await this.addrApi.addressesAddressTransactionsGet(bech32, count, page, 'desc');
    const txRefs = resp.data;

    let total = 0n;
    try {
      const totalResp = await this.addrApi.addressesAddressTotalGet(bech32);
      total = BigInt(totalResp.data.tx_count);
    } catch {
      total = 0n;
    }

    if (total === 0n) {
      total = BigInt(txRefs.length);
    }

    if (txRefs.length === 0) return { data: [], total };

    const data = await this.fetchTxsFromBlocks(
      txRefs.map((t) => ({ hash: t.tx_hash, blockHeight: t.block_height }))
    );
    return { data, total };
  }

  private async getTxsByBlock(
    blockQuery: { hash: Hash } | { height: bigint } | { slot: bigint },
    count: number,
    page: number
  ): Promise<TxsRes<cardano.UTxO, cardano.Tx, Cardano>> {
    // Resolve block identifier for Blockfrost (hash or height string)
    let blockId: string;
    if ('hash' in blockQuery) {
      blockId = blockQuery.hash;
    } else if ('height' in blockQuery) {
      blockId = blockQuery.height.toString();
    } else {
      // Slot: use UTxORPC to find the block hash
      const blockResp = await this.utxoRpc.sync.fetchBlock({
        ref: [{ slot: blockQuery.slot }]
      });
      const { header } = validateBlock(blockResp);
      blockId = Buffer.from(header.hash).toString('hex');
    }

    const [hashesResp, blockResp] = await Promise.all([
      this.blockApi.blocksHashOrNumberTxsGet(blockId, count, page, 'desc'),
      this.utxoRpc.sync.fetchBlock({
        ref: [
          {
            ...(blockId.length === 64
              ? { hash: Buffer.from(blockId, 'hex') }
              : { height: BigInt(blockId) })
          }
        ]
      })
    ]);

    const txHashSet = new Set(hashesResp.data);
    if (txHashSet.size === 0) return { data: [], total: 0n };

    const { block, header, body } = validateBlock(blockResp);
    const blockHash = Hash(Buffer.from(header.hash).toString('hex'));

    const data = body.tx
      .filter((tx) => txHashSet.has(Buffer.from(tx.hash).toString('hex')))
      .map((tx) =>
        u5cToCardanoTx(
          tx,
          block.timestamp,
          blockHash,
          header.height,
          header.slot,
          findTxIndexInBlock(body, tx)
        )
      );

    return { data, total: BigInt(hashesResp.data.length) };
  }

  /**
   * Core efficiency: given tx refs with block heights, fetch unique blocks in
   * parallel from UTxORPC and extract txs without individual tx lookups.
   */
  private async fetchTxsFromBlocks(
    txRefs: { hash: string; blockHeight: number }[]
  ): Promise<cardano.Tx[]> {
    const uniqueHeights = [...new Set(txRefs.map((t) => t.blockHeight))];

    const blocksByHeight = new Map<
      number,
      {
        block: cardanoUtxoRpc.Block;
        header: cardanoUtxoRpc.BlockHeader;
        body: cardanoUtxoRpc.BlockBody;
      }
    >();
    await Promise.all(
      uniqueHeights.map(async (h) => {
        const resp = await this.utxoRpc.sync.fetchBlock({ ref: [{ height: BigInt(h) }] });
        blocksByHeight.set(h, validateBlock(resp));
      })
    );

    // Build hash -> tx mapping from all fetched blocks
    const txsByHash = new Map<string, cardano.Tx>();
    for (const [_height, { block, header, body }] of blocksByHeight) {
      const blockHash = Hash(Buffer.from(header.hash).toString('hex'));
      for (const tx of body.tx) {
        const txHash = Buffer.from(tx.hash).toString('hex');
        txsByHash.set(
          txHash,
          u5cToCardanoTx(
            tx,
            block.timestamp,
            blockHash,
            header.height,
            header.slot,
            findTxIndexInBlock(body, tx)
          )
        );
      }
    }

    // Return txs in the order returned by blockfrost, skipping any not found in fetched blocks
    return txRefs.flatMap((ref) => {
      const tx = txsByHash.get(ref.hash);
      return tx ? [tx] : [];
    });
  }

  // ---------------------------------------------------------------------------
  // Single tx — UTxORPC only (inputs are resolved via asOutput)
  // ---------------------------------------------------------------------------
  async getTx({ hash }: TxReq): Promise<cardano.Tx> {
    const txResponse = await this.utxoRpc.query.readTx({ hash: Buffer.from(hash, 'hex') });
    const { tx, block } = this.validateTx(txResponse);

    const blockHash = Hash(Buffer.from(block.hash).toString('hex'));
    const blockResp = await this.utxoRpc.sync.fetchBlock({
      ref: [{ hash: Buffer.from(block.hash) }]
    });
    const { body } = validateBlock(blockResp);

    return u5cToCardanoTx(
      tx,
      block.timestamp,
      blockHash,
      block.height,
      block.slot,
      findTxIndexInBlock(body, tx)
    );
  }

  private validateTx(txResponse: query.ReadTxResponse): {
    tx: cardanoUtxoRpc.Tx;
    block: query.ChainPoint;
  } {
    assert(txResponse.tx?.chain.case === 'cardano', 'Transaction is not a Cardano transaction');
    assert(txResponse.tx.blockRef, 'Block reference of transaction empty');
    return { tx: txResponse.tx.chain.value, block: txResponse.tx.blockRef };
  }

  async getLatestTx(): Promise<cardano.Tx> {
    const result = await this.getTxs({ limit: 1n, offset: 0n, query: undefined });
    const tx = result.data[0];
    if (!tx) throw new Error('No transactions found');
    return tx;
  }

  // ---------------------------------------------------------------------------
  // CBOR — UTxORPC native bytes
  // ---------------------------------------------------------------------------

  async getCBOR({ hash }: TxReq): Promise<string> {
    const resp = await this.utxoRpc.query.readTx({ hash: Buffer.from(hash, 'hex') });
    assert(resp.tx?.nativeBytes, 'CBOR not available for this transaction');
    return Buffer.from(resp.tx.nativeBytes).toString('hex');
  }

  // ---------------------------------------------------------------------------
  // Blocks — Blockfrost
  // ---------------------------------------------------------------------------

  async getBlock(params: BlockReq): Promise<BlockRes> {
    if ('slot' in params) {
      // Blockfrost doesn't have a /blocks/slot endpoint — use UTxORPC
      const [blockResp, latestResp] = await Promise.all([
        this.utxoRpc.sync.fetchBlock({ ref: [{ slot: params.slot }] }),
        this.blockApi.blocksLatestGet()
      ]);
      const { block } = validateBlock(blockResp);
      const tipHeight = BigInt(latestResp.data.height ?? 0);
      return u5cToCardanoBlock(block, tipHeight);
    }

    const id = 'hash' in params ? params.hash : params.height.toString();
    const resp = await this.blockApi.blocksHashOrNumberGet(id);
    return blockfrostBlockToBlockRes(resp.data);
  }

  async getBlockCBOR(params: BlockReq): Promise<string> {
    const ref =
      'hash' in params
        ? { hash: Buffer.from(params.hash, 'hex') }
        : 'height' in params
          ? { height: params.height }
          : { slot: params.slot };
    const blockResponse = await this.utxoRpc.sync.fetchBlock({ ref: [ref] });
    const anyChainBlock = blockResponse.block[0];
    assert(anyChainBlock, 'Block not found');
    assert(anyChainBlock.nativeBytes, 'CBOR not available for this block');
    return Buffer.from(anyChainBlock.nativeBytes).toString('hex');
  }

  async getBlocks({ limit, offset }: BlocksReq): Promise<BlocksRes> {
    const tip = await this.readTip();
    const tipHeight = tip.height;
    const startHeight = tipHeight - (offset ?? 0n) - limit;

    const blocks = await this.utxoRpc.sync.dumpHistory({
      startToken: { height: startHeight },
      maxItems: Number(limit.toString())
    });

    return {
      data: blocks.block.map(validateBlock).map((b) => u5cToCardanoBlock(b.block, tip.height)),
      total: 0n
    };
  }

  async getBlocksWithTxs(
    params: CursorPaginatedRequest<BlockCursor>
  ): Promise<BlocksWithTxsRes<cardano.UTxO, cardano.Tx, Cardano>> {
    const { cursor, limit } = params;

    const { block: blocks } = await this.utxoRpc.sync.dumpHistory({
      startToken: cursor
        ? {
            ...('slot' in cursor && { slot: cursor.slot }),
            ...('hash' in cursor && { hash: Buffer.from(cursor.hash, 'hex') }),
            ...('height' in cursor && { height: cursor.height })
          }
        : undefined,
      maxItems: Number(limit)
    });

    const data = blocks.map((anyChainBlock) => {
      const { block, header, body } = validateBlock(anyChainBlock);
      const blockHash = Hash(Buffer.from(header.hash).toString('hex'));
      const blockHeight = toBigInt(header.height);
      const blockSlot = toBigInt(header.slot);

      const transactions = body.tx.map((tx) =>
        u5cToCardanoTx(
          tx,
          // Block.timestamp is seconds; u5cToCardanoTx expects ms
          block.timestamp * 1000n,
          blockHash,
          blockHeight,
          blockSlot,
          findTxIndexInBlock(body, tx)
        )
      );

      return {
        block: u5cToCardanoBlock(block, undefined),
        transactions
      };
    });
    data.sort((a, b) => Number(b.block.height) - Number(a.block.height));

    return { data };
  }

  async readTip(): Promise<TipRes> {
    const resp = await this.blockApi.blocksLatestGet();
    return {
      hash: Hash(resp.data.hash),
      slot: BigInt(resp.data.slot ?? 0),
      height: BigInt(resp.data.height ?? 0)
    };
  }

  // ---------------------------------------------------------------------------
  // Address — Blockfrost
  // ---------------------------------------------------------------------------

  async getAddressFunds({ address }: AddressFundsReq): Promise<AddressFundsRes> {
    const bech32 = hexToBech32(HexString(address), this.addressPrefix);
    const [contentResp, totalResp] = await Promise.all([
      this.addrApi.addressesAddressGet(bech32),
      this.addrApi.addressesAddressTotalGet(bech32)
    ]);
    return {
      value: blockfrostAmountToValue(contentResp.data.amount),
      txCount: BigInt(totalResp.data.tx_count)
    };
  }

  async getAddressUTxOs({
    limit,
    offset,
    query: q
  }: AddressUTxOsReq): Promise<AddressUTxOsRes<cardano.UTxO>> {
    const count = Number(limit);
    const page = Math.floor(Number(offset ?? 0n) / count) + 1;
    const bech32 = hexToBech32(HexString(q.address), this.addressPrefix);

    const resp = await this.addrApi.addressesAddressUtxosGet(bech32, count, page);
    const data = resp.data.map(blockfrostUtxoToCardanoUtxo);
    return { data, total: BigInt(data.length) };
  }

  // ---------------------------------------------------------------------------
  // Epochs — not supported
  // ---------------------------------------------------------------------------
  async getEpoch(_params: EpochReq): Promise<EpochRes> {
    throw new Error('DolosProvider does not support epoch queries');
  }

  async getEpochs(_params: EpochsReq): Promise<EpochsRes> {
    throw new Error('DolosProvider does not support epoch queries');
  }

  // ---------------------------------------------------------------------------
  // Assets — Blockfrost
  // ---------------------------------------------------------------------------

  async getAssetInfo(asset: string) {
    const resp = await this.assetsApi.assetsAssetGet(asset);
    return {
      policyId: HexString(resp.data.policy_id),
      assetName: HexString(resp.data.asset_name ?? ''),
      fingerprint: resp.data.fingerprint,
      totalSupply: resp.data.quantity,
      mintOrBurnCount: resp.data.mint_or_burn_count,
      initialMintTxHash: Hash(resp.data.initial_mint_tx_hash),
      metadata: resp.data.metadata,
      onchainMetadata: resp.data.onchain_metadata as Record<string, unknown> | null,
      onchainMetadataStandard: resp.data.onchain_metadata_standard ?? null
    };
  }

  async getAssetHolders(asset: string, count: number, page: number) {
    const resp = await this.assetsApi.assetsAssetAddressesGet(asset, count, page);
    return resp.data.map((item) => ({
      address: Address(item.address),
      quantity: item.quantity
    }));
  }

  async getAssetHistory(asset: string, count: number, page: number) {
    const resp = await this.assetsApi.assetsAssetHistoryGet(asset, count, page);
    return resp.data.map((item) => ({
      txHash: Hash(item.tx_hash),
      action: item.action as 'minted' | 'burned',
      amount: item.amount
    }));
  }

  async getAssetTxs(asset: string, count: number, page: number, order?: 'asc' | 'desc') {
    const resp = await this.assetsApi.assetsAssetTransactionsGet(asset, count, page, order);
    return resp.data.map((item) => ({
      txHash: Hash(item.tx_hash),
      txIndex: item.tx_index,
      blockHeight: item.block_height,
      blockTime: item.block_time
    }));
  }

  async getTokenMetadata({
    unit,
    type,
    network = 'preprod'
  }: {
    unit: Unit;
    type?: keyof cardano.TokenMetadata;
    network?: 'mainnet' | 'preprod';
  }): Promise<cardano.NullableTokenMetadata> {
    const metadata: cardano.NullableTokenMetadata = {
      Cip25v1: null,
      Cip25v2: null,
      Cip26: null,
      Cip68v1: null,
      Cip68v2: null,
      Cip68v3: null,
      Cip68v4: null
    };

    if (unit === 'lovelace') return metadata;

    const needsCip25 = !type || type.startsWith('Cip25');
    const needsCip68 = !type || type.startsWith('Cip68');

    if (needsCip25) {
      await this.fetchCip25Metadata(unit, metadata);
    }

    if (needsCip68) {
      const policyId = policyFromUnit(unit);
      const rawAssetName = assetNameFromUnit(unit);
      const baseName = this.stripCip68Prefix(rawAssetName);
      if (policyId && baseName) {
        await this.fetchCip68Metadata(policyId, baseName, metadata);
      }
    }

    // CIP-26: token registry (offchain)
    if (!type || type === 'Cip26') {
      await this.fetchCip26Metadata(unit, network, metadata);
    }

    if (type) {
      for (const key of Object.keys(metadata) as (keyof cardano.TokenMetadata)[]) {
        if (key !== type) {
          (metadata as Record<string, unknown>)[key] = null;
        }
      }
    }

    return metadata;
  }

  async getScript(params: ScriptReq): Promise<ScriptRes<ScriptType>> {
    const { data, status } = await this.scriptApi.scriptsScriptHashGet(params.hash);
    if (status === 404) throw new Error(`Script ${params.hash} not found`);
    assert(status === 200, `Unexpected status code (${status}) fetching script ${params.hash}`);
    if (data.type === 'timelock') {
      const { data: jsonData, status } = await this.scriptApi.scriptsScriptHashJsonGet(params.hash);
      assert(
        status === 200,
        `Unexpected status code (${status}) fetching script json ${params.hash}`
      );
      assert(jsonData.json, `Json data is null for script ${params.hash}`);
      return {
        serializedSize:
          typeof data.serialised_size === 'number' ? BigInt(data.serialised_size) : null,
        type: ScriptType.Native,
        data: JSON.stringify(jsonData.json)
      };
    } else {
      const { data: cborData, status } = await this.scriptApi.scriptsScriptHashCborGet(params.hash);
      assert(
        status === 200,
        `Unexpected status code (${status}) fetching script cbor ${params.hash}`
      );
      assert(cborData.cbor, `Cbor data is null for script ${params.hash}`);

      return {
        serializedSize:
          typeof data.serialised_size === 'number' ? BigInt(data.serialised_size) : null,
        type: data.type === 'plutusV1' ? ScriptType.PlutusV1 : ScriptType.PlutusV2,
        data: cborData.cbor
      };
    }
  }

  private async fetchCip25Metadata(
    unit: string,
    metadata: cardano.NullableTokenMetadata
  ): Promise<void> {
    try {
      const resp = await this.assetsApi.assetsAssetGet(unit);
      const standard = resp.data.onchain_metadata_standard;
      const data = resp.data.onchain_metadata;
      if (!data || !standard) return;

      const parsedStandard = OnchainMetadataStandardSchema.safeParse(standard);
      if (!parsedStandard.success) return;

      const validated = Cip25MetadataSchema.safeParse(data);
      if (!validated.success) return;

      if (parsedStandard.data === 'CIP25v1') metadata.Cip25v1 = validated.data;
      else if (parsedStandard.data === 'CIP25v2') metadata.Cip25v2 = validated.data;
    } catch {
      // asset not found
    }
  }

  private async fetchCip68Metadata(
    policyId: string,
    baseName: string,
    metadata: cardano.NullableTokenMetadata
  ): Promise<void> {
    try {
      const response = await this.utxoRpc.query.searchUtxos({
        predicate: {
          match: {
            utxoPattern: {
              case: 'cardano',
              value: {
                asset: {
                  policyId: Buffer.from(policyId, 'hex'),
                  assetName: Buffer.from(CIP68_PREFIX_REF + baseName, 'hex')
                }
              }
            }
          }
        }
      });

      const item = response.items?.[0];
      if (!item?.parsedState || item.parsedState.case !== 'cardano') return;

      const datum = item.parsedState.value?.datum;
      if (!datum?.originalCbor || datum.originalCbor.length === 0) return;

      const datumHex = Buffer.from(datum.originalCbor).toString('hex');
      const parsed = parseDatumInfo(datumHex);
      if (!parsed?.json) return;

      const plutusJson = JSON.parse(parsed.json) as Record<string, unknown>;
      const result = parseCip68(plutusJson);
      if (!result) return;

      const validated = this.validateCip68Metadata(result);
      if (!validated) return;

      (metadata as Record<string, unknown>)[validated.key] = validated.data;
    } catch {
      // reference NFT not found or datum unparsable
    }
  }

  private validateCip68Metadata(result: {
    metadata: unknown;
    version: number;
    isMapV4: boolean;
  }): { key: keyof cardano.TokenMetadata; data: unknown } | null {
    if (result.isMapV4) {
      const validated = Cip68MapV4Schema.safeParse(result.metadata);
      return validated.success ? { key: 'Cip68v4', data: validated.data } : null;
    }

    const schemas: Array<{
      schema: { safeParse: (data: unknown) => { success: boolean; data?: unknown } };
      key: keyof cardano.TokenMetadata;
    }> = [];

    const ver = result.version;
    if (ver >= 1)
      schemas.push(
        { schema: Cip68Nft222Schema, key: 'Cip68v1' },
        { schema: Cip68Ft333Schema, key: 'Cip68v1' }
      );
    if (ver >= 2)
      schemas.push(
        { schema: Cip68Nft222Schema, key: 'Cip68v2' },
        { schema: Cip68Ft333Schema, key: 'Cip68v2' }
      );
    if (ver >= 3)
      schemas.push(
        { schema: Cip68Nft222Schema, key: 'Cip68v3' },
        { schema: Cip68Ft333Schema, key: 'Cip68v3' },
        { schema: Cip68Rft444Schema, key: 'Cip68v3' }
      );
    if (ver >= 4)
      schemas.push(
        { schema: Cip68Nft222Schema, key: 'Cip68v4' },
        { schema: Cip68Ft333Schema, key: 'Cip68v4' },
        { schema: Cip68Rft444Schema, key: 'Cip68v4' }
      );

    for (const { schema, key } of schemas) {
      const validated = schema.safeParse(result.metadata);
      if (validated.success) return { key, data: validated.data };
    }
    return null;
  }

  private async fetchCip26Metadata(
    unit: string,
    network: 'mainnet' | 'preprod',
    metadata: cardano.NullableTokenMetadata
  ): Promise<void> {
    try {
      const result = await this.tokenClient.getToken(unit);
      if (!result) return;

      metadata.Cip26 = {
        subject: Unit(result.subject),
        policy: result.policy ? HexString(result.policy) : undefined,
        name: result.name ?? undefined,
        description: result.description ?? undefined,
        ticker: result.ticker ?? undefined,
        decimals: result.decimals ?? undefined,
        url: result.url ?? undefined,
        logo: result.logo ?? undefined
      };
    } catch {
      // registry not available
    }
  }

  private stripCip68Prefix(assetName: string): string | null {
    for (const prefix of [
      CIP68_PREFIX_NFT,
      CIP68_PREFIX_FT,
      CIP68_PREFIX_FT_NONSTANDARD,
      CIP68_PREFIX_RFT
    ]) {
      if (assetName.startsWith(prefix)) {
        return assetName.slice(prefix.length);
      }
    }
    return null;
  }
}
