import { useEffect, useRef } from "react";
import type { KonvaEventObject } from "konva/lib/Node";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Layer, Stage } from "react-konva";
import { useGraphical, useUI } from "~/app/_contexts";
import { KONVA_COLORS, TX_URL_PARAM, UTXO_URL_PARAM } from "~/app/_utils";
import { Error } from "../Error";
import { Line, Transaction, Utxo } from "../Transaction";
import { PlaygroundDefault } from "./PlaygroundDefault";
import toast from "react-hot-toast";

export function Playground() {
  const { transactions } = useGraphical();
  const { error } = useUI();
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const shownWarnings = useRef(new Set());

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

  const utxoInfoVisible = (utxoHash: string) => () => {
    const params = new URLSearchParams(searchParams);
    params.set(UTXO_URL_PARAM, utxoHash);
    params.delete(TX_URL_PARAM);
    replace(`${pathname}?${params.toString()}`);
  };

  const txInfoVisible = (txHash: string) => () => {
    const params = new URLSearchParams(searchParams);
    params.set(TX_URL_PARAM, txHash);
    if (params) {
      replace(`${pathname}?${params.toString()}`);
    }
  };

  useEffect(() => {
    transactions.transactions.forEach((tx: any) => {
      if (tx.warning) {
        const warningKey = `${tx.txHash}-${tx.warning}`;
        if (!shownWarnings.current.has(warningKey)) {
          toast(tx.warning, {
            icon: "⚠️",
            style: {
              backgroundColor: KONVA_COLORS.YELLOW_WARNING,
              fontWeight: "bold",
            },
          });
          shownWarnings.current.add(warningKey);
        }
      }
    });
  }, [transactions.transactions]);

  if (error) return <Error action="fetching" />;

  return transactions.transactions.length ? (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onWheel={handleWheel}
      draggable
      className="overflow-hidden"
    >
      <Layer>
        {transactions.transactions.map((tx, index) => (
          <Transaction
            key={index}
            txHash={tx.txHash}
            txInfoVisible={txInfoVisible(tx.txHash)}
          />
        ))}
        {transactions.transactions.map((tx) => {
          return tx.outputs.map((utxo, index) => (
            <Line
              key={index}
              txHash={tx.txHash}
              utxoHash={utxo.txHash || ""}
              index={index}
              isOutput
            />
          ));
        })}
        {transactions.transactions.map((tx) => {
          return tx.inputs.map((utxo, index) => (
            <Line
              key={index}
              txHash={tx.txHash}
              utxoHash={utxo.txHash || ""}
              index={index}
              isReferenceInput={utxo.isReferenceInput}
            />
          ));
        })}
        {Object.keys(transactions.utxos).map((utxoHash, index) => (
          <Utxo
            key={index}
            utxoHash={utxoHash}
            utxoInfoVisible={utxoInfoVisible(utxoHash)}
          />
        ))}
      </Layer>
    </Stage>
  ) : (
    <PlaygroundDefault />
  );
}
