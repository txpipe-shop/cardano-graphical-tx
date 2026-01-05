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

  async getBlocks(params: BlocksReq): Promise<BlocksRes> {
    return {
      data: [],
      total: 0n,
      nextCursor: Hash('')
    };
  }

  async getBlock(params: BlockReq): Promise<BlockRes> {
    return {
      fees: 0n,
      hash: Hash(''),
      height: 0n,
      slot: 0n,
      time: 0,
      txCount: 0n,
      confirmations: 0n
    };
  }

  async getEpochs(params: EpochsReq): Promise<EpochsRes> {
    return {
      data: [],
      total: 0n,
      nextCursor: 0n
    };
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}

export { SQLQuery } from './sql';
export type * from './types/queries';
