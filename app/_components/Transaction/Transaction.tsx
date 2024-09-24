import type { KonvaEventObject } from "konva/lib/Node";
import { useState } from "react";
import { Group, Rect, Text } from "react-konva";
import { useGraphical } from "~/app/_contexts";
import {
  KONVA_COLORS,
  POINT_SIZE,
  STROKE_WIDTH,
  TX_HEIGHT,
  TX_WIDTH,
  existsBurn,
  existsMint,
  getTransaction,
  isEmpty,
  trimString,
  updateLines,
} from "~/app/_utils";
import { BurningIcon } from "./BurningIcon";
import { MintingIcon } from "./MintingIcon";
import { WithdrawalIcon } from "./WithdrawalIcon";
import { CertificateIcon } from "./CertificateIcon";

interface TransactionProps {
  txHash: string;
  txInfoVisible: () => void;
}

export const Transaction = ({ txHash, txInfoVisible }: TransactionProps) => {
  const { transactions, setTransactionBox } = useGraphical();
  const [showTxId, setShowTxId] = useState(false);

  const tx = getTransaction(transactions)(txHash)!;
  const txTrim = trimString(tx.txHash);

  const handleTxMove = (txHash: string) => (e: KonvaEventObject<DragEvent>) => {
    const newPos = e.currentTarget.position();
    updateLines(transactions)(setTransactionBox, txHash, newPos);
  };

  const handleMouseEnter = () => setShowTxId(!showTxId);

  const handleCursor = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (stage) {
      if (e.type === "mouseover") stage.container().style.cursor = "pointer";
      else stage.container().style.cursor = "default";
    }
  };

  const handleClick = () => {
    setTransactionBox((prev) => ({
      ...prev,
      selectedTx: tx,
    }));
    txInfoVisible();
  };

  const mints = existsMint(transactions)(tx.txHash);
  const burns = existsBurn(transactions)(tx.txHash);

  return (
    <Group
      x={tx.pos.x}
      y={tx.pos.y}
      draggable
      onDragMove={handleTxMove(tx.txHash)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseEnter}
      onMouseOut={handleCursor}
      onMouseOver={handleCursor}
    >
      <Group x={-TX_WIDTH / 2 + 15} y={-(TX_HEIGHT / 6)}>
        <Rect
          fill={KONVA_COLORS.LIGHTER_GREY}
          width={TX_WIDTH + 2 * (TX_WIDTH / 3) + 10}
          height={TX_HEIGHT / 7}
          cornerRadius={POINT_SIZE}
        />
        <Text
          text={txTrim}
          fontSize={20}
          x={15}
          y={10}
          fill={KONVA_COLORS.BLACK}
        />
      </Group>
      <Rect
        width={TX_WIDTH}
        height={TX_HEIGHT}
        stroke={KONVA_COLORS.BLACK}
        strokeWidth={STROKE_WIDTH}
        fill={KONVA_COLORS.GREY}
        onClick={txInfoVisible}
      />
      <Group onClick={handleClick}>
        <BurningIcon on={burns} />
        <MintingIcon on={mints} />
      </Group>
      {!isEmpty(tx.alias) && (
        <Text
          text={tx.alias}
          x={5}
          y={TX_HEIGHT / 2 - 40}
          width={TX_WIDTH - 10}
          height={TX_HEIGHT / 2}
          fontSize={20}
          align="center"
          onClick={handleClick}
        />
      )}
    </Group>
  );
};
