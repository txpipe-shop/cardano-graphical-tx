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
  type ChainProvider,
  type CursorPaginatedProvider,
  type CursorPaginatedRequest,
  type EpochReq,
  type EpochRes,
  type EpochsReq,
  type EpochsRes,
  type TipRes,
  type TxReq,
  type TxsReq,
  type TxsRes
} from '@laceanatomy/provider-core';
import { type Cardano, Hash, HexString, hexToBech32, type cardano } from '@laceanatomy/types';
import { CardanoAddressesApi, CardanoBlocksApi, Configuration } from '@laceanatomy/blockfrost-sdk';
import {
  toBigInt,
  u5cToCardanoBlock,
  u5cToCardanoTx
} from '@laceanatomy/cardano-provider-u5c/mappers';
import { UtxoRpcClient } from '@laceanatomy/utxorpc-sdk';
import { query, sync, type cardano as cardanoUtxoRpc } from '@utxorpc/spec';
import assert from 'assert';
import { Buffer } from 'buffer';

import {
  blockfrostAmountToValue,
  blockfrostBlockToBlockRes,
  blockfrostUtxoToCardanoUtxo
} from './mappers.js';

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
    ChainProvider<cardano.UTxO, cardano.Tx, Cardano>,
    CursorPaginatedProvider<cardano.UTxO, cardano.Tx, Cardano, BlockCursor>
{
  private static readonly MAX_BLOCKS_LOOKBACK = 100;

  private utxoRpc: UtxoRpcClient;
  private blockApi: CardanoBlocksApi;
  private addrApi: CardanoAddressesApi;
  private addressPrefix: string;

  constructor({ transport, blockfrostUrl, blockfrostApiKey, addressPrefix }: DolosProviderParams) {
    this.utxoRpc = new UtxoRpcClient({ transport });
    this.addressPrefix = addressPrefix;

    const config = new Configuration({
      apiKey: blockfrostApiKey,
      basePath: blockfrostUrl
    });
    this.blockApi = new CardanoBlocksApi(config);
    this.addrApi = new CardanoAddressesApi(config);
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
    if (txRefs.length === 0) return { data: [], total: 0n };

    const data = await this.fetchTxsFromBlocks(
      txRefs.map((t) => ({ hash: t.tx_hash, blockHeight: t.block_height }))
    );
    return { data, total: 0n };
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
      const { header } = this.validateBlock(blockResp);
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

    const { block, header, body } = this.validateBlock(blockResp);
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
          this.findTxIndexInBlock(body, tx)
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
        blocksByHeight.set(h, this.validateBlock(resp));
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
            this.findTxIndexInBlock(body, tx)
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
    const { body } = this.validateBlock(blockResp);

    return u5cToCardanoTx(
      tx,
      block.timestamp,
      blockHash,
      block.height,
      block.slot,
      this.findTxIndexInBlock(body, tx)
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
      const { block } = this.validateBlock(blockResp);
      const tipHeight = BigInt(latestResp.data.height ?? 0);
      return u5cToCardanoBlock(block, tipHeight);
    }

    const id = 'hash' in params ? params.hash : params.height.toString();
    const resp = await this.blockApi.blocksHashOrNumberGet(id);
    return blockfrostBlockToBlockRes(resp.data);
  }

  async getBlocks({ limit, offset }: BlocksReq): Promise<BlocksRes> {
    const latestResp = await this.blockApi.blocksLatestGet();
    const tipHeight = latestResp.data.height ?? 0;
    const startHeight = tipHeight - Number(offset ?? 0n);

    const heights = Array.from({ length: Number(limit) }, (_, i) => startHeight - i).filter(
      (h) => h >= 0
    );

    const blocks = await Promise.all(
      heights.map((h) => this.blockApi.blocksHashOrNumberGet(h.toString()))
    );

    return {
      data: blocks.map((b) => blockfrostBlockToBlockRes(b.data)),
      total: 0n
    };
  }

  async getBlocksWithTxs(
    params: CursorPaginatedRequest<BlockCursor>
  ): Promise<BlocksWithTxsRes<cardano.UTxO, cardano.Tx, Cardano, BlockCursor>> {
    const { cursor, limit } = params;

    const { block: blocks, nextToken } = await this.utxoRpc.sync.dumpHistory({
      startToken: cursor
        ? {
            slot: cursor.slot,
            hash: Buffer.from(cursor.hash, 'hex'),
            height: cursor.height
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

    return {
      data,
      nextCursor: nextToken
        ? {
            slot: nextToken.slot,
            hash: Hash(Buffer.from(nextToken.hash).toString('hex')),
            height: nextToken.height
          }
        : undefined
    };
  }

  async readTip(): Promise<TipRes> {
    const resp = await this.blockApi.blocksLatestGet();
    return {
      hash: Hash(resp.data.hash),
      slot: BigInt(resp.data.slot ?? 0)
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
    assert(thisBlock.chain.value.header, 'Block header is undefined');
    return {
      block: thisBlock.chain.value,
      header: thisBlock.chain.value.header,
      body: thisBlock.chain.value.body
    };
  }

  private findTxIndexInBlock(body: cardanoUtxoRpc.BlockBody, tx: cardanoUtxoRpc.Tx): number {
    return body.tx.findIndex(
      (t) => Buffer.from(t.hash).toString('hex') === Buffer.from(tx.hash).toString('hex')
    );
  }
}
