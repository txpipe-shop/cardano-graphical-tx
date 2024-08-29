import { type Dispatch, type SetStateAction } from "react";
import type { IUserConfigs } from "../../_contexts";
import type {
  IGraphicalTransaction,
  TransactionsBox,
  UtxoObject,
} from "../../_interfaces";
import {
  getTxFromBlockfrost,
  getTxFromCbor,
  isHexa,
  parseTxToGraphical,
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
    fee: parseInt(data.fees),
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
    mints: [], // TODO: Complete
    scriptsSuccessful: true,
    blockHash: data.block,
    blockTxIndex: data.index,
    blockHeight: data.block_height,
    blockAbsoluteSlot: data.slot,
    invalidBefore: parseInt(data.invalid_before ?? ""),
    invalidHereafter: parseInt(data.invalid_hereafter ?? ""),
    redeemers: { spends: [], mints: [], withdrawals: [] }, // TODO: Fix this with the current data.redeemers
    metadata: data.metadata,
    size: data.size,
  };

  const tx = parseTxToGraphical([parsedData], transactions);
  const positionedTxs = setPosition(tx);

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
};
