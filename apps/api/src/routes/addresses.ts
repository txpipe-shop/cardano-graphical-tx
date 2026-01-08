import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import * as schemas from '../schemas';
import { DbSyncProvider } from '@alexandria/cardano-provider-dbsync';
import {
  Address,
  assetNameFromUnit,
  HexString,
  hexToBech32,
  isBase58,
  policyFromUnit,
  fingerprintFromUnit,
  Unit
} from '@alexandria/types';
import type { Address as AddressRes } from '../types';

const addressParamSchema = z.object({
  address: z.string()
});

export function addressesRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.get(
    '/addresses/:address',
    {
      schema: {
        tags: ['Addresses'],
        params: addressParamSchema,
        querystring: z.object({
          network: schemas.NetworkSchema
        }),
        response: {
          200: schemas.AddressSchema
        }
      }
    },
    async (request, _reply) => {
      const { address: rawAddress } = addressParamSchema.parse(request.params);
      const pool = server.pg;

      const provider = new DbSyncProvider({ pool, addrPrefix: 'addr' });

      const address = Address(rawAddress);
      const funds = await provider.getAddressFunds({ address });

      const balanceLovelace = Number(funds.value[Unit('lovelace')]?.toString() || 0);

      // TODO: API needs to have pagination over this (I'd do this with different endpoints)
      const { data: txs, total: totalTxs } = await provider.getTxs({
        limit: 100,
        query: { address: Address(rawAddress) }
      });

      // TODO: API needs to have pagination over this (I'd do this with different endpoints)
      const { data: outputs, total: totalUtxos } = await provider.getAddressUTxOs({
        query: { address },
        limit: 100
      });
      const transactions: AddressRes['transactions'] = txs.map((tx) => {
        return {
          amount_ada: Number(123),
          amount_lovelace: Number(123),
          block_height: Number(tx.block?.height),
          hash: tx.hash,
          received_ada: Number(123),
          sent_ada: Number(123),
          slot: Number(123),
          timestamp: tx.createdAt ? new Date(tx.createdAt).toISOString() : null,
          tx_index: Number(tx.indexInBlock),
          // TODO: ask what type means for a tx
          type: 'both'
        };
      });

      const utxos: AddressRes['utxos'] = outputs.map((x) => ({
        amount_ada: Number(x.coin),
        amount_lovelace: Number(x.coin),
        block_height: 0,
        slot: 0,
        output_index: Number(x.outRef.index),
        tx_hash: x.outRef.hash,
        utxo_id: `${x.outRef.hash}#${x.outRef.index}`
      }));

      const tokens: AddressRes['tokens'] = Object.entries(funds.value).map(([u, amount]) => {
        const unit = u as Unit;
        return {
          asset_name: assetNameFromUnit(unit),
          asset_name_hex: assetNameFromUnit(unit),
          policy_id: policyFromUnit(unit),
          balance_formatted: null,
          decimals: null,
          fingerprint: fingerprintFromUnit(unit),
          // why multiple ways of specifying amounts?
          balance: amount.toString(),
          quantity: amount.toString(),
          name: null
        };
      });

      return {
        address: address,
        balance_lovelace: balanceLovelace,
        tx_count: Number(totalTxs),
        balance_ada: 123,
        address_bech32: isBase58(address) ? null : hexToBech32(HexString(address), 'addr'),
        first_seen_height: undefined,
        first_seen_slot: undefined,
        last_seen_height: undefined,
        last_seen_slot: undefined,
        total_utxo_count: undefined,
        unspent_utxo_count: Number(totalUtxos),
        tokens,
        transactions,
        utxos
      };
    }
  );
}
