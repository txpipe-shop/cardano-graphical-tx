import type { LineConfig, Line as LineRef } from "konva/lib/shapes/Line";
import { Line } from "react-konva";
import { useGraphical } from "~/app/_contexts";
import {
  KONVA_COLORS,
  LINE_WIDTH,
  STROKE_WIDTH,
  TX_HEIGHT,
  TX_WIDTH,
  getTransaction,
  getUtxo,
  isInputUtxo,
} from "~/app/_utils";

interface UtxoLineProps {
  txHash: string;
  utxoHash: string;
  index: number;
  isOutput?: boolean;
  isReferenceInput?: boolean;
}

export const UtxoLine = ({
  txHash,
  utxoHash,
  index,
  isOutput = false,
  isReferenceInput = false,
}: UtxoLineProps) => {
  const { transactions } = useGraphical();
  const tx = getTransaction(transactions)(txHash)!;
  const utxo = getUtxo(transactions)(utxoHash)!;

  const totalInputs = tx.inputs.length;
  const totalOutputs = tx.outputs.length;
  const distanceBetweenInputs = TX_HEIGHT / (totalInputs + 1);
  const distanceBetweenOutputs = TX_HEIGHT / (totalOutputs + 1);

  const { x: startX, y: startY } = tx.pos;
  const { x: endX, y: endY } = utxo.pos;
  const centerXOutput = startX + TX_WIDTH;
  const centerXInput = startX;
  const isInput = isInputUtxo(transactions)(utxoHash);
  const points = isOutput
    ? [
        centerXOutput + STROKE_WIDTH / 2,
        startY + distanceBetweenOutputs * (index + 1),
        centerXOutput + Math.abs(centerXOutput - endX) * 0.7,
        startY + distanceBetweenOutputs * (index + 1),
        endX - Math.abs(centerXOutput - endX) * 0.7,
        endY,
        utxo.consumedBy && !isInput ? endX - 10 : endX,
        endY,
      ]
    : [
        centerXInput - STROKE_WIDTH / 2,
        startY + distanceBetweenInputs * (index + 1),
        centerXInput - Math.abs(endX - centerXInput) * 0.7,
        startY + distanceBetweenInputs * (index + 1),
        endX + Math.abs(endX - centerXInput) * 0.7,
        endY,
        endX,
        endY,
      ];

  // TODO: This function runs in each render and pushes a new line. Check if this is a problem
  const pushRef = (ref: LineRef<LineConfig> | null) => {
    if (!ref) return;
    if (isOutput) {
      tx.producedLines.push(ref);
      utxo.lines?.push(ref);
    } else {
      tx.consumedLines.push(ref);
      utxo.lines?.push(ref);
    }
  };

  const referenceInputLine = isReferenceInput ? [5, 5] : [];

  return (
    <Line
      points={points}
      index={index}
      stroke={isOutput ? KONVA_COLORS.RED : KONVA_COLORS.BLUE}
      dash={referenceInputLine}
      strokeWidth={LINE_WIDTH}
      bezier
      ref={pushRef}
    />
  );
};
