import { type KonvaEventObject } from "konva/lib/Node";
import { useState } from "react";
import toast from "react-hot-toast";
import { Arc, Circle, Group, Line, Text } from "react-konva";
import { useConfigs, useGraphical, useUI } from "~/app/_contexts";
import {
  checkIfHash,
  firstNChars,
  getUtxo,
  isInputUtxo,
  isOutputUtxo,
  KONVA_COLORS,
  OPTIONS,
  POINT_SIZE,
} from "~/app/_utils";
import addCBORsToContext from "../../Input/TxInput/txInput.helper";
import { type IUtxoColor } from "./Utxo";

interface IUtxoTracers {
  utxoHash: string;
  handleCursor: (e: KonvaEventObject<MouseEvent>) => void;
  color: IUtxoColor;
}
export default function UtxoTracers({
  utxoHash,
  handleCursor,
  color,
}: IUtxoTracers) {
  const { transactions, setTransactionBox } = useGraphical();
  const { error, setError, setLoading } = useUI();
  const { configs } = useConfigs();

  const [arrowHovered, setArrowHovered] = useState(false);

  const utxo = getUtxo(transactions)(utxoHash)!;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  var outputGradient = ctx!.createLinearGradient(
    utxo.pos.x - 10,
    utxo.pos.y,
    utxo.pos.x - 40,
    utxo.pos.y,
  );
  outputGradient.addColorStop(0.0, KONVA_COLORS.RED);
  outputGradient.addColorStop(0.7, KONVA_COLORS.TRANSPARENT_RED);
  outputGradient.addColorStop(1, KONVA_COLORS.TRANSAPARENT);

  var inputGradient = ctx!.createLinearGradient(
    utxo.pos.x + 5,
    utxo.pos.y,
    utxo.pos.x + 35,
    utxo.pos.y,
  );
  inputGradient.addColorStop(0.0, KONVA_COLORS.BLUE);
  inputGradient.addColorStop(0.7, KONVA_COLORS.TRANSPARENT_BLUE);
  inputGradient.addColorStop(1, KONVA_COLORS.TRANSAPARENT);

  const addPrevTransaction = async () => {
    if (error) return;
    const txId = utxo.txHash.split("#")[0];
    toast.loading("Fetching transaction...", { duration: 1000 });

    const isInvalid = !checkIfHash(txId!);
    if (isInvalid) throw new Error("Invalid transaction ID");
    addCBORsToContext(
      OPTIONS.HASH,
      [txId!],
      configs.net,
      setError,
      transactions,
      setTransactionBox,
      setLoading,
    );
  };

  const handleArrowMouse = () => {
    setArrowHovered((prev) => !prev);
  };

  const addPostTransaction = async () => {
    if (error) return;
    const txId = utxo.consumedBy;
    toast.loading("Fetching transaction...", { duration: 1000 });

    const isInvalid = !checkIfHash(txId!);
    if (isInvalid) throw new Error("Invalid transaction ID");
    addCBORsToContext(
      OPTIONS.HASH,
      [txId!],
      configs.net,
      setError,
      transactions,
      setTransactionBox,
      setLoading,
    );
  };

  const isInput = isInputUtxo(transactions)(utxoHash);
  const isOutput = isOutputUtxo(transactions)(utxoHash);

  const inputTracer = isInput && !isOutput;
  const outputTracer = isOutput && !isInput && utxo.consumedBy;
  return (
    <Group
      onClick={inputTracer ? addPrevTransaction : addPostTransaction}
      onMouseOver={handleCursor}
      onMouseOut={handleCursor}
      onMouseEnter={handleArrowMouse}
      onMouseLeave={handleArrowMouse}
    >
      {arrowHovered && error && (
        <Text
          text={firstNChars(error, 23)}
          fill={KONVA_COLORS.RED}
          x={utxo.pos.x - 65}
          y={utxo.pos.y - 30}
          fontSize={14}
          lineHeight={1}
        />
      )}
      {inputTracer && (
        <Group>
          <Arc
            x={utxo.pos.x}
            y={utxo.pos.y}
            innerRadius={40}
            outerRadius={55}
            scale={{ x: 0.2, y: 0.2 }}
            angle={300}
            rotation={30}
            fill={KONVA_COLORS.RED}
          />
          <Line
            points={[utxo.pos.x - 10, utxo.pos.y, utxo.pos.x - 40, utxo.pos.y]}
            stroke={outputGradient}
            strokeWidth={2}
          />
        </Group>
      )}
      {outputTracer && (
        <Group>
          <Circle
            x={utxo.pos.x}
            y={utxo.pos.y}
            radius={POINT_SIZE}
            width={POINT_SIZE}
            height={POINT_SIZE}
            fill={KONVA_COLORS.BLUE}
            stroke={color.stroke}
            strokeWidth={3}
          />
          <Line
            points={[utxo.pos.x + 5, utxo.pos.y, utxo.pos.x + 35, utxo.pos.y]}
            stroke={inputGradient}
            strokeWidth={2}
          />
        </Group>
      )}
    </Group>
  );
}
