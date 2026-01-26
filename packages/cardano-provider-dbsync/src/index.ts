import {
  AddressFundsReq,
  AddressFundsRes,
  AddressUTxOsReq,
  AddressUTxOsRes,
  BlockReq,
  BlockRes,
  BlocksReq,
  BlocksRes,
  EpochReq,
  EpochRes,
  EpochsReq,
  EpochsRes,
  LatestTxRes,
  TxsReq,
  TxsRes,
  type ChainProvider,
  type TxReq
} from '@laceanatomy/provider-core';
import type { Cardano } from '@laceanatomy/types';
import { cardano, Hash, HexString, hexToBech32, isBase58, Unit } from '@laceanatomy/types';
import type { Pool, PoolClient } from 'pg';
import { mapTx, mapUtxo } from './mappers';
import { SQLQuery } from './sql';
import type * as QueryTypes from './types/queries';
import { cborParseBlock, downloadBlock } from '@laceanatomy/napi-pallas';
import assert from 'assert';

export type DbSyncParams = {
  pool: Pool;
  addrPrefix: string;
  nodeUrl: string;
  magic: number;
};

export class DbSyncProvider implements ChainProvider<cardano.UTxO, cardano.Tx, Cardano> {
  private pool: Pool;
  private nodeUrl: string;
  private magic: number;
  private addrPrefix: string;

  constructor({ pool, addrPrefix, nodeUrl, magic }: DbSyncParams) {
    this.pool = pool;
    this.addrPrefix = addrPrefix;
    this.nodeUrl = nodeUrl;
    this.magic = magic;
  }

  private async getClient(): Promise<PoolClient> {
    return this.pool.connect();
  }

  private gracefulRelease(client: PoolClient): void {
    client.release();
  }

