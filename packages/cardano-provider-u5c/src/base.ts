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

export type BaseParams = {
  transport: Transport;
  /**
   * Bech32 prefix for address encoding (e.g. 'addr' for mainnet, 'addr_test' for testnet).
   */
  addressPrefix: string;
};

export abstract class UtxoRpcProvider implements ChainProvider<cardano.UTxO, cardano.Tx, Cardano> {
  utxoRpc: UtxoRpcClient;
  protected addressPrefix: string;

  constructor({ transport, addressPrefix }: BaseParams) {
    this.utxoRpc = new UtxoRpcClient({ transport });
    this.addressPrefix = addressPrefix;
  }

  async getCBOR(params: TxReq): Promise<string> {
    const txResponse = await this.utxoRpc.query.readTx({ hash: Buffer.from(params.hash, 'hex') });
    const { cbor } = this.validateTx(txResponse);
    return Buffer.from(cbor).toString('hex');
  }

  abstract getLatestTx(): Promise<cardano.Tx>;

  async getTx({ hash }: TxReq): Promise<cardano.Tx> {
    const txResponse = await this.utxoRpc.query.readTx({ hash: Buffer.from(hash, 'hex') });
    const { tx, block } = this.validateTx(txResponse);

    const blockHash = Buffer.from(block.hash).toString('hex');
    const { body: fullBlockBody } = await this.fetchBlockByQuery({
      hash: Hash(Buffer.from(block.hash).toString('hex'))
    });

    return u5cToCardanoTx(
      tx,
      block.timestamp,
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
        { block: query.block, address: query.address?.toString() },
        limitValue,
        offsetValue
      );

    if (query.address) return this.getTxsByAddress(query.address.toString(), limitValue, offsetValue);

    throw new Error('Invalid query');
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
    } else throw new Error(`${this.constructor.name} cannot get blocks by epoch`);
  }

  async getEpoch(_params: EpochReq): Promise<EpochRes> {
    throw new Error(`${this.constructor.name} cannot get epoch`);
  }

  async getEpochs(_params: EpochsReq): Promise<EpochsRes> {
    throw new Error(`${this.constructor.name} cannot get epochs`);
  }

  async readTip(): Promise<{ hash: Hash; slot: bigint }> {
    const tip = await this.utxoRpc.sync.readTip(new sync.ReadTipRequest());
    return {
      hash: Hash(Buffer.from(tip.tip!.hash).toString('hex')),
      slot: BigInt(tip.tip?.slot || 0)
    };
  }

  protected async fetchBlockByQuery(
    query: { hash: Hash } | { height: bigint } | { slot: bigint }
  ) {
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

  protected validateBlock(block: sync.FetchBlockResponse | sync.AnyChainBlock): {
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
    assert(thisBlock.chain.value.header, 'Header body is undefined');
    return {
      block: thisBlock.chain.value,
      header: thisBlock.chain.value.header,
      body: thisBlock.chain.value.body
    };
  }

  protected validateTx(tx: query.ReadTxResponse): {
    tx: cardanoUtxoRpc.Tx;
    block: query.ChainPoint;
    cbor: Uint8Array;
  } {
    assert(tx.tx?.chain.case === 'cardano', 'Transaction is not a Cardano transaction');
    assert(tx.tx.blockRef, 'Block reference of transaction empty');
    return { tx: tx.tx.chain.value, block: tx.tx.blockRef, cbor: tx.tx.nativeBytes };
  }

  protected findTxIndexInBlock(blockBody: cardanoUtxoRpc.BlockBody, tx: cardanoUtxoRpc.Tx): number {
    return blockBody.tx.findIndex((t) => {
      const hashInBlock = Buffer.from(t.hash).toString('hex');
      const hashToFind = Buffer.from(tx.hash).toString('hex');
      return hashInBlock === hashToFind;
    });
  }

  protected abstract getLatestTxs(
    limit: number,
    offset: number
  ): Promise<TxsRes<cardano.UTxO, cardano.Tx, Cardano>>;

  protected abstract getTxsByBlock(
    query: { block: { hash: Hash } | { height: bigint } | { slot: bigint }; address?: string },
    limit: number,
    offset: number
  ): Promise<TxsRes<cardano.UTxO, cardano.Tx, Cardano>>;

  protected abstract getTxsByAddress(
    address: string,
    limit: number,
    offset: number
  ): Promise<TxsRes<cardano.UTxO, cardano.Tx, Cardano>>;
}
