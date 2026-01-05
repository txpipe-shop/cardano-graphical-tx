import {
  BlockReq,
  BlockRes,
  BlocksReq,
  BlocksRes,
  EpochsReq,
  EpochsRes,
  LatestTxRes,
  TxsReq,
  TxsRes,
  type ChainProvider,
  type TxReq
} from '@alexandria/provider-core';
import type { Cardano } from '@alexandria/types';
import { cardano, HexString, hexToBech32, isBase58 } from '@alexandria/types';
import { Hash } from '@alexandria/types';
import type { Pool, PoolClient } from 'pg';
import { mapTx } from './mappers';
import { SQLQuery } from './sql';
import type * as QueryTypes from './types/queries';

export type DbSyncParams = {
  pool: Pool;
};

export class DbSyncProvider implements ChainProvider<cardano.UTxO, cardano.Tx, Cardano> {
  private pool: Pool;

  constructor({ pool }: DbSyncParams) {
    this.pool = pool;
  }

  private async getClient(): Promise<PoolClient> {
    return this.pool.connect();
  }

  private gracefulRelease(client: PoolClient): void {
    client.release();
  }

  async readTip(): Promise<{ hash: Hash; slot: bigint }> {
    const client = await this.getClient();
    try {
      const { rows } = await client.query<QueryTypes.Tip>(SQLQuery.get('tip'));
      if (rows.length === 0) {
        throw new Error('No tip found');
      }
      return {
        hash: Hash(rows[0]!.hash),
        slot: BigInt(rows[0]!.slot)
      };
    } finally {
      this.gracefulRelease(client);
    }
  }

  async getLatestTx(): Promise<LatestTxRes<cardano.UTxO, cardano.Tx, Cardano>> {
    const client = await this.getClient();
    try {
      const { rows } = await client.query<QueryTypes.LatestTx>(SQLQuery.get('latest_tx'));
      if (rows.length === 0) {
        throw new Error('No latest transaction found');
      }
      return mapTx(rows[0]!.result);
    } finally {
      this.gracefulRelease(client);
    }
  }

  async getTx({ hash }: TxReq): Promise<cardano.Tx> {
    const client = await this.getClient();
    try {
      const { rows } = await client.query<QueryTypes.LatestTx>(SQLQuery.get('tx_by_hash'), [
        hash.toString()
      ]);

      if (rows.length === 0) {
        throw new Error('Transaction not found');
      }

      return mapTx(rows[0]!.result);
    } finally {
      this.gracefulRelease(client);
    }
  }

  async getCBOR({ hash }: TxReq): Promise<string> {
    return '';
  }

  private parseBlockFilter(query: TxsReq['query']): [Hash | null, bigint | null, bigint | null] {
    const { block } = query || {};

    if (!block) return [null, null, null];

    return [
      'hash' in block ? block.hash : null,
      'height' in block ? block.height : null,
      'slot' in block ? block.slot : null
    ];
  }

  async getTxs({
    before,
    limit,
    query
  }: TxsReq): Promise<TxsRes<cardano.UTxO, cardano.Tx, Cardano>> {
    const client = await this.getClient();
    try {
      // if address is provided, convert it to bech32 if it's in hex format otherwise use it as it is (Byron)
      const address = query?.address
        ? isBase58(query.address)
          ? query?.address
          : // TODO: set up address prefix as configurable
            hexToBech32(HexString(query.address), 'addr')
        : null;

      const [blockHash, blockHeight, blockSlot] = this.parseBlockFilter(query);

      const { rows: countRows } = await client.query<QueryTypes.TotalTxs>(
        SQLQuery.get('txs_count'),
        [address, blockHash, blockHeight, blockSlot]
      );
      const total = BigInt(countRows[0]?.total || 0);

      const { rows } = await client.query<QueryTypes.Txs>(SQLQuery.get('txs'), [
        before ? before.toString() : null,
        limit,
        address,
        blockHash,
        blockHeight,
        blockSlot
      ]);

      const items = rows.map((row) => mapTx(row.result));

      let nextCursor: Hash | undefined;
      const lastItem = items.at(-1);

      if (lastItem) {
        nextCursor = lastItem.hash;
      }

      return {
        total,
        data: items,
        nextCursor
      };
    } finally {
      this.gracefulRelease(client);
    }
  }

  async getBlocks({ before, query, limit }: BlocksReq): Promise<BlocksRes> {
    const client = await this.getClient();

    try {
      const { epoch } = query || {};
      const { rows } = await client.query<QueryTypes.Block>(SQLQuery.get('blocks'), [
        before ? before.toString() : null,
        limit
      ]);
      const { rows: countRows } = await client.query<QueryTypes.TotalBlocks>(
        SQLQuery.get('blocks_count'),
        [epoch || null]
      );
      const total = BigInt(countRows[0]?.total || 0);

      let nextCursor: Hash | undefined;
      const lastItem = rows.at(-1);

      if (lastItem) {
        nextCursor = Hash(lastItem.hash);
      }

      return {
        data: rows.map((row) => ({
          fees: BigInt(row.fees || 0),
          hash: Hash(row.hash),
          height: BigInt(row.height),
          slot: BigInt(row.slot),
          time: row.time,
          txCount: BigInt(row.txCount || 0),
          confirmations: BigInt(row.confirmations || 0)
        })),
        total,
        nextCursor
      };
    } finally {
      this.gracefulRelease(client);
    }
  }

  async getBlock(params: BlockReq): Promise<BlockRes> {
    const client = await this.getClient();
    let hash: string | null = null;
    let height: number | null = null;
    let slot: number | null = null;

    if ('hash' in params) {
      hash = params.hash.toString();
    } else if ('height' in params) {
      height = Number(params.height);
    } else {
      slot = Number(params.slot);
    }

    try {
      const { rows } = await client.query<QueryTypes.Block>(SQLQuery.get('block'), [
        hash,
        height,
        slot
      ]);

      if (rows.length === 0) {
        throw new Error('Block not found');
      }

      const row = rows[0]!;

      return {
        fees: BigInt(row.fees || 0),
        hash: Hash(row.hash),
        height: BigInt(row.height),
        slot: BigInt(row.slot),
        time: row.time,
        txCount: BigInt(row.txCount),
        confirmations: BigInt(row.confirmations || 0)
      };
    } finally {
      this.gracefulRelease(client);
    }
  }

  async getEpochs({ before, limit }: EpochsReq): Promise<EpochsRes> {
    const client = await this.getClient();

    try {
      const { rows: epochsRows } = await client.query<QueryTypes.Epoch>(SQLQuery.get('epochs'), [
        before ? Number(before) : null,
        limit
      ]);
      const total = 0n; // TODO: Implement getEpochs total count

      let nextCursor: bigint | undefined;
      const lastItem = epochsRows.at(-1);

      if (lastItem) {
        nextCursor = BigInt(lastItem.epoch);
      }

      return {
        data: epochsRows.map((row) => ({
          epoch: BigInt(row.epoch),
          startTime: row.startTime,
          endTime: row.endTime,
          txCount: BigInt(row.txCount),
          blkCount: BigInt(row.blkCount),
          output: BigInt(row.output),
          fees: BigInt(row.fees),
          index: BigInt(row.epoch),
          startSlot: 0n, // TODO: Fetch separate start slot
          endSlot: 0n, // TODO: Fetch separate end slot
          startHeight: 0n, // TODO: Fetch separate start height
          endHeight: 0n,
          blocksProduced: 0n,
          blocks: []
        })),
        total,
        nextCursor
      };
    } finally {
      this.gracefulRelease(client);
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}

export { SQLQuery } from './sql';
export type * from './types/queries';
