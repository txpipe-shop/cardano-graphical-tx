import type { Vector2d } from "konva/lib/types";
import type { Dispatch, SetStateAction } from "react";
import type { TransactionsBox } from "~/app/_interfaces";
import { KONVA_COLORS } from ".";
import {
  getTransaction,
  getUtxo,
  isInputUtxo,
  isOutputUtxo,
} from "./txHelpers";

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
      if (!line || (!isOutput && line.attrs.metadata === "output")) return;
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

/** Obtains the color of a utxo based on if it is an input and/or output of a transaction. */
export const getUtxoColor =
  (transactions: TransactionsBox) => (utxoHash: string) => {
    if (
      isOutputUtxo(transactions)(utxoHash) &&
      isInputUtxo(transactions)(utxoHash)
    )
      return { fill: KONVA_COLORS.BLUE, stroke: KONVA_COLORS.RED };
    if (isOutputUtxo(transactions)(utxoHash))
      return { fill: KONVA_COLORS.RED, stroke: KONVA_COLORS.TRANSAPARENT };
    return { fill: KONVA_COLORS.BLUE, stroke: KONVA_COLORS.TRANSAPARENT };
  };
