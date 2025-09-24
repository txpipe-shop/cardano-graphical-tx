<script lang="ts">
  import { formatAddress, getAssetName, trunc } from '@/components/primitive-utils';
  import type { UTxO } from '@/types/utxo-model';
  import {
      Circle,
      Group,
      Line,
      Rect,
      Text
  } from 'svelte-konva';
  import { KONVA_COLORS, POINT_SIZE, STROKE_WIDTH, TX_HEIGHT, TX_WIDTH } from './constants';

  let {
    xpos, ypos,
    isOutput,
    inCount,
    outCount,
    isReferenceInput,
    index,
    utxo,
  }: {
    isOutput: boolean,
    inCount: number,
    outCount: number,
    isReferenceInput: boolean,
    index: number,
    xpos: number,
    ypos: number,
    utxo: UTxO
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

  let dimensions = $state({ rectWidth: 0, rectHeight: 0 });

  let showInfo = $state(false);

  let text = $derived(utxo.address
    ? `Address: ${formatAddress(utxo.address, true, 10)}\nAssets:
  - lovelace ${utxo.coin}
  ${Object.entries(utxo.value).reduce((acc, [v, k]) => {
    const assetName = getAssetName(v);
    return acc + `- ${assetName} ${k}\n  `;
  }, "")}`
    : `txHash: ${trunc(utxo.outRef.hash, 10)}\nIndex: ${utxo.outRef.index}\nAssets:
  - lovelace ${utxo.coin}
  ${Object.entries(utxo.value).reduce((acc, [v, k]) => {
    const assetName = getAssetName(v);
    return acc + `- ${assetName} ${k}\n  `;
  }, "")}`);


  $effect(() => {
    if (showInfo && utxo) {
      const lines = text.split('\n').length;
      const maxLineLength = Math.max(...text.split('\n').map(line => line.length));
      // TODO: Change this using refs
      const width = maxLineLength * 8 + 20; // Approximate width based on character count
      const height = lines * 20; // Approximate height based on line count
      dimensions = {
        rectWidth: width,
        rectHeight: height,
      };
    }
  })
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

{#if showInfo}
  <Group
    config={{
      draggable: true,
      x: isOutput ? utxoX + 10: utxoX - dimensions.rectWidth - 15,
      y: utxoY - 20
    }}
  >
    <Rect
      config={{
        width: dimensions.rectWidth + 5,
        height: dimensions.rectHeight,
        cornerRadius: 5,
        stroke: KONVA_COLORS.BLACK,
        strokeWidth: 0.5,
        fill: KONVA_COLORS.WHITE
      }}
    />
    <Text
      config={{
        text: text,
        x: 10,
        y: 5,
        fontSize: 16,
        lineHeight: 1.2,
        fill: KONVA_COLORS.BLACK
      }}
    />
  </Group>
{/if}

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
  on:dblclick={(e: CustomEvent) => {
    showInfo = !showInfo;
    e.detail.evt.stopPropagation();
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