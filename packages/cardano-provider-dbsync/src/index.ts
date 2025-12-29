import {
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
import { Address, cardano, DatumType, Unit } from '@alexandria/types';
import { Hash, HexString } from '@alexandria/types';
import type { Pool, PoolClient } from 'pg';
import { mapTx } from './mappers';
import { SQLQuery } from './sql';
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
    return {
      fee: 123n,
      hash: Hash(''),
      mint: {
        [Unit('sd')]: 123n
      },
      referenceInputs: [
        {
          address: Address(''),
          coin: 123n,
          outRef: {
            hash: Hash(''),
            index: 123n
          },
          value: { [Unit('')]: 123n },
          consumedBy: Hash('123'),
          datum: { type: DatumType.INLINE, datumHex: HexString('123') }
        }
      ],
      block: { hash: Hash(''), epochNo: 123n, height: 123n },
      createdAt: 123,
      inputs: [
        {
          address: Address(''),
          coin: 123n,
          outRef: {
            hash: Hash(''),
            index: 123n
          },
          value: { [Unit('')]: 123n },
          consumedBy: Hash('123'),
          datum: { type: DatumType.INLINE, datumHex: HexString('123') }
        }
      ],
      outputs: [
        {
          address: Address(''),
          coin: 123n,
          outRef: {
            hash: Hash(''),
            index: 123n
          },
          value: { [Unit('')]: 123n },
          consumedBy: Hash('123'),
          datum: { type: DatumType.INLINE, datumHex: HexString('123') }
        }
      ],
      metadata: new Map(),
      treasuryDonation: 123n,
      validityInterval: { invalidBefore: 123n, invalidHereafter: 123n },
      witnesses: {
        redeemers: [
          {
            fee: 123n,
            index: 12,
            purpose: cardano.RdmrPurpose.Mint,
            redeemerDataHash: HexString(''),
            scriptHash: HexString(''),
            unitMem: 123n,
            unitSteps: 123n
          }
        ],
        scripts: [
          {
            bytes: HexString(''),
            hash: HexString(''),
            type: cardano.ScriptType.Native
          }
        ]
      }
    };
  }

  async getCBOR({ hash }: TxReq): Promise<string> {
    return '';
  }

  async getTxs({ before, limit }: TxsReq): Promise<TxsRes<cardano.UTxO, cardano.Tx, Cardano>> {
    const client = await this.getClient();
    try {
      // Get total count
      const { rows: countRows } = await client.query<QueryTypes.TotalTxs>(
        SQLQuery.get('txs_count')
      );
      const total = BigInt(countRows[0]?.total || 0);

      // Get transactions
      const { rows } = await client.query<QueryTypes.Txs>(SQLQuery.get('txs'), [
        before ? before.toString() : null,
        limit
      ]);

      const items = rows.map((row) => mapTx(row.result));

      // Calculate next cursor
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
