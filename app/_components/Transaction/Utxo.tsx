import type Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useRef, useState } from "react";
import { Circle, Group, Rect, Text } from "react-konva";
import { useGraphical, useUI } from "~/app/_contexts";
import {
  KONVA_COLORS,
  POINT_SIZE,
  getAssetName,
  getUtxo,
  getUtxoColor,
  isInputUtxo,
  isOutputUtxo,
  trimString,
  updateUtxoLines,
} from "~/app/_utils";

interface UtxoProps {
  utxoHash: string;
  utxoInfoVisible: () => void;
}

export const Utxo = ({ utxoHash, utxoInfoVisible }: UtxoProps) => {
  const { transactions, setTransactionBox } = useGraphical();
  const [color, setColor] = useState<{
    fill: KONVA_COLORS;
    stroke: KONVA_COLORS;
  }>(getUtxoColor(transactions)(utxoHash));
  const [showInfo, setShowInfo] = useState(false);
  const [dimensions, setDimensions] = useState({ rectWidth: 0, rectHeight: 0 });
  const { error } = useUI();
  const textRef = useRef<Konva.Text | null>(null);

  useEffect(() => {
    if (showInfo) {
      const width = textRef.current ? textRef.current.width() + 20 : 0;
      const height = textRef.current ? textRef.current.height() - 10 : 0;
      setDimensions({
        rectWidth: width,
        rectHeight: height,
      });
    }
    setColor(getUtxoColor(transactions)(utxoHash));
  }, [showInfo, transactions, utxoHash]);

  useEffect(() => {
    setShowInfo(false);
  }, [utxoHash]);

  const utxo = getUtxo(transactions)(utxoHash)!;

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
          [utxoHash]: {
            ...prev.utxos[utxoHash]!,
            pos: { x, y },
          },
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
          const txHasUtxoAsInput = tx.inputs.find(
            (utxo) => utxo.txHash === utxoHashMap,
          );
          if (txHasUtxoAsInput)
            return {
              ...tx,
              inputs: tx.inputs.map((utxo) => {
                if (utxo.txHash === utxoHashMap)
                  return { ...utxo, distance: newPos };
                return utxo;
              }),
            };
          const txHasUtxoAsOutput = tx.outputs.find(
            (utxo) => utxo.txHash === utxoHashMap,
          );
          if (txHasUtxoAsOutput)
            return {
              ...tx,
              outputs: tx.outputs.map((utxo) => {
                if (utxo.txHash === utxoHashMap)
                  return { ...utxo, distance: newPos };
                return utxo;
              }),
            };
          return tx;
        }),
        utxos: {
          ...prev.utxos,
          [utxoHash]: {
            ...prev.utxos[utxoHash]!,
            pos: { x, y },
          },
        },
      }));
    };

  const handleCursor = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (error && stage) {
      stage.container().style.cursor = "not-allowed";
    } else if (stage) {
      stage.container().style.cursor =
        e.type === "mouseover" ? "pointer" : "default";
    }
  };

  let pendingClick: ReturnType<typeof setTimeout>;
  const handleClick = () => {
    clearTimeout(pendingClick);
    pendingClick = setTimeout(function () {
      setTransactionBox((prev) => ({
        ...prev,
        selectedUtxo: utxo,
      }));
      utxoInfoVisible();
    }, 300);
  };

  const handleDoubleClick = (e: KonvaEventObject<MouseEvent>) => {
    e.evt.preventDefault();
    clearTimeout(pendingClick);
    setShowInfo(!showInfo);
  };

  const handleMouseEnter = () => {
    setColor((prev) => {
      if (isInputUtxo(transactions)(utxoHash))
        return { stroke: prev.stroke, fill: KONVA_COLORS.LIGHT_BLUE };
      return { stroke: prev.stroke, fill: KONVA_COLORS.PINK };
    });
  };

  const handleMouseLeave = () => {
    setColor((prev) => {
      if (isInputUtxo(transactions)(utxoHash))
        return { stroke: prev.stroke, fill: KONVA_COLORS.BLUE };
      return { stroke: prev.stroke, fill: KONVA_COLORS.RED };
    });
  };

  const isInput = isInputUtxo(transactions)(utxoHash);

  const text = utxo.address?.bech32
    ? `Address:
  ${trimString(utxo.address?.bech32, 10)}\nAssets:
  - lovelace ${utxo.lovelace}
  ${utxo.assets.reduce((accc, { assetsPolicy }) => {
    const actual = assetsPolicy.reduce((acc, asset) => {
      const assetName = getAssetName(asset.assetName);
      return acc + `- ${assetName} ${asset.coint}\n  `;
    }, "");
    return accc + actual;
  }, "")}`
    : `txHash: ${trimString(utxo.txHash.slice(0, -2), 10)}\nIndex: ${utxo.index}\n`;
  return (
    <>
      <Circle
        x={utxo.pos.x}
        y={utxo.pos.y}
        radius={POINT_SIZE}
        width={POINT_SIZE}
        height={POINT_SIZE}
        fill={color.fill}
        stroke={color.stroke}
        strokeWidth={3}
        draggable
        onDragMove={handleUtxoMove(utxoHash)}
        onDragEnd={handleUtxoMoveEnd(utxoHash)}
        onClick={handleClick}
        onMouseOut={handleCursor}
        onMouseOver={handleCursor}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onDblClick={handleDoubleClick}
      />
      {showInfo && (
        <Group
          draggable
          x={isInput ? utxo.pos.x - dimensions.rectWidth - 10 : utxo.pos.x + 10}
          y={utxo.pos.y - 20}
        >
          <Rect
            width={dimensions.rectWidth}
            height={dimensions.rectHeight}
            cornerRadius={5}
            stroke={KONVA_COLORS.BLACK}
            strokeWidth={0.5}
            fill={KONVA_COLORS.WHITE}
          />
          <Text
            text={text}
            x={10}
            y={5}
            fontSize={16}
            ref={textRef}
            lineHeight={1.2}
            fill={KONVA_COLORS.BLACK}
          />
        </Group>
      )}
    </>
  );
};