  /**
   * If address is in base58 format, return as it is (Byron format).
   * Otherwise return in bech32 format.
   */
  private normalizeAddress(address: string, prefix: string): string {
    return isBase58(address) ? address : hexToBech32(HexString(address), prefix);
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

  async getAddressFunds(params: AddressFundsReq): Promise<AddressFundsRes> {
    const client = await this.getClient();
    try {
      const address = this.normalizeAddress(params.address, this.addrPrefix);

      const { rows } = await client.query<QueryTypes.AddressFunds>(SQLQuery.get('address_funds'), [
        address
      ]);

      if (rows.length === 0) {
        return { value: { [Unit('lovelace')]: 0n }, txCount: 0n };
      }

      const row = rows[0]!;
      const valueResult: Record<string, bigint> = {
        [Unit('lovelace')]: BigInt(row.lovelace || '0')
      };

      if (row.assets && typeof row.assets === 'object') {
        for (const [unit, quantity] of Object.entries(row.assets)) {
          valueResult[Unit(unit)] = BigInt(quantity);
        }
      }

      return {
        value: valueResult,
        txCount: BigInt(row.txCount || '0')
      };
    } finally {
      this.gracefulRelease(client);
    }
  }

  async getAddressUTxOs(params: AddressUTxOsReq): Promise<AddressUTxOsRes<cardano.UTxO>> {
    const client = await this.getClient();
    try {
      const address = this.normalizeAddress(params.query.address, this.addrPrefix);
      const offset = (params.offset || 0n).toString();
      const limit = params.limit;

      const { rows } = await client.query<QueryTypes.AddressUTxOs>(SQLQuery.get('address_utxos'), [
        address,
        offset,
        limit
      ]);

      if (rows.length === 0 || !rows[0]?.utxos) {
        return {
          data: [],
          total: 0n
        };
      }

      const row = rows[0]!;
      const total = BigInt(row.total || '0');
      const utxos: cardano.UTxO[] = (row.utxos || []).map((utxo) => mapUtxo(utxo));

      return {
        data: utxos,
        total: total
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

  async getCBOR(txReq: TxReq): Promise<HexString> {
    const tx = await this.getTx(txReq);
    const blockCbor = new Buffer(
      await downloadBlock(this.nodeUrl, this.magic, Number(tx.block.slot), tx.block.hash)
    ).toString('hex');
    const safeCbor = cborParseBlock(blockCbor);
    assert(!safeCbor.error, safeCbor.error);
    const cborParsed = safeCbor.cborRes!;
    const parsedTx = cborParsed.transactions.find((x) => x.txHash === txReq.hash);
    assert(parsedTx && parsedTx.cbor, `Cbor for tx not found`);
    return HexString(parsedTx.cbor);
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
    offset,
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
        (offset || 0n).toString(),
        limit,
        address,
        blockHash,
        blockHeight,
        blockSlot
      ]);

      const items = rows.map((row) => mapTx(row.result));

      return {
        total: total,
        data: items
      };
    } finally {
      this.gracefulRelease(client);
    }
  }

  async getBlocks({ offset, query, limit }: BlocksReq): Promise<BlocksRes> {
    const client = await this.getClient();

    try {
      const { epoch } = query || {};
      console.log(epoch);
      const { rows } = await client.query<QueryTypes.Block>(SQLQuery.get('blocks'), [
        (offset || 0n).toString(),
        limit,
        epoch?.toString() ?? null
      ]);

      const { rows: countRows } = await client.query<QueryTypes.TotalBlocks>(
        SQLQuery.get('blocks_count'),
        [epoch?.toString() || null]
      );
      const total = BigInt(countRows[0]?.total || 0);

      return {
        data: rows.map((row) => ({
          fees: BigInt(row.fees),
          hash: Hash(row.hash),
          height: BigInt(row.height),
          slot: BigInt(row.slot),
          time: row.time,
          txCount: BigInt(row.txCount),
          confirmations: BigInt(row.confirmations)
        })),
        total: total
      };
    } finally {
      this.gracefulRelease(client);
    }
  }

  async getBlock(params: BlockReq): Promise<BlockRes> {
    const client = await this.getClient();
    let hash: string | null = null;
    let height: string | null = null;
    let slot: string | null = null;

    if ('hash' in params) {
      hash = params.hash.toString();
    } else if ('height' in params) {
      height = params.height.toString();
    } else {
      slot = params.slot.toString();
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

  async getEpochs({ offset, limit }: EpochsReq): Promise<EpochsRes> {
    const client = await this.getClient();

    try {
      const { rows: epochsRows } = await client.query<QueryTypes.Epoch>(SQLQuery.get('epochs'), [
        (offset || 0n).toString(),
        limit
      ]);
      const { rows: epochsCountRows } = await client.query<QueryTypes.TotalEpochs>(
        SQLQuery.get('epochs_count')
      );

      return {
        data: epochsRows.map((row) => ({
          startTime: row.startTime,
          endTime: row.endTime,
          txCount: BigInt(row.txCount),
          blocksProduced: BigInt(row.blkCount),
          fees: BigInt(row.fees),
          index: BigInt(row.epoch),
          startSlot: 0n,
          endSlot: 0n,
          startHeight: 0n,
          endHeight: 0n
        })),
        total: BigInt(epochsCountRows[0]!.total)
      };
    } finally {
      this.gracefulRelease(client);
    }
  }

  async getEpoch({ epochNo }: EpochReq): Promise<EpochRes> {
    const client = await this.getClient();

    try {
      const { rows } = await client.query<QueryTypes.Epoch>(SQLQuery.get('epoch'), [
        epochNo.toString()
      ]);

      if (rows.length === 0) {
        throw new Error('Epoch not found');
      }

      const row = rows[0]!;

      return {
        startTime: row.startTime,
        endTime: row.endTime,
        txCount: BigInt(row.txCount),
        blocksProduced: BigInt(row.blkCount),
        fees: BigInt(row.fees),
        index: BigInt(row.epoch),
        startSlot: 0n,
        endSlot: 0n,
        startHeight: 0n,
        endHeight: 0n
      };
    } finally {
      this.gracefulRelease(client);
    }
  }

  async getNetworkStats(): Promise<{
    blockHeight: bigint;
    txCount: bigint;
    addresses: bigint;
    avgBlockTime: number;
  }> {
    const client = await this.getClient();
    try {
      const { rows } = await client.query<QueryTypes.NetworkStats>(SQLQuery.get('network_stats'));
      if (rows.length === 0) {
        throw new Error('Network stats not found');
      }

      const row = rows[0]!;
      return {
        blockHeight: BigInt(row.block_height),
        txCount: BigInt(row.tx_count),
        addresses: BigInt(row.addresses),
        avgBlockTime: row.avg_block_time
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

