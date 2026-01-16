import type { IGraphicalTransaction, TransactionsBox } from "../_interfaces";

export const getTransaction =
  (transactionBox: TransactionsBox) => (txHash: string) => {
    return transactionBox.transactions.find((tx) => tx.txHash === txHash);
  };

export const getUtxo =
  (transactionBox: TransactionsBox) => (utxoHash: string) => {
    return transactionBox.utxos[utxoHash];
  };

export const getUtxoIndex =
  (transactions: IGraphicalTransaction[]) => (utxoHash: string) => {
    const inputs = transactions.flatMap(({ inputs }) =>
      inputs
        .filter(({ isReferenceInput }) => !isReferenceInput)
        .map(({ txHash }) => txHash),
    );

    return inputs.indexOf(utxoHash);
  };

export const isInputUtxo =
  (transactionBox: TransactionsBox) => (utxoHash: string) => {
    return transactionBox.transactions.some((tx) =>
      tx.inputs.some((utxo) => utxo.txHash === utxoHash),
    );
  };

export const isOutputUtxo =
  (transactionBox: TransactionsBox) => (utxoHash: string) => {
    return transactionBox.transactions.some((tx) =>
      tx.outputs.some((utxo) => utxo.txHash === utxoHash),
    );
  };

export const existsMint =
  (transactionBox: TransactionsBox) => (txHash: string) => {
    const selectedTx = getTransaction(transactionBox)(txHash);
    if (!selectedTx) return false;
    return selectedTx.mints.some(({ assetsPolicy }) =>
      assetsPolicy.some((asset) => (asset.amount ?? 0) > 0),
    );
  };

export const existsBurn =
  (transactionBox: TransactionsBox) => (txHash: string) => {
    const selectedTx = getTransaction(transactionBox)(txHash);
    if (!selectedTx) return false;
    return selectedTx.mints.some(({ assetsPolicy }) =>
      assetsPolicy.some((asset) => (asset.amount ?? 0) < 0),
    );
  };
