import { bech32 } from "bech32";
import type { Vector2d } from "konva/lib/types";
import type { Utxo } from "~/napi-pallas";
import {
  POLICY_LENGTH,
  defaultPosition,
  getTransaction,
  getUtxo,
  isEmpty,
} from ".";
import type {
  Address,
  IGraphicalTransaction,
  IGraphicalUtxo,
  ITransaction,
  Redeemers,
  TransactionsBox,
} from "../_interfaces";

interface IGenerateUTXO extends Utxo {
  redeemers?: Redeemers;
  transactionBox: TransactionsBox;
  position?: Vector2d;
  isReferenceInput?: boolean;
  distance?: Vector2d;
}

/**
 * Given a bech32 address, returns an object with the full address information.
 *
 * @param address - A string representing an address in bech32 format.
 * @returns - An object containing the bech32 address, the header type, the network type,
 * the payment part, and the kind of address (key or script).
 */
const formatAddress = (address: string): Address | undefined => {
  let hexAddress = "";
  if (!isEmpty(address)) {
    // TODO: Add base58 address decoding for byron addresses
    const result = bech32.decodeUnsafe(address, 108);
    if (!result) return undefined;
    const unwords = bech32.fromWords(result.words);
    hexAddress = Buffer.from(unwords).toString("hex");
  }
  return isEmpty(address) || !hexAddress[0] || !hexAddress[1]
    ? undefined
    : {
        bech32: address,
        headerType: hexAddress[0],
        netType: hexAddress[1],
        payment: hexAddress.slice(2, POLICY_LENGTH),
        kind: Number(hexAddress[0]) % 2 === 0 ? "key" : "script",
      };
};

const generateGraphicalUTXO = ({
  txHash,
  index,
  bytes,
  address,
  lovelace,
  datum,
  assets,
  scriptRef,
  redeemers,
  transactionBox,
  position = defaultPosition,
  distance = defaultPosition,
  isReferenceInput = false,
}: IGenerateUTXO): IGraphicalUtxo => {
  const exist = getUtxo(transactionBox)(txHash + "#" + index);
  if (exist) {
    return exist;
  }

  const redeemer = redeemers?.spends.find(
    (spend) =>
      spend.input.tx_hash + "#" + spend.input.index === txHash + "#" + index,
  );
  return {
    txHash: txHash + "#" + index,
    index,
    bytes,
    address: formatAddress(address),
    lovelace,
    datum,
    assets,
    scriptRef,
    lines: [],
    pos: position,
    distance,
    isReferenceInput,
    redeemers: redeemer ?? undefined,
  };
};

export const parseTxToGraphical = (
  txFromCbors: ITransaction[],
  transactionBox: TransactionsBox,
): IGraphicalTransaction[] =>
  txFromCbors.map((cbor) => {
    const inputs: IGraphicalUtxo[] = cbor.referenceInputs
      .concat(cbor.inputs)
      .map((input) =>
        generateGraphicalUTXO({
          ...input,
          transactionBox,
          isReferenceInput: cbor.referenceInputs.some(
            (referenceInput) => referenceInput === input,
          ),
        }),
      );

    const outputs = cbor.outputs.map((output) =>
      generateGraphicalUTXO({
        ...output,
        transactionBox,
      }),
    );
    const existsTx = getTransaction(transactionBox)(cbor.txHash);
    const alias = existsTx ? existsTx.alias : "";

    return {
      ...cbor,
      pos: defaultPosition,
      outputs,
      inputs,
      producedLines: [],
      consumedLines: [],
      alias,
    };
  });
