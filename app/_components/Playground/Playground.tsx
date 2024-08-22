import type { KonvaEventObject } from "konva/lib/Node";
import { Layer, Stage } from "react-konva";
import { useGraphical } from "~/app/_contexts";
import { Line, Transaction, Utxo } from "../Transaction";
import { PlaygroundDefault } from "./PlaygroundDefault";
import { PlaygroundError } from "./PlaygroundError";

export function Playground() {
  const { transactions, error } = useGraphical();

  const scaleBy = 1.05;
  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = e.target.getStage();
    if (!stage) return;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    let direction = e.evt.deltaY > 0 ? 1 : -1;

    // when e.evt.ctrlKey is true, revert direction
    if (e.evt.ctrlKey) {
      direction = -direction;
    }

    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    stage.position(newPos);
  };

  if (error) return <PlaygroundError />;

  return transactions.transactions.length ? (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onWheel={handleWheel}
      draggable
      className="overflow-hidden"
    >
      <Layer>
        {transactions.transactions.map((tx) => {
          return tx.outputsUTXO.map((utxo, index) => (
            <Line
              key={index}
              txHash={tx.txHash}
              utxoHash={utxo.utxoHash || ""}
              index={index}
              isOutput
            />
          ));
        })}
        {transactions.transactions.map((tx) => {
          return tx.inputsUTXO.map((utxo, index) => (
            <Line
              key={index}
              txHash={tx.txHash}
              utxoHash={utxo.utxoHash || ""}
              index={index}
            />
          ));
        })}
        {Object.keys(transactions.utxos).map((utxoHash, index) => (
          <Utxo key={index} utxoHash={utxoHash} />
        ))}
        {transactions.transactions.map((tx, index) => (
          <Transaction key={index} txHash={tx.txHash} />
        ))}
      </Layer>
    </Stage>
  ) : (
    <PlaygroundDefault />
  );
}
