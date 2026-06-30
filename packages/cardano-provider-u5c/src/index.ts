import type { Transport } from '@connectrpc/connect';
import {
  AddressFundsReq,
  AddressFundsRes,
  AddressUTxOsReq,
  AddressUTxOsRes,
  BlockCursor,
  BlockReq,
  BlockRes,
  BlocksReq,
  BlocksRes,
  BlocksWithTxsRes,
  CursorPaginatedRequest,
  EpochReq,
  EpochRes,
  EpochsReq,
  EpochsRes,
  TipRes,
  TxsRes,
  type ChainProvider,
  type TxReq,
  type TxsReq
} from '@laceanatomy/provider-core';
import type { Cardano, cardano, Unit } from '@laceanatomy/types';
import { Hash, HexString } from '@laceanatomy/types';
import { parseDatumInfo } from '@laceanatomy/napi-pallas';
import {
  CIP68_PREFIX_FT,
  CIP68_PREFIX_NFT,
  CIP68_PREFIX_REF,
  CIP68_PREFIX_RFT,
  parseCip25,
  parseCip68,
} from '@laceanatomy/types/cardano';
import { UtxoRpcClient } from '@laceanatomy/utxorpc-sdk';
import { query, sync, type cardano as cardanoUtxoRpc } from '@utxorpc/spec';
import assert from 'assert';
import { Buffer } from 'buffer';
import {
  toBigInt,
  u5cToCardanoBlock,
  u5cToCardanoTx,
  u5cToCardanoUtxo,
  u5cToCardanoValue,
  u5cToCardanoMetadata,
} from './mappers';

const DUMP_HISTORY_MAX_ITEMS = 100;

export type Params = {
  /**
   * Pre-configured transport for the UTxORPC client.
   * Use createGrpcTransport from '@laceanatomy/utxorpc-sdk/transport/node' for Node.js
   * or from '@laceanatomy/utxorpc-sdk/transport/web' for browser.
   */
  transport: Transport;
};

