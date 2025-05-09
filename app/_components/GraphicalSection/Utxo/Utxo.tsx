import type Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useRef, useState } from "react";
import { Group, Rect, Text } from "react-konva";
import { useGraphical, useUI } from "~/app/_contexts";
import {
  KONVA_COLORS,
  getAssetName,
  getUtxo,
  getUtxoColor,
  isInputUtxo,
  trimString,
} from "~/app/_utils";
import UtxoInputOutput from "./UtxoInputOutput";
import UtxoTracers from "./UtxoTracers";

interface IUtxoProps {
  utxoHash: string;
  utxoInfoVisible: () => void;
}

export interface IUtxoColor {
  fill: KONVA_COLORS;
  stroke: KONVA_COLORS;
}

export const Utxo = ({ utxoHash, utxoInfoVisible }: IUtxoProps) => {
  const { transactions } = useGraphical();
  const { error } = useUI();
  const [color, setColor] = useState<IUtxoColor>(
    getUtxoColor(transactions)(utxoHash),
  );
  const [showInfo, setShowInfo] = useState(false);
  const [dimensions, setDimensions] = useState({ rectWidth: 0, rectHeight: 0 });

  const textRef = useRef<Konva.Text | null>(null);
  const utxo = getUtxo(transactions)(utxoHash)!;

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

  const handleCursor = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (error && stage) stage.container().style.cursor = "not-allowed";
    else if (stage)
      stage.container().style.cursor =
        e.type === "mouseover" ? "pointer" : "default";
  };
  const isInput = isInputUtxo(transactions)(utxoHash);

  const text = utxo.address?.bech32
    ? `Address:
  ${trimString(utxo.address?.bech32, 10)}\nAssets:
  - lovelace ${utxo.lovelace}
  ${utxo.assets.reduce((accc, { assetsPolicy }) => {
    const actual = assetsPolicy.reduce((acc, asset) => {
      const assetName = getAssetName(asset.assetName);
      return acc + `- ${assetName} ${asset.amount}\n  `;
    }, "");
    return accc + actual;
  }, "")}`
    : `txHash: ${trimString(utxo.txHash.slice(0, -2), 10)}\nIndex: ${utxo.index}\n`;

  return (
    <>
      <UtxoInputOutput
        utxoHash={utxoHash}
        utxoInfoVisible={utxoInfoVisible}
        handleCursor={handleCursor}
        color={color}
        setColor={setColor}
        setShowInfo={setShowInfo}
      />
      <UtxoTracers
        utxoHash={utxoHash}
        handleCursor={handleCursor}
        color={color}
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
