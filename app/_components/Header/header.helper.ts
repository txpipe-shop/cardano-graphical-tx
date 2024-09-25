import { type Dispatch, type SetStateAction } from "react";
import type {
  IGraphicalTransaction,
  TransactionsBox,
  UtxoObject,
} from "../../_interfaces";
import {
  getTxFromCbor,
  isHexa,
  type NETWORK,
  parseTxToGraphical,
  setPosition,
} from "../../_utils";

export const setCBOR = async (
  network: NETWORK,
  uniqueInput: string,
  transactions: TransactionsBox,
  setTransactionBox: Dispatch<SetStateAction<TransactionsBox>>,
  setFetchError: Dispatch<SetStateAction<string>>,
  fromHash: boolean,
) => {
  try {
    const isInvalid = !isHexa(uniqueInput);
    if (isInvalid) throw new Error("Invalid CBOR");

    const cborTransaction = await getTxFromCbor(uniqueInput, network);

    const txs = parseTxToGraphical([cborTransaction], transactions);
    const positionedTxs = setPosition(txs);

    let newUtxosObject: UtxoObject = {};
    let newTransactionsList: IGraphicalTransaction[] = [];

    positionedTxs.forEach((tx) => {
      const newUtxos = [...tx.inputs, ...tx.outputs];

      newTransactionsList.push({ ...tx });

      newUtxos.forEach((utxo) => {
        newUtxosObject[utxo.txHash] = utxo;
      });
    });
    setTransactionBox({
      transactions: newTransactionsList,
      utxos: newUtxosObject,
    });
    setFetchError("");
  } catch (error) {
    console.error(`Error processing ${fromHash ? "hash" : "CBOR"}:`, error);
    setFetchError(`Error processing ${fromHash ? "hash" : "CBOR"}`);
  }
};
