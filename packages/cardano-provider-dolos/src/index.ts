import type { Transport } from '@connectrpc/connect';
import {
  CardanoAddressesApi,
  CardanoBlocksApi,
  CardanoTransactionsApi,
  Configuration,
  TxsGetOrderEnum
} from '@laceanatomy/blockfrost-sdk';
import { TxsRes } from '@laceanatomy/provider-core';
import type { Cardano, cardano } from '@laceanatomy/types';
import { Hash, hexToBech32, HexString } from '@laceanatomy/types';
import { UtxoRpcProvider } from '@laceanatomy/cardano-provider-u5c';
import { u5cToCardanoTx } from '@laceanatomy/cardano-provider-u5c/mappers';
import assert from 'assert';
import { Buffer } from 'buffer';

export type Params = {
  /**
   * Pre-configured transport for the UTxORPC client.
   * Use createGrpcTransport from '@laceanatomy/utxorpc-sdk/transport/node' for Node.js.
   */
  transport: Transport;
  /**
   * Base URL for the mini-blockfrost HTTP API (e.g. http://hostname:3000).
   */
  minibfUrl: string;
  /**
   * Bech32 prefix for address encoding (e.g. 'addr' for mainnet, 'addr_test' for testnet).
   */
  addressPrefix: string;
};

export class DolosProvider extends UtxoRpcProvider {
  bfTxs: CardanoTransactionsApi;
  bfBlocks: CardanoBlocksApi;
  bfAddresses: CardanoAddressesApi;

  constructor({ transport, minibfUrl, addressPrefix }: Params) {
    super({ transport, addressPrefix });
    const bfConfig = new Configuration({ basePath: minibfUrl });
    this.bfTxs = new CardanoTransactionsApi(bfConfig);
    this.bfBlocks = new CardanoBlocksApi(bfConfig);
    this.bfAddresses = new CardanoAddressesApi(bfConfig);
  }

  async getLatestTx(): Promise<cardano.Tx> {
    const { data: txList } = await this.bfTxs.txsGet(1, 1, TxsGetOrderEnum.Desc);
    assert(txList && txList.length > 0, 'No transactions found');
    const { tx_hash, tx_index, block_time } = txList[0]!;

    const txResponse = await this.utxoRpc.query.readTx({
      hash: Buffer.from(tx_hash, 'hex')
    });
    const { tx, block } = this.validateTx(txResponse);

    const blockHash = Hash(Buffer.from(block.hash).toString('hex'));
    return u5cToCardanoTx(tx, BigInt(block_time), blockHash, block.height, block.slot, tx_index);
  }

  protected async getLatestTxs(
    limit: number,
    offset: number
  ): Promise<TxsRes<cardano.UTxO, cardano.Tx, Cardano>> {
    const page = Math.floor(offset / limit) + 1;
    const { data: txList } = await this.bfTxs.txsGet(limit, page, TxsGetOrderEnum.Desc);

    if (!txList || txList.length === 0) return { data: [], total: 0n };

    const results = await Promise.allSettled(
      txList.map(async ({ tx_hash, tx_index, block_time }) => {
        const txResponse = await this.utxoRpc.query.readTx({
          hash: Buffer.from(tx_hash, 'hex')
        });
        const { tx, block } = this.validateTx(txResponse);
        const blockHash = Hash(Buffer.from(block.hash).toString('hex'));
        return u5cToCardanoTx(
          tx,
          BigInt(block_time),
          blockHash,
          block.height,
          block.slot,
          tx_index
        );
      })
    );

    const data = results
      .filter((r): r is PromiseFulfilledResult<cardano.Tx> => r.status === 'fulfilled')
      .map((r) => r.value);

    return { data, total: 0n };
  }

  protected async getTxsByBlock(
    blockQuery: { block: { hash: Hash } | { height: bigint } | { slot: bigint }; address?: string },
    limit: number,
    offset: number
  ): Promise<TxsRes<cardano.UTxO, cardano.Tx, Cardano>> {
    // Resolve the block identifier to hash or number for minibf
    let hashOrNumber: string;
    if ('hash' in blockQuery.block) {
      hashOrNumber = blockQuery.block.hash.toString();
    } else if ('height' in blockQuery.block) {
      hashOrNumber = blockQuery.block.height.toString();
    } else {
      // slot — need to fetch block first to get hash
      const { header } = await this.fetchBlockByQuery(blockQuery.block);
      hashOrNumber = Buffer.from(header.hash).toString('hex');
    }

    // Get all tx hashes in this block from minibf
    const { data: allHashes } = await this.bfBlocks.blocksHashOrNumberTxsGet(hashOrNumber);
    assert(Array.isArray(allHashes), 'Expected array of tx hashes');

    const total = BigInt(allHashes.length);
    const pageHashes = allHashes.slice(offset, offset + limit);

    if (pageHashes.length === 0) return { data: [], total };

    // Fetch the block once to get timestamp/header info
    const blockRef =
      'hash' in blockQuery.block
        ? { hash: Hash(hashOrNumber) }
        : 'height' in blockQuery.block
          ? { height: blockQuery.block.height }
          : { hash: Hash(hashOrNumber) };

    const { block, header } = await this.fetchBlockByQuery(blockRef);
    const blockHash = Hash(Buffer.from(header.hash).toString('hex'));

    const results = await Promise.allSettled(
      pageHashes.map(async (txHash) => {
        const txResponse = await this.utxoRpc.query.readTx({
          hash: Buffer.from(txHash, 'hex')
        });
        const { tx } = this.validateTx(txResponse);
        const txIndex = allHashes.indexOf(txHash);
        return u5cToCardanoTx(tx, block.timestamp, blockHash, header.height, header.slot, txIndex);
      })
    );

    const data = results
      .filter((r): r is PromiseFulfilledResult<cardano.Tx> => r.status === 'fulfilled')
      .map((r) => r.value);

    // Filter by address if provided
    if (blockQuery.address) {
      const addressHex = blockQuery.address;
      const filtered = data.filter((tx) => {
        const matchesInput = tx.inputs.some((input) => input.address.toString() === addressHex);
        const matchesOutput = tx.outputs.some((output) => output.address.toString() === addressHex);
        return matchesInput || matchesOutput;
      });
      return { data: filtered, total };
    }

    return { data, total };
  }

  protected async getTxsByAddress(
    addressHex: string,
    limit: number,
    offset: number
  ): Promise<TxsRes<cardano.UTxO, cardano.Tx, Cardano>> {
    const page = Math.floor(offset / limit) + 1;

    const addressBech32 = hexToBech32(HexString(addressHex), this.addressPrefix);

    const { data: txList } = await this.bfAddresses.addressesAddressTransactionsGet(
      addressBech32,
      limit,
      page
    );

    if (!txList || txList.length === 0) return { data: [], total: 0n };

    const results = await Promise.allSettled(
      txList.map(async ({ tx_hash, tx_index, block_time }) => {
        const txResponse = await this.utxoRpc.query.readTx({
          hash: Buffer.from(tx_hash, 'hex')
        });
        const { tx, block } = this.validateTx(txResponse);
        const blockHash = Hash(Buffer.from(block.hash).toString('hex'));
        return u5cToCardanoTx(
          tx,
          BigInt(block_time),
          blockHash,
          block.height,
          block.slot,
          tx_index
        );
      })
    );

    const data = results
      .filter((r): r is PromiseFulfilledResult<cardano.Tx> => r.status === 'fulfilled')
      .map((r) => r.value);

    return { data, total: 0n };
  }
}
