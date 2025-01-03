import { type Dispatch, type SetStateAction } from "react";
import type {
  IGraphicalTransaction,
  TransactionsBox,
  UtxoObject,
} from "~/app/_interfaces";
import {
  getTxFromCbor,
  isHexa,
  type NETWORK,
  parseTxToGraphical,
  setPosition,
} from "~/app/_utils";

export const setCBOR = async (
  network: NETWORK,
  uniqueInput: string,
  transactions: TransactionsBox,
  setTransactionBox: Dispatch<SetStateAction<TransactionsBox>>,
  setError: Dispatch<SetStateAction<string>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  fromHash?: boolean,
) => {
  try {
    setLoading(true);
    const isInvalid = !isHexa(uniqueInput);
    if (isInvalid) throw new Error("Invalid CBOR");

    const transaction = await getTxFromCbor(uniqueInput, network);

    const txs = parseTxToGraphical([transaction], transactions);
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
  } catch (error: Response | any) {
    console.error(`Error processing ${fromHash ? "hash" : "CBOR"}:`, error);
    setError(
      `Error processing ${fromHash ? "hash" : "CBOR"}: ` +
        error.statusText.slice(7),
    );
  } finally {
    setLoading(false);
  }
};
