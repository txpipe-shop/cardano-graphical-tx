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
import {
  getBlockPreviousHash,
  outputsToValue,
  u5cToCardanoBlock,
  u5cToCardanoTx,
  u5cToCardanoUtxo
} from './mappers';

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

  // Check inputs
  async getLatestTx(): Promise<cardano.Tx> {
    const tip = await this.utxoRpc.sync.readTip(new sync.ReadTipRequest());

    let hash = Buffer.from(tip.tip!.hash);
    let block: cardanoUtxoRpc.Block;

    let fetchCount = 0;
    do {
      const rawBlock = await this.fetchBlock(hash);
      block = rawBlock.parsedBlock;
      assert(block.header?.hash, 'Block header hash is undefined');

      hash = Buffer.from(await getBlockPreviousHash(rawBlock.nativeBytes), 'hex');

      fetchCount++;
    } while (block.body?.tx.length === 0);

    const latestTx = block.body!.tx.at(-1);
    assert(latestTx, 'Latest transaction is undefined');

    const time = block.timestamp;
    const blockHash = Hash(Buffer.from(block.header.hash).toString('hex'));
    const height = block.header.height;

    const latestTxHash = Buffer.from(latestTx.hash).toString('hex');
    const indexInBlock = block.body?.tx.findIndex((t) => {
      const hash = Buffer.from(t.hash).toString('hex');
      return hash === latestTxHash;
    });
    assert(indexInBlock !== undefined, 'Index in block not found');

    return u5cToCardanoTx(latestTx, time, blockHash, height, indexInBlock);
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

    const value = outputsToValue(utxos);
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

    const allUtxos = utxosResponse.items.map(({ parsedState, txoRef }) => {
      assert(parsedState.case === 'cardano', Error('Invalid UTxO'));
      assert(txoRef?.hash, Error('Invalid UTxO'));
      assert(txoRef?.index !== undefined, Error('Invalid UTxO'));

      return u5cToCardanoUtxo(
        Hash(Buffer.from(txoRef.hash).toString('hex')),
        parsedState.value,
        txoRef.index
      );
    });

    const total = BigInt(allUtxos.length);

    let startIndex = 0;
    if (offset !== undefined && offset > 0n) {
      const cursorIndex = Number(offset);
      if (cursorIndex >= 0 && cursorIndex < allUtxos.length) {
        startIndex = cursorIndex + 1;
      } else if (cursorIndex >= allUtxos.length) {
        return {
          data: [],
          total
        };
      }
    }

    const endIndex = Math.min(startIndex + Number(limit), allUtxos.length);
    const data = allUtxos.slice(startIndex, endIndex);

    return {
      data,
      total
    };
  }

  async getTx({ hash }: TxReq): Promise<cardano.Tx> {
    const txResponse = await this.utxoRpc.query.readTx({ hash: Buffer.from(hash, 'hex') });
    assert(txResponse.tx?.chain.case === 'cardano', 'Transaction is not a Cardano transaction');
    assert(txResponse.tx.blockRef, 'Block reference of transaction empty');

    const tx = txResponse.tx.chain.value;
    const time = txResponse.tx.blockRef.timestamp;
    const blockHash = Buffer.from(txResponse.tx.blockRef.hash).toString('hex');
    const height = txResponse.tx.blockRef.height;

    const block = await this.utxoRpc.sync.fetchBlock({
      ref: [{ hash: Buffer.from(blockHash, 'hex') }]
    });
    const indexInBlock = block.block[0]?.chain.value?.body?.tx.findIndex((t) => {
      const txHash = Buffer.from(t.hash).toString('hex');
      return txHash === hash;
    });
    assert(indexInBlock !== undefined, 'Index in block not found');

    return u5cToCardanoTx(tx, time, Hash(blockHash), height, indexInBlock);
  }

  async getTxs(params: TxsReq): Promise<TxsRes<cardano.UTxO, cardano.Tx, Cardano>> {
    const { limit, query, offset } = params;

    if (!query || !Object.keys(query).length) {
      const { tip } = await this.utxoRpc.sync.readTip(new sync.ReadTipRequest());
      assert(tip, 'Cannot read tip');

      let txsToIgnore = Number(offset) || 0;
      let blocksAndTxs: { block: cardanoUtxoRpc.Block; txs: cardanoUtxoRpc.Tx[] }[] = [];

      let blockHash = Buffer.from(tip.hash);
      let blockRes = await this.utxoRpc.sync.fetchBlock({
        ref: [{ hash: blockHash }]
      });
      const { block, header: blockHeader, body: blockBody } = this.validateBlock(blockRes);
      txsToIgnore = this.processBlockForTxs(block, blockBody.tx, blocksAndTxs, txsToIgnore);

      let nextBlockHeight = blockHeader.height - 1n;
      while (blocksAndTxs.reduce((acc, block) => acc + block.txs.length, 0) < Number(limit)) {
        let blockRes = await this.utxoRpc.sync.fetchBlock({
          ref: [{ height: nextBlockHeight }]
        });
        const { block, body: blockBody } = this.validateBlock(blockRes);
        txsToIgnore = this.processBlockForTxs(block, blockBody.tx, blocksAndTxs, txsToIgnore);

        nextBlockHeight--;
      }

      const data = blocksAndTxs.flatMap(({ block, txs }) => {
        assert(block.header, 'Block header is undefined');
        const blockHash = Hash(Buffer.from(block.header.hash).toString('hex'));
        const blockHeight = block.header.height;
        const blockBody = block.body;
        assert(blockBody, 'Block body is undefined');

        return txs.map((tx) => {
          return u5cToCardanoTx(
            tx,
            block.timestamp,
            blockHash,
            blockHeight,
            this.findTxIndexInBlock(blockBody, tx)
          );
        });
      });

      return {
        data: data.slice(0, Number(limit)),
        // TODO: what is total when there is no query param?
        total: BigInt(0)
      };
    } else {
      if (query.block) {
        const { block, body, header } = await this.fetchBlockByQuery(query.block);

        const txsInBlock = body.tx.filter((tx) => {
          if ('address' in query) {
            return (
              tx.inputs.some(
                (i) => Buffer.from(i.asOutput?.address ?? '').toString('hex') === query.address
              ) || tx.outputs.some((o) => Buffer.from(o.address).toString('hex') === query.address)
            );
          }

          return true;
        });

        const txsToIgnore = Number(offset) || 0;
        const u5cTxs = txsInBlock.slice(txsToIgnore, txsToIgnore + Number(limit));

        const data = u5cTxs.map((tx) => {
          return u5cToCardanoTx(
            tx,
            block.timestamp,
            Hash(Buffer.from(header.hash).toString('hex')),
            header.height,
            this.findTxIndexInBlock(body, tx)
          );
        });

        return {
          data,
          total: BigInt(txsInBlock.length)
        };
      } else if (query.address) {
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
        });

        let txsToIgnore = Number(offset) || 0;
        let txsWithAddress = utxosResponse.items
          .filter((i) => i.txoRef !== undefined)
          .map((i) => i.txoRef!.hash);
        const u5cTxs = [];

        if (txsToIgnore > 0) {
          if (txsWithAddress.length > txsToIgnore) {
            txsWithAddress = txsWithAddress.slice(txsToIgnore);
            txsToIgnore = 0;
          } else {
            txsWithAddress = [];
            txsToIgnore = txsToIgnore - txsWithAddress.length;
          }
        } else {
          txsWithAddress = txsWithAddress.slice(0, Number(limit));
        }

        let txsWithAddressIndex = 0;
        while (txsWithAddress.length < Number(limit) || txsWithAddress.length !== u5cTxs.length) {
          const txResponse = await this.utxoRpc.query.readTx({
            hash: txsWithAddress[txsWithAddressIndex]
          });
          const { tx, block } = await this.validateTx(txResponse);
          // TODO: find index in block
          u5cTxs.push({ block, tx });

          txsWithAddress.push(
            ...tx.inputs
              .filter(
                (i) => Buffer.from(i.asOutput?.address ?? '').toString('hex') === query.address
              )
              .map((i) => i.txHash)
          );

          txsWithAddressIndex++;
        }

        const blocksWithTxs: Record<string, cardanoUtxoRpc.Tx[]> = u5cTxs.reduce(
          (acc, { block, tx }) => {
            const blockHash = Buffer.from(block.hash).toString('hex');
            acc[blockHash] = [...(acc[blockHash] || []), tx];

            return acc;
          },
          {} as Record<string, cardanoUtxoRpc.Tx[]>
        );

        const promiseData = Object.entries(blocksWithTxs).map(async ([hash, txs]) => {
          const blockResponse = await this.utxoRpc.sync.fetchBlock({
            ref: [{ hash: Buffer.from(hash, 'hex') }]
          });
          const { block, body, header } = this.validateBlock(blockResponse);

          return txs.map((tx) => {
            return u5cToCardanoTx(
              tx,
              block.timestamp,
              Hash(hash),
              header.height,
              this.findTxIndexInBlock(body, tx)
            );
          });
        });
        const data = (await Promise.all(promiseData)).flat();

        return {
          data,
          // We don't know the total number of transactions with an address
          total: 0n
        };
      } else {
        throw new Error('Invalid query');
      }
    }
  }

  async getBlock(params: BlockReq): Promise<BlockRes> {
    let blockResponse: sync.FetchBlockResponse | undefined;

    if ('hash' in params) {
      blockResponse = await this.utxoRpc.sync.fetchBlock({
        ref: [{ hash: Buffer.from(params.hash, 'hex') }]
      });
    } else if ('height' in params) {
      blockResponse = await this.utxoRpc.sync.fetchBlock({
        ref: [{ height: params.height }]
      });
    } else {
      blockResponse = await this.utxoRpc.sync.fetchBlock({
        ref: [{ slot: params.slot }]
      });
    }

    try {
      assert(blockResponse.block[0]?.chain.case === 'cardano', 'Block is not a Cardano block');
      const block = blockResponse.block[0]!.chain.value;

      return u5cToCardanoBlock(block);
    } catch (error) {
      throw error;
    }
  }

  async getBlocks(params: BlocksReq): Promise<BlocksRes> {
    const { limit, query, offset } = params;

    return {
      total: 0n,
      data: []
    };
  }

  async getEpoch(_params: EpochReq): Promise<EpochRes> {
    return {
      blocksProduced: 0n,
      index: 0n,
      endHeight: 0n,
      endSlot: 0n,
      endTime: 0,
      fees: 0n,
      startHeight: 0n,
      startSlot: 0n,
      startTime: 0,
      txCount: 0n
    };
  }

  async getEpochs(_params: EpochsReq): Promise<EpochsRes> {
    return { data: [], total: 0n };
  }

  async readTip(): Promise<{ hash: Hash; slot: bigint }> {
    const tip = await this.utxoRpc.sync.readTip(new sync.ReadTipRequest());
    return {
      hash: Hash(Buffer.from(tip.tip!.hash).toString('hex')),
      slot: BigInt(tip.tip?.slot || 0)
    };
  }

  // async getCBOR({ hash }: TxReq): Promise<string> {
  //   const txResponse = await this.utxoRpc.query.readTx({ hash: Buffer.from(hash, 'hex') });
  //   assert(txResponse.tx?.nativeBytes, 'Empty CBOR of transaction');
  //   return Buffer.from(txResponse.tx?.nativeBytes).toString('hex');
  // }

  private async fetchBlock(hash: Buffer<ArrayBuffer>) {
    const req = new sync.FetchBlockRequest({ ref: [new sync.BlockRef({ hash: hash })] });
    const blocks = await this.utxoRpc.sync.fetchBlock(req);
    const block = blocks.block[0];
    assert(block, 'Block not found');
    assert(block.chain.case === 'cardano', 'Chain should be Cardano');
    return { parsedBlock: block.chain.value, nativeBytes: block.nativeBytes };
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

  private validateBlock(block: sync.FetchBlockResponse) {
    assert(block.block[0], 'Block not found');
    const [thisBlock] = block.block;
    assert(thisBlock.chain.case === 'cardano', 'Block is not a Cardano block');
    assert(thisBlock.chain.value.body, 'Block body is undefined');
    assert(thisBlock.chain.value.header, 'Header body is undefined');
    return {
      block: thisBlock.chain.value,
      header: thisBlock.chain.value.header,
      body: thisBlock.chain.value.body
    };
  }

  private async validateTx(
    tx: query.ReadTxResponse
  ): Promise<{ tx: cardanoUtxoRpc.Tx; block: query.ChainPoint }> {
    assert(tx.tx?.chain.case === 'cardano', 'Transaction is not a Cardano transaction');
    assert(tx.tx.blockRef, 'Block reference of transaction empty');

    return { tx: tx.tx.chain.value, block: tx.tx.blockRef };
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
