"use client";
import type { KonvaEventObject } from "konva/lib/Node";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Layer, Stage } from "react-konva";
import { useConfigs, useGraphical, useUI } from "~/app/_contexts";
import {
  ERRORS,
  KONVA_COLORS,
  TX_URL_PARAM,
  UTXO_URL_PARAM,
} from "~/app/_utils";
import Loading from "~/app/loading";
import { Line, Transaction, Utxo } from ".";
import { Error } from "../Error";
export function Playground() {
  const { transactions } = useGraphical();
  const { error } = useUI();
  const { configs } = useConfigs();
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const shownWarnings = useRef(new Set());
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const scaleBy = 1.05;
  const MIN_SCALE = 0.1;
  const MAX_SCALE = 5;

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

    // When e.evt.ctrlKey is true, revert direction
    if (e.evt.ctrlKey) direction = -direction;

    let newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    newScale = Math.max(MIN_SCALE, Math.min(newScale, MAX_SCALE));

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
    if (params) replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    transactions.transactions.forEach((tx: any) => {
      if (tx.warning) {
        const warningKey = `${tx.txHash}-${tx.warning}`;
        if (!shownWarnings.current.has(warningKey)) {
          let icon, backgroundColor, color;
          if (tx.warning === ERRORS.inputs_not_found) {
            icon = "⚠️";
            color = KONVA_COLORS.BLACK;
            backgroundColor = KONVA_COLORS.YELLOW_WARNING;
          }
          if (tx.warning === ERRORS.internal_error) {
            icon = "🚫";
            backgroundColor = KONVA_COLORS.WHITE;
            color = KONVA_COLORS.RED_WARNING;
          }

          toast(tx.warning, {
            icon,
            style: { backgroundColor, fontWeight: "bold", color },
            duration: 5000,
          });
          shownWarnings.current.add(warningKey);
        }
      }
    });
  }, [transactions.transactions]);

  if (error)
    return (
      <Error action="fetching" goal="transaction" option={configs.option} />
    );
  if (dimensions.height == 0 || dimensions.width == 0) return <Loading />;

  return (
    <Stage
      width={dimensions.width}
      height={dimensions.height}
      onWheel={handleWheel}
      draggable
      className="h-auto w-full"
    >
      <Layer>
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
        {transactions.transactions.map((tx, index) => (
          <Transaction
            key={index}
            txHash={tx.txHash}
            txInfoVisible={txInfoVisible(tx.txHash)}
          />
        ))}
      </Layer>
    </Stage>
  );
}
