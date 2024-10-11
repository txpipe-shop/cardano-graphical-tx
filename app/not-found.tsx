"use client";
import type { Vector2d } from "konva/lib/types";
import { useEffect, useRef, useState } from "react";
import { Circle, Group, Layer, Line, Rect, Stage, Text } from "react-konva";
import {
  KONVA_COLORS,
  POINT_SIZE,
  STROKE_WIDTH,
  TX_HEIGHT,
  TX_WIDTH,
} from "~/app/_utils";
import { Header, PropBlock } from "./_components";

export default function FourOhFour() {
  const [divSize, setDivSize] = useState({ width: 0, height: 0 });
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current) {
      setDivSize({
        width: divRef.current.offsetWidth,
        height: divRef.current.offsetHeight,
      });
    }
  }, [divRef, setDivSize]);
  const txPos = {
    x: divSize.width / 2 - (9 * TX_WIDTH) / 2,
    y: divSize.height / 2 - TX_HEIGHT / 2,
  };

  const utxos = {
    "0x1": {
      pos: { x: txPos.x - 100, y: txPos.y + TX_HEIGHT + 25 },
      color: KONVA_COLORS.BLUE,
    },
    "0x2": {
      pos: { x: txPos.x - 50, y: txPos.y + TX_HEIGHT + 25 },
      color: KONVA_COLORS.BLUE,
    },
    "0x3": {
      pos: {
        x: txPos.x + TX_WIDTH + 100,
        y: txPos.y + TX_HEIGHT + 25,
      },
      color: KONVA_COLORS.RED,
    },
  };

  const getLines = (
    txPos: Vector2d,
    utxos: Record<string, { pos: Vector2d; color: string }>,
  ): Record<string, number[]> => {
    return {
      "0x1": [
        txPos.x - STROKE_WIDTH / 2,
        txPos.y + (TX_HEIGHT / 3) * 1,
        txPos.x - TX_WIDTH / 2,
        txPos.y + (TX_HEIGHT / 3) * 1,
        txPos.x - TX_WIDTH * 0.7,
        txPos.y + (TX_HEIGHT / 3) * 1,
        utxos["0x1"]!.pos.x,
        utxos["0x1"]!.pos.y,
      ],
      "0x2": [
        txPos.x - STROKE_WIDTH / 2,
        txPos.y + (TX_HEIGHT / 3) * 2,
        txPos.x - (TX_WIDTH / 2) * 0.7,
        txPos.y + (TX_HEIGHT / 3) * 2,
        txPos.x - (TX_WIDTH / 2) * 0.7,
        txPos.y + (TX_HEIGHT / 3) * 2,
        utxos["0x2"]!.pos.x,
        utxos["0x2"]!.pos.y,
      ],
      "0x3": [
        txPos.x + TX_WIDTH + STROKE_WIDTH / 2,
        txPos.y + (TX_HEIGHT / 2) * 1,
        txPos.x + TX_WIDTH + STROKE_WIDTH / 2,
        txPos.y + (TX_HEIGHT / 2) * 1,
        txPos.x + TX_WIDTH + TX_WIDTH * 0.7,
        txPos.y + (TX_HEIGHT / 2) * 1,
        utxos["0x3"]!.pos.x,
        utxos["0x3"]!.pos.y,
      ],
    };
  };

  return (
    <main className="flex h-screen w-full gap-2 overflow-hidden">
      <div
        className={`flex h-full w-full ${divRef === null ? "hidden" : ""}`}
        ref={divRef}
      >
        <Stage width={divSize.width / 3} height={divSize.height}>
          <Layer>
            <Group x={txPos.x} y={txPos.y}>
              <Rect
                width={TX_WIDTH}
                height={TX_HEIGHT}
                stroke={KONVA_COLORS.BLACK}
                strokeWidth={STROKE_WIDTH}
                fill={KONVA_COLORS.GREY}
              />
            </Group>
            {Object.entries(utxos).map(([hash, props]) => (
              <Circle
                key={hash}
                x={props.pos.x}
                y={props.pos.y}
                radius={POINT_SIZE}
                width={POINT_SIZE}
                height={POINT_SIZE}
                fill={props.color}
              />
            ))}
            {Object.entries(utxos).map(([hash, props]) => (
              <Line
                key={hash}
                bezier
                points={getLines(txPos, utxos)[hash]}
                stroke={props.color}
                strokeWidth={2}
              />
            ))}
            <Text
              text={`X    X\n____`}
              x={txPos.x}
              y={txPos.y + TX_HEIGHT / 2 - 40}
              width={TX_WIDTH - 10}
              height={TX_HEIGHT / 2}
              fontSize={25}
              align="center"
            />
          </Layer>
        </Stage>
        <div className={`flex w-full flex-col gap-10 px-10`}>
          <PropBlock title="404" value="Page not found" color="red" />
          <div className="rotate-1">
            <PropBlock value="" />
          </div>
          <div className="mt-10 rotate-6">
            <PropBlock value="" />
          </div>
          <div className="mt-10 rotate-12">
            <PropBlock value="" />
          </div>
        </div>
      </div>
      <Header />
    </main>
  );
}
