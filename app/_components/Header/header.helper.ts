import { type Dispatch, type SetStateAction } from "react";
import type { IUserConfigs } from "../../_contexts";
import type {
  Transaction,
  TransactionsBox,
  UtxoObject,
} from "../../_interfaces";
import {
  getTxFromBlockfrost,
  getTxFromCbor,
  isHexa,
  parseTxFromCbor,
  POLICY_LENGTH,
  setPosition,
} from "../../_utils";

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

    const cborTransaction = await getTxFromCbor(
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

export const setHash = async (
  configs: IUserConfigs,
  uniqueInput: string,
  transactions: TransactionsBox,
  setTransactionBox: Dispatch<SetStateAction<TransactionsBox>>,
  setFetchError: Dispatch<SetStateAction<string>>,
) => {
  const data = await getTxFromBlockfrost(
    uniqueInput,
    configs.net,
    setFetchError,
  );
  const parsedData = {
    txHash: data.hash,
    inputs: data.inputs
      .filter((input) => !input.reference)
      .map((input) => ({
        txHash: input.tx_hash,
        index: input.output_index,
      })),
    referenceInputs: data.inputs
      .filter((input) => input.reference)
      .map((input) => ({
        txHash: input.tx_hash,
        index: input.output_index,
      })),
    outputs: data.outputs.map((output) => ({
      txHash: data.hash,
      index: output.output_index,
      address: output.address,
      assets: output.amount.map((amount) => ({
        policyId:
          amount.unit === "lovelace" ? "" : amount.unit.slice(0, POLICY_LENGTH),
        assetName:
          amount.unit === "lovelace"
            ? "lovelace"
            : amount.unit.slice(POLICY_LENGTH, amount.unit.length),
        amount: BigInt(amount.quantity),
        datum: output.inline_datum,
      })),
    })),
    // TODO: Change
    fee: 0,
    mints: [],
    scriptsSuccessful: false,
  };

  const tx = parseTxFromCbor([parsedData], transactions);
  const positionedTxs = setPosition(tx);

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
};
