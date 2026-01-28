import type { Transport } from '@connectrpc/connect';
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
  TxsRes,
  type ChainProvider,
  type TxReq,
  type TxsReq
} from '@laceanatomy/provider-core';
import type { Cardano, cardano } from '@laceanatomy/types';
import { Hash } from '@laceanatomy/types';
import { UtxoRpcClient } from '@laceanatomy/utxorpc-sdk';
import { query, sync, type cardano as cardanoUtxoRpc } from '@utxorpc/spec';
import assert from 'assert';
import { Buffer } from 'buffer';
import { u5cToCardanoBlock, u5cToCardanoTx, u5cToCardanoUtxo, u5cToCardanoValue } from './mappers';

const DUMP_HISTORY_MAX_ITEMS = 1000;

export type Params = {
  /**
   * Pre-configured transport for the UTxORPC client.
   * Use createGrpcTransport from '@laceanatomy/utxorpc-sdk/transport/node' for Node.js
   * or from '@laceanatomy/utxorpc-sdk/transport/web' for browser.
   */
  transport: Transport;
};

export class U5CProvider implements ChainProvider<cardano.UTxO, cardano.Tx, Cardano> {
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

  private async getLatestTxs(
    limit: number,
    offset: number
  ): Promise<TxsRes<cardano.UTxO, cardano.Tx, Cardano>> {
    const blocksAndTxs: { block: cardanoUtxoRpc.Block; txs: cardanoUtxoRpc.Tx[] }[] = [];
    let nextSlot: bigint | undefined = 0n;

    do {
      const { block, nextToken: next } = await this.utxoRpc.sync.dumpHistory({ maxItems: DUMP_HISTORY_MAX_ITEMS, startToken: { slot: nextSlot } });
      nextSlot = next ? next.slot : undefined;
      block.forEach((blockItem => {
        const { block, body } = this.validateBlock(blockItem);
        if (body.tx.length > 0)
          blocksAndTxs.push({ block: block, txs: body.tx.reverse() });
      }))
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

  async readTip(): Promise<{ hash: Hash; slot: bigint }> {
    const tip = await this.utxoRpc.sync.readTip(new sync.ReadTipRequest());
    return {
      hash: Hash(Buffer.from(tip.tip!.hash).toString('hex')),
      slot: BigInt(tip.tip?.slot || 0)
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
    if ("block" in block) {
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
