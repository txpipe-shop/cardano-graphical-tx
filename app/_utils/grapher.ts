import type { Vector2d } from "konva/lib/types";
import type { Dispatch, SetStateAction } from "react";
import type {
  IGraphicalTransaction,
  IGraphicalUtxo,
  TransactionsBox,
} from "~/app/_interfaces";
import { KONVA_COLORS, TX_HEIGHT, TX_WIDTH, UTXO_LINE_GAP } from ".";

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

/**
 * Updates the positions of produced and consumed lines (the outputs and inputs) in a transaction box,
 * based on a new position. Used when a transaction is dragged.
 */
export const updateLines =
  (transactions: TransactionsBox) =>
  (
    setTransactionBox: Dispatch<SetStateAction<TransactionsBox>>,
    txHash: string,
    newPos: Vector2d,
  ) => {
    const selectedTx = getTransaction(transactions)(txHash);
    if (!selectedTx) return;
    let newTransaction = { ...selectedTx };
    let newUtxos = { ...transactions.utxos };

    selectedTx.producedLines.forEach((line) => {
      if (!line) return;
      const utxoIndex = line.attrs.index;
      const selectedUtxo = selectedTx.outputs[utxoIndex];
      if (!selectedUtxo) return;
      const { x: distanceX, y: distanceY } = selectedUtxo.distance;
      const utxoHash = selectedUtxo.txHash;

      if (newUtxos[utxoHash])
        newUtxos[utxoHash] = {
          ...newUtxos[utxoHash],
          pos: { x: newPos.x + distanceX, y: newPos.y + distanceY },
        };
    });
    selectedTx.consumedLines.forEach((line) => {
      if (!line) return;
      const utxoIndex = line.attrs.index;
      const selectedUtxo = selectedTx.inputs[utxoIndex];
      if (!selectedUtxo) return;
      const { x: distanceX, y: distanceY } = selectedUtxo.distance;
      const utxoHash = selectedUtxo.txHash;

      if (newUtxos[utxoHash])
        newUtxos[utxoHash] = {
          ...newUtxos[utxoHash],
          pos: { x: newPos.x + distanceX, y: newPos.y + distanceY },
        };
    });
    setTransactionBox((prev) => ({
      ...prev,
      transactions: prev.transactions.map((tx) =>
        tx.txHash === selectedTx.txHash
          ? // Update distances and the position of the tx itself
            { ...newTransaction, pos: newPos }
          : tx,
      ),
      utxos: newUtxos,
    }));
  };

/**
 * Updates the positions of lines in a transaction box based on a new utxo position provided.
 * Used when a utxo is dragged.
 */
export const updateUtxoLines =
  (transactionBox: TransactionsBox) =>
  (utxoHash: string, newPos: Vector2d, isOutput: boolean) => {
    const selectedUtxo = getUtxo(transactionBox)(utxoHash);
    if (!selectedUtxo) return;
    selectedUtxo.lines.forEach((line) => {
      if (!line) return;
      const [centerX] = line.points().slice(0, 1);
      if (!centerX) return;
      line.points([
        centerX,
        ...line.points().slice(1, 2),
        isOutput
          ? centerX + Math.abs(centerX - newPos.x) * 0.7
          : centerX - Math.abs(centerX - newPos.x) * 0.7,
        ...line.points().slice(3, 4),
        isOutput
          ? newPos.x - Math.abs(centerX - newPos.x) * 0.7
          : newPos.x + Math.abs(newPos.x - centerX) * 0.7,
        newPos.y,
        newPos.x,
        newPos.y,
      ]);
    });
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

/** Obtains the color of a utxo based on if it is an input and/or output of a transaction. */
export const getUtxoColor =
  (transactions: TransactionsBox) => (utxoHash: string) => {
    if (isOutputUtxo(transactions)(utxoHash))
      return { fill: KONVA_COLORS.RED, stroke: KONVA_COLORS.TRANSAPARENT };
    return { fill: KONVA_COLORS.BLUE, stroke: KONVA_COLORS.TRANSAPARENT };
  };

/**
 * Calculates the positions of the UTXOs in a transaction.
 * @returns An array of UTXO items with their positions updated.
 */
const setUtxoPosition = (
  utxoList: IGraphicalUtxo[],
  txPos: Vector2d,
  isOutput: boolean,
): IGraphicalUtxo[] => {
  const length = utxoList.length;
  // hasSpace checks if there is enough space to fit all utxos in the tx_height
  const hasSpace = (length - 1) * UTXO_LINE_GAP > TX_HEIGHT;
  // margin is the space between the first (top) utxo and the top of the tx when utxos dont fit in the tx_height
  const margin = hasSpace ? ((length - 1) * UTXO_LINE_GAP - TX_HEIGHT) / 2 : 0;

  return utxoList.map((utxo, index) => {
    const distanceBetweenPoints = TX_HEIGHT / (length + 1);

    const y = hasSpace
      ? txPos.y - margin + index * UTXO_LINE_GAP
      : txPos.y + distanceBetweenPoints * (index + 1);

    const x = isOutput ? txPos.x + 2 * TX_WIDTH : txPos.x - TX_WIDTH;

    return {
      ...utxo,
      pos: { x, y },
      distance: {
        x: isOutput ? 2 * TX_WIDTH : -TX_WIDTH,
        y: y - txPos.y,
      },
      isReferenceInput: utxo.isReferenceInput,
    };
  });
};

/** Calculates the position of the transaction on the canvas. */
export const setPosition = (
  transactions: IGraphicalTransaction[],
): IGraphicalTransaction[] => {
  const initial = window.innerWidth / 2 - TX_WIDTH / 2;

  return transactions.map((tx) => {
    const txPos = { x: initial, y: TX_HEIGHT };

    const inputs = setUtxoPosition(tx.inputs, txPos, false);

    const sortedOutputs = tx.outputs.sort((a, b) => a.index - b.index);
    const outputs = setUtxoPosition(sortedOutputs, txPos, true);

    return {
      ...tx,
      inputs,
      outputs,
      pos: txPos,
    };
  });
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
