<script lang="ts">
  import { trunc } from '@/components/primitive-utils';
  import type { CardanoTx } from '@/types';
  import { onMount } from 'svelte';
  import { KONVA_COLORS, TX_HEIGHT, TX_WIDTH } from './constants';

  let StageComp: any = $state(null);
  let LayerComp: any = $state(null);
  let GroupComp: any = $state(null);
  let RectComp: any = $state(null);
  let TextComp: any = $state(null);
  let UtxoLineComp: any = $state(null);

  let {tx}: {tx: CardanoTx} = $props();

  let width = $state(0);
  let height = $state(0);
  let xpos = $state(0);
  let ypos = $state(0);

  let loaded = $state(false);

  onMount(async () => {
    const mod = await import('svelte-konva');
    StageComp = mod.Stage;
    LayerComp = mod.Layer;
    GroupComp = mod.Group;
    RectComp = mod.Rect;
    TextComp = mod.Text;

    const utxoLine = await import('./utxoLine.svelte');
    UtxoLineComp = utxoLine.default;

    width = window.innerWidth;
    height = window.innerHeight * 0.55;
    xpos = window.innerWidth * 0.4;
    ypos = window.innerHeight * 0.15;

    loaded = true;
  });

</script>

<div class="h-full w-full rounded-md bg-white -z-10">
  {#if loaded}
    <StageComp config={{ width, height }} >
      <LayerComp>
        {#each tx.inputs as _, i}
          <UtxoLineComp
            isOutput={false}
            inCount={tx.inputs.length}
            outCount={tx.outputs.length}
            xpos={xpos}
            ypos={ypos}
            index={i}
            isReferenceInput={false}
          />
        {/each}

        <GroupComp
          config={{ x: xpos, y: ypos, draggable: true }}
          on:dragmove={(e: CustomEvent) => {
              xpos = e.detail.currentTarget.attrs.x;
              ypos = e.detail.currentTarget.attrs.y;
              console.log("DRAGGED TO ", xpos, ypos);
          }}
        >
          <GroupComp config={{ x: -TX_WIDTH / 2 + 15, y: -(TX_HEIGHT / 6) }}>
            <RectComp
              config={{
                fill: KONVA_COLORS.LIGHTER_GREY,
                width: TX_WIDTH + 2 * (TX_WIDTH / 3) + 10,
                height: TX_HEIGHT / 7,
                cornerRadius: 10,
              }}
            />
            <TextComp
              config={{
                text: trunc(tx!.hash, 7),
                fontSize: 20,
                x: 25,
                y: 10,
                fill: KONVA_COLORS.BLACK
              }}
            />
          </GroupComp>

          <RectComp
            config={{
              width: TX_WIDTH,
              height: TX_HEIGHT,
              stroke: KONVA_COLORS.BLACK,
              strokeWidth: 3,
              fill: KONVA_COLORS.GREY,
              cornerRadius: 10,
              shadowColor: KONVA_COLORS.BLACK,
              shadowBlur: 0,
              shadowOffset: { x: 3, y: 6 },
              shadowOpacity: 1
            }}
          />
        </GroupComp>
        {#each tx.outputs as _, i}
          <UtxoLineComp
            isOutput={true}
            inCount={tx.inputs.length}
            outCount={tx.outputs.length}
            xpos={xpos}
            ypos={ypos}
            index={i}
            isReferenceInput={false}
          />
        {/each}
      </LayerComp>
    </StageComp>
  {:else}
    <div class="p-4">Loading canvas...</div>
  {/if}
</div>