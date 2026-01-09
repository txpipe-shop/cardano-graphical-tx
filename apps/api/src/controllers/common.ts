import { BlockMetadata } from '@alexandria/provider-core';
import {
  Address,
  assetNameFromUnit,
  cardano,
  fingerprintFromUnit,
  hexToBech32,
  isHexString,
  policyFromUnit,
  Unit
} from '@alexandria/types';
import { TransactionsResponse } from '../types';

type TxApi = TransactionsResponse['transactions'][number];

export function mapTx(tx: cardano.Tx, block?: BlockMetadata): TxApi {
  const toBech32 = (x: Address) => {
    if (isHexString(x)) {
      return hexToBech32(x, 'addr');
    } else {
      return null;
    }
  };

  const addressesIn = tx.inputs.map(({ address }) => address);
  const addressesInB32 = addressesIn.map(toBech32).filter((x): x is string => x !== null);

  const inputs: TxApi['inputs'] = tx.inputs.map((x, i) => ({
    address: x.address,
    address_bech32: toBech32(x.address),
    amount_ada: Number(x.coin) / 10 ** 6,
    amount_lovelace: Number(x.coin),
    input_index: i,
    utxo_id: `${x.outRef.hash}#${x.outRef.index}`
  }));

  const outputs: TxApi['outputs'] = tx.outputs.map((x) => {
    const tokens: NonNullable<TxApi['outputs']>[number]['tokens'] = Object.entries(x.value).map(
      ([u, amount]) => {
        const unit = Unit(u);
        return {
          asset_name: assetNameFromUnit(unit),
          asset_name_hex: assetNameFromUnit(unit),
          policy_id: policyFromUnit(unit),
          // TODO: balance formatted into what
          balance_formatted: null,
          // TODO: get from token registry?
          decimals: null,
          fingerprint: fingerprintFromUnit(unit),
          // why multiple ways of specifying amounts?
          balance: amount.toString(),
          quantity: amount.toString(),
          // TODO: just utf8 of hex name or also support cip68?
          name: null,
          // EVM fields
          symbol: undefined,
          token_address: undefined,
          token_name: undefined,
          token_symbol: undefined,
          value: undefined
        };
      }
    );
    return {
      address: x.address,
      address_bech32: toBech32(x.address),
      amount_ada: Number(x.coin) / 10 ** 6,
      amount_lovelace: Number(x.coin),
      output_index: Number(x.outRef.index),
      tokens
    };
  });

  return {
    block_height: Number(tx.block.height),
    output_count: tx.outputs.length,
    hash: tx.hash,
    // TODO: what's the difference here
    status: 'confirmed',
    timestamp: tx.createdAt ? new Date(tx.createdAt * 1000).toISOString() : null,
    // TODO: what ada amount, inputs, outputs?
    ada_amount: 123,
    block_hash: tx.block.hash,
    block_slot: Number(tx.block.slot),
    // TODO: load it into the transactions object
    confirmations: block ? Number(block.confirmations) : null,
    epoch: Number(tx.block.epochNo),
    fee: Number(tx.fee),
    fee_ada: Number(tx.fee) / 10 ** 6,
    from_addresses: addressesIn,
    from_addresses_bech32: addressesInB32,
    index: Number(tx.indexInBlock),
    input_count: tx.inputs.length,
    // TODO: what do these mean?
    error: null,
    is_valid: true,
    inputs,
    outputs
  };
}
