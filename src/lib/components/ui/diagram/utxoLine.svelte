<script lang="ts">
  import {
      Circle,
      Line
  } from 'svelte-konva';
  import { KONVA_COLORS, POINT_SIZE, STROKE_WIDTH, TX_HEIGHT, TX_WIDTH } from './constants';

  let {
    xpos, ypos,
    isOutput,
    inCount,
    outCount,
    isReferenceInput,
    index,
  }: {
    isOutput: boolean,
    inCount: number,
    outCount: number,
    isReferenceInput: boolean,
    index: number,
    xpos: number,
    ypos: number
  } = $props();

  const length = isOutput ? outCount : inCount;
  const distanceBetween = isOutput ? TX_HEIGHT / (outCount + 1): TX_HEIGHT / (inCount + 1);
  let color = $state(isOutput ? KONVA_COLORS.RED : KONVA_COLORS.BLUE);

  const hasSpace = (length - 1) * POINT_SIZE > TX_HEIGHT;
  const margin = hasSpace ? ((length - 1) * POINT_SIZE - TX_HEIGHT) / 2 : 0;

  let txX = $derived(xpos);
  let txY = $derived(ypos);

  let utxoXDeviation = $state(isOutput ?  2 * TX_WIDTH : - TX_WIDTH);
  let utxoYDeviation = $state(hasSpace ? - margin + index * POINT_SIZE : distanceBetween * (index + 1));
  let utxoX =  $derived(txX + utxoXDeviation);
  let utxoY =  $derived(hasSpace ? txY  + utxoYDeviation : txY + utxoYDeviation);
  let centerXOutput =  $derived(txX + TX_WIDTH);
  let centerXInput = $derived(txX);

  let points = $derived(isOutput ?
    [
      centerXOutput + STROKE_WIDTH / 2,
      txY + distanceBetween * (index + 1),
      centerXOutput + Math.abs(centerXOutput - utxoX) * 0.7,
      txY + distanceBetween * (index + 1),
      utxoX - Math.abs(centerXOutput - utxoX) * 0.7,
      utxoY,
      utxoX,
      utxoY,
    ] :
    [
      centerXInput - STROKE_WIDTH / 2,
      txY + distanceBetween * (index + 1),
      centerXInput - Math.abs(utxoX - centerXInput) * 0.7,
      txY + distanceBetween * (index + 1),
      utxoX + Math.abs(utxoX - centerXInput) * 0.7,
      utxoY,
      utxoX,
      utxoY,
    ]);

  const referenceInputLine = isReferenceInput ? [5, 5] : [];
</script>

<Line
    config={{
    points: points,
    index: index,
    stroke: color,
    dash: referenceInputLine,
    strokeWidth: 2,
    bezier: true
    }}
/>

<Circle
  config={{
    x: utxoX,
    y: utxoY,
    radius: POINT_SIZE,
    width: POINT_SIZE,
    height: POINT_SIZE,
    fill: color,
    stroke: color,
    strokeWidth: 3,
    draggable: true,
  }}
  on:dragmove={(e: CustomEvent) => {
    utxoX = e.detail.currentTarget.attrs.x;
    utxoY = e.detail.currentTarget.attrs.y;
  }}
  on:dragend={(e: CustomEvent) => {
    utxoXDeviation = e.detail.currentTarget.attrs.x - txX;
    utxoYDeviation = e.detail.currentTarget.attrs.y - txY;
  }}
/>