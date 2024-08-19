import { StatusCodes } from "http-status-codes";
import { type Dispatch, type SetStateAction } from "react";
import {
  API_ROUTES,
  isHexa,
  NETWORK,
  parseQuery,
  parseTxFromCbor,
  setPosition,
  TransactionsBox,
} from ".";
import { IUserConfigs } from "../_contexts";
import {
  ICborTransaction,
  ICborUtxo,
  Transaction,
  UtxoObject,
} from "../_interfaces";

const cborToTransaction = async (
  cbor: string,
  network: NETWORK,
  setFetchError: Dispatch<SetStateAction<string>>,
): Promise<ICborTransaction> => {
  try {
    const query = { network };
    const formData = new FormData();
    formData.append("cbor", cbor);
    const res = await fetch(parseQuery(API_ROUTES.CBOR, query), {
      method: "POST",
      body: formData,
    });
    if (res.status !== StatusCodes.OK) throw res;

    const data: ICborTransaction & { warning?: string } = await res.json();

    if (data.warning) console.warn(data.warning);

    return data;
  } catch (err: any) {
    console.log(err);
    setFetchError(err.statusText);
    throw err;
  }
};

export const setCBOR = async (
  configs: IUserConfigs,
  uniqueInput: string,
  transactions: TransactionsBox,
  setTransactionBox: Dispatch<SetStateAction<TransactionsBox>>,
  setFetchError: Dispatch<SetStateAction<string>>,
) => {
  try {
    const isInvalid = !isHexa(uniqueInput);
    if (isInvalid) throw new Error("Invalid CBOR");

    const cborTransaction = await cborToTransaction(
      uniqueInput,
      configs.net,
      setFetchError,
    );

    const txs = parseTxFromCbor([cborTransaction], transactions);
    const positionedTxs = setPosition(txs);

    let newUtxosObject: UtxoObject = {};
    let newTransactionsList: Transaction[] = [];

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
    console.error("Error processing CBOR:", error);
    setFetchError("Error processing CBOR");
  }
};

export const isCborUtxo = (inputs: any): inputs is ICborUtxo => {
  return "address" in inputs;
};
