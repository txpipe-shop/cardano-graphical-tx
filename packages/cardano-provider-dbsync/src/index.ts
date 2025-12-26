import {
  BlocksReq,
  BlocksRes,
  EpochsReq,
  EpochsRes,
  TxsReq,
  TxsRes,
  type ChainProvider,
  type LatestTxReq,
  type TxReq
} from '@alexandria/provider-core';
import type { Cardano, cardano } from '@alexandria/types';
import { Hash } from '@alexandria/types';
import type { Pool, PoolClient } from 'pg';
import { SQLQuery } from './sql';
import { mapTxRow, mapTxUtxosRow } from './mappers';
import type * as QueryTypes from './types/queries';

export type DbSyncParams = {
  /**
   * PostgreSQL connection pool or pool configuration.
   * You can pass either:
   * - A pre-configured Pool instance
   * - A PoolConfig object to create a new pool
   */
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
      this.gracefulRelease(client);
      if (rows.length === 0) {
        throw new Error('No tip found');
      }
      return {
        hash: Hash(rows[0]!.hash),
        slot: BigInt(rows[0]!.slot)
      };
    } catch (error) {
      this.gracefulRelease(client);
      throw error;
    }
  }

  async getLatestTx({ maxFetch }: LatestTxReq): Promise<cardano.Tx> {
    //const client = await this.getClient();
    //try {
    //  const { rows } = await client.query<QueryTypes.Tx>(SQLQuery.get('latest_tx'), [maxFetch]);
    //  this.gracefulRelease(client);
    //  if (rows.length === 0) {
    //    throw new Error(`No transactions found`);
    //  }
    //  return mapTxRow(rows[0]!);
    //} catch (error) {
    //  this.gracefulRelease(client);
    //  throw error;
    //}
  }

  async getTx({ hash }: TxReq): Promise<cardano.Tx> {
    //const client = await this.getClient();
    //try {
    //  const { rows: txRows } = await client.query<QueryTypes.Tx>(SQLQuery.get('tx_by_hash'), [
    //    hash
    //  ]);
    //  if (txRows.length === 0) {
    //    this.gracefulRelease(client);
    //    throw new Error(`Transaction not found: ${hash}`);
    //  }
    //  const { rows: utxoRows } = await client.query<QueryTypes.TxUtxo>(SQLQuery.get('tx_utxos'), [
    //    hash
    //  ]);
    //  this.gracefulRelease(client);
    //  return mapTxUtxosRow(txRows[0]!, utxoRows);
    //} catch (error) {
    //  this.gracefulRelease(client);
    //  throw error;
    //}
  }

  async getCBOR({ hash }: TxReq): Promise<string> {
    //const client = await this.getClient();
    //try {
    //  const { rows } = await client.query<QueryTypes.TxCbor>(SQLQuery.get('tx_cbor'), [hash]);
    //  this.gracefulRelease(client);
    //  if (rows.length === 0) {
    //    throw new Error(`Transaction CBOR not found: ${hash}`);
    //  }
    //  return rows[0]!.cbor;
    //} catch (error) {
    //  this.gracefulRelease(client);
    //  throw error;
    //}
  }

  async getTxs({ before, limit }: TxsReq): Promise<TxsRes<cardano.UTxO, cardano.Tx, Cardano>> {
    //const client = await this.getClient();
    //try {
    //  const { rows } = await client.query<QueryTypes.Tx>(SQLQuery.get('txs_before'), [
    //    before,
    //    limit
    //  ]);
    //  this.gracefulRelease(client);
    //  return {
    //    total: 0n, // Total count not implemented
    //    data: rows.map(mapTxRow),
    //    nextCursor: rows.at(-1)?.hash
    //  };
    //} catch (error) {
    //  this.gracefulRelease(client);
    //  throw error;
    //}
  }

  async getBlocks(params: BlocksReq): Promise<BlocksRes> {
    return {
      data: [],
      total: 0n,
      nextCursor: Hash('')
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
