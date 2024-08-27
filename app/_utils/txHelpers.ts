import { bech32 } from "bech32";
import type { Vector2d } from "konva/lib/types";
import { POLICY_LENGTH, getTransaction, getUtxo, isEmpty } from ".";
import type {
  Address,
  ICborAsset,
  ICborTransaction,
  ICborUtxo,
  Redeemers,
  Transaction,
  TransactionsBox,
  UtxoItem,
} from "../_interfaces";

const defaultPosition = { x: 0, y: 0 };
interface IGenerateUTXO extends ICborUtxo {
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
    const result = bech32.decode(address, 108);
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

const generateUTXO = ({
  txHash,
  index,
  assets,
  address,
  datum,
  redeemers,
  transactionBox,
  position = defaultPosition,
  distance = defaultPosition,
  isReferenceInput = false,
}: IGenerateUTXO): UtxoItem => {
  const exist = getUtxo(transactionBox)(txHash + "#" + index);
  if (exist) {
    return exist;
  }

  const redeemer = redeemers?.spends.find(
    (spend) =>
      spend.input.tx_hash + "#" + spend.input.index === txHash + "#" + index,
  );

  return {
    utxoHash: txHash + "#" + index,
    index,
    assets,
    address: formatAddress(address),
    datum,
    lines: [],
    pos: position,
    distance,
    isReferenceInput,
    redeemers: redeemer ?? undefined,
  };
};

const isCborUtxo = (inputs: any): inputs is ICborUtxo => {
  return "address" in inputs;
};

export const parseTxFromCbor = (
  txFromCbors: ICborTransaction[],
  transactionBox: TransactionsBox,
): Transaction[] =>
  txFromCbors.map((cbor) => {
    const mint: ICborAsset[] = cbor.mints;
    const inputsUTXO: UtxoItem[] = cbor.referenceInputs
      .concat(cbor.inputs)
      .map((input) => {
        const isReferenceInput = cbor.referenceInputs.some(
          (referenceInput) => referenceInput === input,
        );
        return generateUTXO({
          txHash: input.txHash,
          index: input.index,
          assets: isCborUtxo(input) ? input.assets : [],
          address: isCborUtxo(input) ? input.address : "",
          datum: isCborUtxo(input) && input.datum ? input.datum : undefined,
          transactionBox,
          isReferenceInput,
        });
      });

    const referenceInputsUTXO: UtxoItem[] = cbor.referenceInputs.map((input) =>
      generateUTXO({
        txHash: input.txHash,
        index: input.index,
        assets: isCborUtxo(input) ? input.assets : [],
        address: isCborUtxo(input) ? input.address : "",
        datum: isCborUtxo(input) && input.datum ? input.datum : undefined,
        transactionBox,
      }),
    );

    const outputsUTXO = cbor.outputs.map((output) =>
      generateUTXO({
        txHash: output.txHash,
        index: output.index,
        assets: output.assets,
        address: output.address,
        datum: output.datum ? output.datum : undefined,
        transactionBox,
      }),
    );
    const existsTx = getTransaction(transactionBox)(cbor.txHash);
    const alias = existsTx ? existsTx.alias : "";

    return {
      txHash: cbor.txHash,
      blockHeight: 0,
      blockAbsoluteSlot: 0,
      blockTimestamp: 0,
      fee: cbor.fee,
      metadata: "",
      mint: mint,
      pos: defaultPosition,
      inputsUTXO,
      referenceInputsUTXO,
      outputsUTXO,
      consumedLines: [],
      producedLines: [],
      alias,
    };
  });
