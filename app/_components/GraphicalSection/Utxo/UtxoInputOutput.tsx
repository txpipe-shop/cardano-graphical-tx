import type { KonvaEventObject } from "konva/lib/Node";
import { type Dispatch, type SetStateAction, useState } from "react";
import { Arc, Circle, Group } from "react-konva";
import { useGraphical } from "~/app/_contexts";
import {
  getUtxo,
  getUtxoColor,
  isInputUtxo,
  isOutputUtxo,
  KONVA_COLORS,
  POINT_SIZE,
  updateUtxoLines,
} from "~/app/_utils";
import { type IUtxoColor } from "./Utxo";

interface IUtxoInput {
  utxoHash: string;
  utxoInfoVisible: () => void;
  handleCursor: (e: KonvaEventObject<MouseEvent>) => void;
  color: IUtxoColor;
  setColor: Dispatch<SetStateAction<IUtxoColor>>;
  setShowInfo: Dispatch<SetStateAction<boolean>>;
}

export default function UtxoInputOutput({
  utxoHash,
  utxoInfoVisible,
  handleCursor,
  setShowInfo,
}: IUtxoInput) {
  const { transactions, setTransactionBox } = useGraphical();
  const [color, setColor] = useState<{
    fill: KONVA_COLORS;
    stroke: KONVA_COLORS;
  }>(getUtxoColor(transactions)(utxoHash));

  const utxo = getUtxo(transactions)(utxoHash)!;

  let pendingClick: ReturnType<typeof setTimeout>;
  const handleClick = () => {
    clearTimeout(pendingClick);
    pendingClick = setTimeout(function () {
      setTransactionBox((prev) => ({ ...prev, selectedUtxo: utxo }));
      utxoInfoVisible();
    }, 300);
  };

  const handleDoubleClick = (e: KonvaEventObject<MouseEvent>) => {
    e.evt.preventDefault();
    clearTimeout(pendingClick);
    setShowInfo((prev) => !prev);
  };

  const handleMouse = (enter: boolean) => () => {
    setColor((prev) => {
      if (
        isInputUtxo(transactions)(utxoHash) &&
        isOutputUtxo(transactions)(utxoHash)
      )
        return enter
          ? { stroke: KONVA_COLORS.PINK, fill: KONVA_COLORS.LIGHT_BLUE }
          : { stroke: KONVA_COLORS.RED, fill: KONVA_COLORS.BLUE };
      if (isInputUtxo(transactions)(utxoHash))
        return enter
          ? { stroke: prev.stroke, fill: KONVA_COLORS.LIGHT_BLUE }
          : { stroke: prev.stroke, fill: KONVA_COLORS.BLUE };
      return enter
        ? { stroke: prev.stroke, fill: KONVA_COLORS.PINK }
        : { stroke: prev.stroke, fill: KONVA_COLORS.RED };
    });
  };

  const handleUtxoMove =
    (utxoHash: string) => (e: KonvaEventObject<DragEvent>) => {
      const { x, y } = e.currentTarget.position();
      isOutputUtxo(transactions)(utxoHash) &&
        updateUtxoLines(transactions)(utxoHash, { x, y }, true);
      isInputUtxo(transactions)(utxoHash) &&
        updateUtxoLines(transactions)(utxoHash, { x, y }, false);
      setTransactionBox((prev) => ({
        ...prev,
        utxos: {
          ...prev.utxos,
          [utxoHash]: { ...prev.utxos[utxoHash]!, pos: { x, y } },
        },
      }));
    };

  const handleUtxoMoveEnd =
    (utxoHash: string) => (e: KonvaEventObject<DragEvent>) => {
      const { x, y } = e.currentTarget.position();
      const utxoHashMap = Object.keys(transactions.utxos).find(
        (utxo) => utxo === utxoHash,
      );
      setTransactionBox((prev) => ({
        ...prev,
        transactions: prev.transactions.map((tx) => {
          const newPos = { x: x - tx.pos.x, y: y - tx.pos.y };
          const inputs = tx.inputs.map((utxo) =>
            utxo.txHash === utxoHashMap ? { ...utxo, distance: newPos } : utxo,
          );
          const outputs = tx.outputs.map((utxo) =>
            utxo.txHash === utxoHashMap ? { ...utxo, distance: newPos } : utxo,
          );
          return { ...tx, inputs, outputs };
        }),
        utxos: {
          ...prev.utxos,
          [utxoHash]: { ...prev.utxos[utxoHash]!, pos: { x, y } },
        },
      }));
    };

  const isInput = isInputUtxo(transactions)(utxoHash);
  return (
    <Group
      x={utxo.pos.x}
      y={utxo.pos.y}
      draggable
      onDragMove={handleUtxoMove(utxoHash)}
      onDragEnd={handleUtxoMoveEnd(utxoHash)}
      onClick={handleClick}
      onMouseOut={handleCursor}
      onMouseOver={handleCursor}
      onMouseEnter={handleMouse(true)}
      onMouseLeave={handleMouse(false)}
      onDblClick={handleDoubleClick}
    >
      {utxo.consumedBy && !isInput ? (
        <Arc
          innerRadius={40}
          outerRadius={55}
          scale={{ x: 0.2, y: 0.2 }}
          angle={300}
          rotation={30}
          fill={color.fill}
        />
      ) : (
        <Circle
          radius={POINT_SIZE}
          width={POINT_SIZE}
          height={POINT_SIZE}
          fill={color.fill}
          stroke={color.stroke}
          strokeWidth={3}
        />
      )}
    </Group>
  );
}
