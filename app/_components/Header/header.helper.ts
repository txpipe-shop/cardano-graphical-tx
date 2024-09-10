import { type Dispatch, type SetStateAction } from "react";
import type { IUserConfigs } from "../../_contexts";
import type {
  IGraphicalTransaction,
  TransactionsBox,
  UtxoObject,
} from "../../_interfaces";
import {
  getTxFromCbor,
  isHexa,
  parseTxToGraphical,
  setPosition,
} from "../../_utils";

export const setCBOR = async (
  configs: IUserConfigs,
  uniqueInput: string,
  transactions: TransactionsBox,
  setTransactionBox: Dispatch<SetStateAction<TransactionsBox>>,
  setFetchError: Dispatch<SetStateAction<string>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  fromHash: boolean,
) => {
  try {
    const isInvalid = !isHexa(uniqueInput);
    if (isInvalid) throw new Error("Invalid CBOR");

    const cborTransaction = await getTxFromCbor(
      uniqueInput,
      configs.net,
      setFetchError,
    );

    const txs = parseTxToGraphical([cborTransaction], transactions);
    const positionedTxs = setPosition(txs);

    let newUtxosObject: UtxoObject = {};
    let newTransactionsList: IGraphicalTransaction[] = [];

    positionedTxs.forEach((tx) => {
      const newUtxos = [...tx.inputsUTXO, ...tx.outputsUTXO];

      newTransactionsList.push({ ...tx });

      newUtxos.forEach((utxo) => {
        newUtxosObject[utxo.utxoHash] = utxo;
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
  } finally {
    setLoading(false);
  }
};