export class U5CProvider
  implements ChainProvider<cardano.UTxO, cardano.Tx, Cardano, cardano.TokenMetadata> {
  utxoRpc: UtxoRpcClient;

  constructor({ transport }: Params) {
    this.utxoRpc = new UtxoRpcClient({ transport });
  }

  async getCBOR(params: TxReq): Promise<string> {
    const txResponse = await this.utxoRpc.query.readTx({ hash: Buffer.from(params.hash, 'hex') });
    const { cbor } = this.validateTx(txResponse);

    return Buffer.from(cbor).toString('hex');
  }

  async getLatestTx(): Promise<cardano.Tx> {
    const tip = await this.utxoRpc.sync.readTip(new sync.ReadTipRequest());
    assert(tip.tip, 'Cannot read tip');

    let {
      block: foundBlock,
      body: foundBody,
      header: foundHeader
    } = await this.fetchBlockByQuery({
      hash: Hash(Buffer.from(tip.tip.hash).toString('hex'))
    });
    let searchHeight = foundHeader.height - 1n;

    while (foundBody.tx.length === 0) {
      if (
        foundHeader.height === 0n &&
        foundHeader.slot === 0n &&
        Buffer.from(foundHeader.hash).toString('hex') === ''
      ) {
        throw new Error('Latest transaction not found');
      }

      ({
        block: foundBlock,
        body: foundBody,
        header: foundHeader
      } = await this.fetchBlockByQuery({
        height: searchHeight
      }));
      searchHeight--;
    }

    const latestTx = foundBody.tx.at(-1);
    assert(latestTx, 'Latest transaction is undefined');

    const blockHash = Hash(Buffer.from(foundHeader.hash).toString('hex'));
    return u5cToCardanoTx(
      latestTx,
      foundBlock.timestamp,
      blockHash,
      foundHeader.height,
      foundHeader.slot,
      this.findTxIndexInBlock(foundBody, latestTx)
    );
  }

  async getAddressFunds(params: AddressFundsReq): Promise<AddressFundsRes> {
    const utxosResponse = await this.utxoRpc.query.searchUtxos({
      predicate: {
        match: {
          utxoPattern: {
            case: 'cardano',
            value: {
              address: {
                exactAddress: Buffer.from(params.address, 'hex')
              }
            }
          }
        }
      }
    });

    const utxos = utxosResponse.items
      .map((item) => item.parsedState)
      .filter((item) => item.case === 'cardano')
      .map((item) => item.value);

    const value = u5cToCardanoValue(utxos);
    // TODO: get tx count
    return { value, txCount: 0n };
  }

  async getAddressUTxOs(params: AddressUTxOsReq): Promise<AddressUTxOsRes<cardano.UTxO>> {
    const { limit, query, offset } = params;
    const utxosResponse = await this.utxoRpc.query.searchUtxos({
      predicate: {
        match: {
          utxoPattern: {
            case: 'cardano',
            value: {
              address: {
                exactAddress: Buffer.from(query.address, 'hex')
              }
            }
          }
        }
      }
      // NOTE: `maxItems` in the utxoRpc query is not being used yet
      // maxItems: Number(limit)
    });

    const sortedUtxos = utxosResponse.items
      .filter((item) => {
        return item.parsedState.case === 'cardano' && item.txoRef !== undefined;
      })
      .sort((a, b) => {
        const aHash = Buffer.from(a.txoRef!.hash).toString('hex');
        const bHash = Buffer.from(b.txoRef!.hash).toString('hex');
        return aHash.localeCompare(bHash) || a.txoRef!.index - b.txoRef!.index;
      });

    const total = BigInt(sortedUtxos.length);
    let startIndex = 0;
    if (offset !== undefined && offset > 0n) {
      const cursorIndex = Number(offset);
      if (cursorIndex >= 0 && cursorIndex < sortedUtxos.length) {
        startIndex = cursorIndex;
      } else if (cursorIndex >= sortedUtxos.length) {
        return { data: [], total };
      }
    }

    const endIndex = Math.min(startIndex + Number(limit), sortedUtxos.length);
    const data = sortedUtxos.slice(startIndex, endIndex).map(({ parsedState, txoRef }) => {
      return u5cToCardanoUtxo(
        Hash(Buffer.from(txoRef!.hash).toString('hex')),
        parsedState.value,
        txoRef!.index
      );
    });

    return { data, total };
  }

  async getTx({ hash }: TxReq): Promise<cardano.Tx> {
    const txResponse = await this.utxoRpc.query.readTx({ hash: Buffer.from(hash, 'hex') });
    const { tx, block } = this.validateTx(txResponse);

    const time = block.timestamp;
    const blockHash = Buffer.from(block.hash).toString('hex');

    const { body: fullBlockBody } = await this.fetchBlockByQuery({
      hash: Hash(Buffer.from(block.hash).toString('hex'))
    });

    return u5cToCardanoTx(
      tx,
      time,
      Hash(blockHash),
      block.height,
      block.slot,
      this.findTxIndexInBlock(fullBlockBody, tx)
    );
  }

  async getTxs(params: TxsReq): Promise<TxsRes<cardano.UTxO, cardano.Tx, Cardano>> {
    const { limit, query, offset } = params;
    const offsetValue = Number(offset) || 0;
    const limitValue = Number(limit);

    if (!query || !Object.keys(query).length) return this.getLatestTxs(limitValue, offsetValue);

    if (query.block)
      return this.getTxsByBlock(
        { block: query.block, address: query.address },
        limitValue,
        offsetValue
      );

    if (query.address) return this.getTxsByAddress(query.address, limitValue, offsetValue);

    throw new Error('Invalid query');
  }

  async getTokenMetadata({
    unit,
    type,
  }: {
    unit: Unit;
    type?: keyof cardano.TokenMetadata;
  }): Promise<cardano.NullableTokenMetadata> {
    const metadata: cardano.NullableTokenMetadata = {
      Cip25v1: null,
      Cip25v2: null,
      Cip26: null,
      Cip68v1: null,
      Cip68v2: null,
      Cip68v3: null,
      Cip68v4: null,
    };

    if (unit === 'lovelace') return metadata;

    const policyId = unit.slice(0, 56);
    const rawAssetName = unit.slice(56);
    if (!policyId) return metadata;

    const needsCip25 = !type || type.startsWith('Cip25');
    const needsCip68 = !type || type.startsWith('Cip68');

    // CIP-68 — targeted UTxO lookup for reference NFT
    if (needsCip68) {
      const baseName = this.stripCip68Prefix(rawAssetName);
      if (baseName) {
        await this.fetchCip68Metadata(policyId, baseName, metadata);
      }
    }

    // CIP-25 / CIP-60 — full chain scan for mint tx label 721 metadata
    if (needsCip25) {
      await this.scanChainForCip25(policyId, rawAssetName, metadata);
    }

    // If a specific type was requested, null out the rest
    if (type) {
      for (const key of Object.keys(metadata) as (keyof cardano.TokenMetadata)[]) {
        if (key !== type) {
          (metadata as Record<string, unknown>)[key] = null;
        }
      }
    }

    return metadata;
  }

  private async fetchCip68Metadata(
    policyId: string,
    baseName: string,
    metadata: cardano.NullableTokenMetadata,
  ): Promise<void> {
    const policyIdBuffer = Buffer.from(policyId, 'hex');
    const refNameBuffer = Buffer.from(CIP68_PREFIX_REF + baseName, 'hex');

    try {
      const response = await this.utxoRpc.query.searchUtxos({
        predicate: {
          match: {
            utxoPattern: {
              case: 'cardano',
              value: {
                asset: {
                  policyId: policyIdBuffer,
                  assetName: refNameBuffer,
                },
              },
            },
          },
        },
      });

      const item = response.items?.[0];
      if (!item) return;
      if (item.parsedState?.case !== 'cardano') return;

      const datum = item.parsedState.value?.datum;
      if (!datum?.originalCbor || datum.originalCbor.length === 0) return;

      const datumHex = Buffer.from(datum.originalCbor).toString('hex');
      const parsed = parseDatumInfo(datumHex);
      if (!parsed?.json) return;

      const plutusJson = JSON.parse(parsed.json) as Record<string, unknown>;
      const result = parseCip68(plutusJson);
      if (!result) return;

      const ver = result.version;
      if (result.isMapV4) {
        metadata.Cip68v4 = result.metadata;
      } else {
        if (ver >= 1) metadata.Cip68v1 = result.metadata as cardano.CIP68MetadataNft222 | cardano.CIP68MetadataFt333;
        if (ver >= 2) metadata.Cip68v2 = result.metadata as cardano.CIP68MetadataNft222 | cardano.CIP68MetadataFt333;
        if (ver >= 3) metadata.Cip68v3 = result.metadata as cardano.CIP68MetadataNft222 | cardano.CIP68MetadataFt333 | cardano.CIP68MetadataRft444;
        if (ver >= 4) metadata.Cip68v4 = result.metadata;
      }
    } catch {
      // Reference NFT not found or datum unparsable
    }
  }

  private async scanChainForCip25(
    policyId: string,
    rawAssetName: string,
    metadata: cardano.NullableTokenMetadata,
  ): Promise<void> {
    let nextSlot: bigint | undefined = 0n;

    do {
      const { block, nextToken: next } = await this.utxoRpc.sync.dumpHistory({
        maxItems: DUMP_HISTORY_MAX_ITEMS,
        startToken: nextSlot !== undefined ? { slot: nextSlot } : undefined,
      });
      nextSlot = next ? next.slot : undefined;

      for (const blockItem of block) {
        const { body } = this.validateBlock(blockItem);
        for (const tx of body.tx) {
          if (!tx.mint || tx.mint.length === 0) continue;

          const mintsPolicy = this.txMintsPolicy(tx, policyId);
          if (!mintsPolicy) continue;

          if (tx.auxiliary?.metadata) {
            this.extractCip25FromTx(tx, policyId, rawAssetName, metadata);
            if (metadata.Cip25v1 || metadata.Cip25v2) {
              return;
            }
          }
        }
      }
    } while (nextSlot);
  }

  private txMintsPolicy(tx: cardanoUtxoRpc.Tx, policyId: string): boolean {
    for (const ma of tx.mint) {
      const txPolicy = Buffer.from(ma.policyId).toString('hex');
      if (txPolicy !== policyId) continue;
      for (const asset of ma.assets) {
        const qty = toBigInt(asset.quantity.value?.bigInt.value);
        if (qty > 0n) return true;
      }
    }
    return false;
  }

  private extractCip25FromTx(
    tx: cardanoUtxoRpc.Tx,
    policyId: string,
    rawAssetName: string,
    result: cardano.NullableTokenMetadata,
  ): void {
    if (!tx.auxiliary?.metadata) return;

    const domainMetadata = u5cToCardanoMetadata(tx.auxiliary.metadata);
    const parsed = parseCip25(domainMetadata, policyId, rawAssetName);
    if (!parsed) return;

    if (parsed.version === 2) {
      result.Cip25v2 = parsed.metadata;
    } else {
      result.Cip25v1 = parsed.metadata;
    }
  }

  private stripCip68Prefix(assetName: string): string | null {
    for (const prefix of [CIP68_PREFIX_NFT, CIP68_PREFIX_FT, CIP68_PREFIX_RFT]) {
      if (assetName.startsWith(prefix)) {
        return assetName.slice(prefix.length);
      }
    }
    return null;
  }


  private async getLatestTxs(
    limit: number,
    offset: number
  ): Promise<TxsRes<cardano.UTxO, cardano.Tx, Cardano>> {
    const blocksAndTxs: { block: cardanoUtxoRpc.Block; txs: cardanoUtxoRpc.Tx[] }[] = [];
    let nextSlot: bigint | undefined = 0n;

    do {
      const { block, nextToken: next } = await this.utxoRpc.sync.dumpHistory({
        maxItems: DUMP_HISTORY_MAX_ITEMS,
        startToken: { slot: nextSlot }
      });
      nextSlot = next ? next.slot : undefined;
      block.forEach((blockItem) => {
        const { block, body } = this.validateBlock(blockItem);
        if (body.tx.length > 0) blocksAndTxs.push({ block: block, txs: body.tx.reverse() });
      });
    } while (nextSlot);
    const total = blocksAndTxs.reduce((acc, block) => acc + block.txs.length, 0);

    let remainingOffset = offset;
    let index = 0;
    blocksAndTxs.reverse();
    while (remainingOffset > 0 && index < blocksAndTxs.length) {
      const { txs } = blocksAndTxs[index]!;

      if (txs.length >= remainingOffset) {
        blocksAndTxs[index]!.txs = txs.slice(remainingOffset);
        remainingOffset = 0;
      } else {
        blocksAndTxs[index]!.txs = [];
        remainingOffset -= txs.length;
      }

      index++;
    }

    const data = blocksAndTxs.flatMap(({ block, txs }) => {
      assert(block.header, 'Block header is undefined');
      assert(block.body, 'Block body is undefined');

      const blockHash = Hash(Buffer.from(block.header.hash).toString('hex'));
      const blockHeight = block.header.height;
      const blockSlot = block.header.slot;
      const blockBody = block.body;

      return txs.map((tx) =>
        u5cToCardanoTx(
          tx,
          block.timestamp,
          blockHash,
          blockHeight,
          blockSlot,
          this.findTxIndexInBlock(blockBody, tx)
        )
      );
    });

    return {
      data: data.slice(0, limit),
      total: BigInt(total)
    };
  }

  private async getTxsByBlock(
    query: { block: { hash: Hash } | { height: bigint } | { slot: bigint }; address?: string },
    limit: number,
    offset: number
  ): Promise<TxsRes<cardano.UTxO, cardano.Tx, Cardano>> {
    const { block, body, header } = await this.fetchBlockByQuery(query.block);

    const addressHex = query.address;
    const filteredTxs = addressHex
      ? body.tx.filter((tx) => {
        const addressMatchesInput = tx.inputs.some(
          (input) => Buffer.from(input.asOutput?.address ?? '').toString('hex') === addressHex
        );
        const addressMatchesOutput = tx.outputs.some(
          (output) => Buffer.from(output.address).toString('hex') === addressHex
        );
        return addressMatchesInput || addressMatchesOutput;
      })
      : body.tx;

    const paginatedTxs = filteredTxs.reverse().slice(offset, offset + limit);

    const blockHash = Hash(Buffer.from(header.hash).toString('hex'));
    const data = paginatedTxs.map((tx) =>
      u5cToCardanoTx(
        tx,
        block.timestamp,
        blockHash,
        header.height,
        header.slot,
        this.findTxIndexInBlock(body, tx)
      )
    );

    return {
      data,
      total: BigInt(filteredTxs.length)
    };
  }

  private async getTxsByAddress(
    addressHex: string,
    limit: number,
    offset: number
  ): Promise<TxsRes<cardano.UTxO, cardano.Tx, Cardano>> {
    const utxosResponse = await this.utxoRpc.query.searchUtxos({
      predicate: {
        match: {
          utxoPattern: {
            case: 'cardano',
            value: {
              address: {
                exactAddress: Buffer.from(addressHex, 'hex')
              }
            }
          }
        }
      }
    });

    const discoveredTxHashes = new Set<string>();
    for (const item of utxosResponse.items) {
      if (item.txoRef?.hash) {
        const hashHex = Buffer.from(item.txoRef.hash).toString('hex');
        discoveredTxHashes.add(hashHex);
      }
    }

    // Track transactions we've processed to avoid duplicates
    const processedTxHashes = new Set<string>();
    const allTxData: Array<{ tx: cardanoUtxoRpc.Tx; block: query.ChainPoint }> = [];
    const txHashesToProcess = Array.from(discoveredTxHashes);

    let processedCount = 0;
    let currentIndex = 0;

    while (currentIndex < txHashesToProcess.length && processedCount < offset + limit) {
      const hashHex = txHashesToProcess[currentIndex];
      if (!hashHex || processedTxHashes.has(hashHex)) {
        currentIndex++;
        continue;
      }

      const hashBuffer = Buffer.from(hashHex, 'hex');
      const txResponse = await this.utxoRpc.query.readTx({ hash: new Uint8Array(hashBuffer) });
      const { tx, block } = await this.validateTx(txResponse);

      processedTxHashes.add(hashHex);

      const hasAddressInInputs = tx.inputs.some(
        (input) => Buffer.from(input.asOutput?.address ?? '').toString('hex') === addressHex
      );
      const hasAddressInOutputs = tx.outputs.some(
        (output) => Buffer.from(output.address).toString('hex') === addressHex
      );

      if (hasAddressInInputs || hasAddressInOutputs) {
        if (processedCount >= offset) {
          allTxData.push({ tx, block });
        }
        processedCount++;

        for (const input of tx.inputs) {
          const inputAddress = Buffer.from(input.asOutput?.address ?? '').toString('hex');
          if (inputAddress === addressHex && input.txHash) {
            const inputTxHashHex = Buffer.from(input.txHash).toString('hex');
            if (!processedTxHashes.has(inputTxHashHex) && !discoveredTxHashes.has(inputTxHashHex)) {
              discoveredTxHashes.add(inputTxHashHex);
              txHashesToProcess.push(inputTxHashHex);
            }
          }
        }
      }

      currentIndex++;
    }

    if (allTxData.length === 0) {
      return { data: [], total: 0n };
    }

    const txData = allTxData.slice(0, limit);

    const blockHashToTxs = new Map<string, cardanoUtxoRpc.Tx[]>();
    for (const { tx, block } of txData) {
      const blockHash = Buffer.from(block.hash).toString('hex');
      const existing = blockHashToTxs.get(blockHash) || [];
      existing.push(tx);
      blockHashToTxs.set(blockHash, existing);
    }

    const blockPromises = Array.from(blockHashToTxs.entries()).map(async ([blockHashHex, txs]) => {
      const blockResponse = await this.utxoRpc.sync.fetchBlock({
        ref: [{ hash: Buffer.from(blockHashHex, 'hex') }]
      });
      const { block, body, header } = this.validateBlock(blockResponse);

      return txs.map((tx) =>
        u5cToCardanoTx(
          tx,
          block.timestamp,
          Hash(blockHashHex),
          header.height,
          header.slot,
          this.findTxIndexInBlock(body, tx)
        )
      );
    });

    return {
      data: (await Promise.all(blockPromises)).flat(),
      // We don't know the total number of transactions with an address
      total: 0n
    };
  }

  async getBlock(params: BlockReq): Promise<BlockRes> {
    const tip = await this.utxoRpc.sync.readTip(new sync.ReadTipRequest());
    assert(tip.tip, 'Cannot read tip');
    const { header: tipHeader } = await this.fetchBlockByQuery({
      hash: Hash(Buffer.from(tip.tip.hash).toString('hex'))
    });

    const { block } = await this.fetchBlockByQuery(params);
    return u5cToCardanoBlock(block, tipHeader.height);
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
      const { block, header, body } = this.validateBlock(anyChainBlock);
      const blockHash = Hash(Buffer.from(header.hash).toString('hex'));
      const blockHeight = toBigInt(header.height);
      const blockSlot = toBigInt(header.slot);

      const transactions = body.tx.map((tx) =>
        u5cToCardanoTx(
          tx,
          block.timestamp,
          blockHash,
          blockHeight,
          blockSlot,
          this.findTxIndexInBlock(body, tx)
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

  async getBlocks(params: BlocksReq): Promise<BlocksRes> {
    const { limit, query, offset } = params;

    if (!query || !Object.keys(query).length) {
      const tip = await this.utxoRpc.sync.readTip(new sync.ReadTipRequest());
      assert(tip.tip, 'Cannot read tip');
      const { header: fullTipHeader } = await this.fetchBlockByQuery({
        hash: Hash(Buffer.from(tip.tip.hash).toString('hex'))
      });

      const tipHeight = fullTipHeader.height;
      let blockHeight = tipHeight - (offset || 0n);

      const u5cBlocks: cardanoUtxoRpc.Block[] = [];
      do {
        const { block, header } = await this.fetchBlockByQuery({ height: blockHeight });

        if (
          header.height === 0n &&
          header.slot === 0n &&
          Buffer.from(header.hash).toString('hex') === ''
        ) {
          break;
        }

        u5cBlocks.push(block);
        blockHeight--;
      } while (u5cBlocks.length < limit && blockHeight >= 0n);

      return {
        data: u5cBlocks.map((block) => u5cToCardanoBlock(block, fullTipHeader.height)),
        total: 0n
      };
    } else throw new Error('U5C cannot get blocks by epoch');
  }

  async getEpoch(_params: EpochReq): Promise<EpochRes> {
    throw new Error('U5C cannot get epoch');
  }

  async getEpochs(_params: EpochsReq): Promise<EpochsRes> {
    throw new Error('U5C cannot get epochs');
  }

  async readTip(): Promise<TipRes> {
    const tip = await this.utxoRpc.sync.readTip(new sync.ReadTipRequest());
    return {
      hash: Hash(Buffer.from(tip.tip!.hash).toString('hex')),
      slot: BigInt(tip.tip?.slot || 0),
      height: BigInt(tip.tip?.height ?? 0)
    };
  }

  private async fetchBlockByQuery(query: { hash: Hash } | { height: bigint } | { slot: bigint }) {
    let blockResponse: sync.FetchBlockResponse | undefined;
    if ('hash' in query) {
      blockResponse = await this.utxoRpc.sync.fetchBlock({
        ref: [{ hash: Buffer.from(query.hash, 'hex') }]
      });
    } else if ('height' in query) {
      blockResponse = await this.utxoRpc.sync.fetchBlock({
        ref: [{ height: query.height }]
      });
    } else if ('slot' in query) {
      blockResponse = await this.utxoRpc.sync.fetchBlock({
        ref: [{ slot: query.slot }]
      });
    } else {
      throw new Error('Invalid block query');
    }

    return this.validateBlock(blockResponse);
  }

  private processBlockForTxs(
    block: cardanoUtxoRpc.Block,
    txsInBlock: cardanoUtxoRpc.Tx[],
    blocksAndTxs: { block: cardanoUtxoRpc.Block; txs: cardanoUtxoRpc.Tx[] }[],
    txsToIgnore: number
  ): number {
    if (txsToIgnore > 0) {
      if (txsInBlock.length > txsToIgnore) {
        blocksAndTxs.push({ block, txs: txsInBlock.slice(txsToIgnore) });
        return 0;
      } else {
        return txsToIgnore - txsInBlock.length;
      }
    } else {
      blocksAndTxs.push({ block, txs: txsInBlock });
      return 0;
    }
  }

  private validateBlock(block: sync.FetchBlockResponse | sync.AnyChainBlock): {
    block: cardanoUtxoRpc.Block;
    header: cardanoUtxoRpc.BlockHeader;
    body: cardanoUtxoRpc.BlockBody;
  } {
    let thisBlock: sync.AnyChainBlock;
    if ('block' in block) {
      assert(block.block[0], 'Block not found');
      thisBlock = block.block[0];
    } else {
      thisBlock = block;
    }

    assert(thisBlock.chain.case === 'cardano', 'Block is not a Cardano block');
    assert(thisBlock.chain.value.body, 'Block body is undefined');
    assert(thisBlock.chain.value.header, 'Header body is undefined');
    return {
      block: thisBlock.chain.value,
      header: thisBlock.chain.value.header,
      body: thisBlock.chain.value.body
    };
  }

  private validateTx(tx: query.ReadTxResponse): {
    tx: cardanoUtxoRpc.Tx;
    block: query.ChainPoint;
    cbor: Uint8Array;
  } {
    assert(tx.tx?.chain.case === 'cardano', 'Transaction is not a Cardano transaction');
    assert(tx.tx.blockRef, 'Block reference of transaction empty');

    return { tx: tx.tx.chain.value, block: tx.tx.blockRef, cbor: tx.tx.nativeBytes };
  }

  private findTxIndexInBlock(blockBody: cardanoUtxoRpc.BlockBody, tx: cardanoUtxoRpc.Tx): number {
    return blockBody.tx.findIndex((t) => {
      const hashInBlock = Buffer.from(t.hash).toString('hex');
      const hashToFind = Buffer.from(tx.hash).toString('hex');
      return hashInBlock === hashToFind;
    });
  }
}

export * as mappers from './mappers';
