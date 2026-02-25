import type { Transport } from '@connectrpc/connect';
import { TxsRes } from '@laceanatomy/provider-core';
import type { Cardano, cardano } from '@laceanatomy/types';
import { Hash } from '@laceanatomy/types';
import { query, sync, type cardano as cardanoUtxoRpc } from '@utxorpc/spec';
import assert from 'assert';
import { Buffer } from 'buffer';
import { u5cToCardanoTx } from './mappers';
import { UtxoRpcProvider } from './base';

const DUMP_HISTORY_MAX_ITEMS = 100;

export type Params = {
  /**
   * Pre-configured transport for the UTxORPC client.
   * Use createGrpcTransport from '@laceanatomy/utxorpc-sdk/transport/node' for Node.js
   * or from '@laceanatomy/utxorpc-sdk/transport/web' for browser.
   */
  transport: Transport;
  /**
   * Bech32 prefix for address encoding (e.g. 'addr' for mainnet, 'addr_test' for testnet).
   */
  addressPrefix: string;
};

export class U5CProvider extends UtxoRpcProvider {
  constructor({ transport, addressPrefix }: Params) {
    super({ transport, addressPrefix });
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

  protected async getLatestTxs(
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

  protected async getTxsByBlock(
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

  protected async getTxsByAddress(
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
}

export { UtxoRpcProvider } from './base';
export * as mappers from './mappers';
