<script lang="ts">
  import { Card } from '$lib/components/ui/card';
  import type { CardanoTx } from '@/types';

  export let tx: CardanoTx | null = null;
</script>

<div class="h-screen w-full rounded-md border-black border-2 bg-white">
  <div class="h-full flex justify-center items-center text-black">
    <div class="flex flex-col items-center">
      {#if tx?.inputs}
      <svg width="200" height="300">
        {#each tx?.inputs as input, i}
          <text x="20" y="{i * 20 + 10}" font-size="16">input: {input.outRef.hash.slice(0,8)}...#{input.outRef.index}</text>
          <rect x="10" y="{i * 20 + 15}" width="190" height="2" fill="blue" />
          <circle cx="10" cy="{i * 20 + 16.5}" r="6" fill="blue" />
        {/each}
      </svg>
      {:else}
      <div class="text-2xl">No inputs available</div>
      {/if}
    </div>
      <Card class="h-80 w-40 bg-[#808080] border-3 border-black"/>
    <div class="flex flex-col items-center">
      {#if tx?.outputs}
      <svg width="200" height="300">
        {#each tx?.outputs as output, i}
          <text x="7" y="{i * 20 + 10}" font-size="16">output: {output.outRef.hash.slice(0,8)}...#{output.outRef.index}</text>
          <rect x="0" y="{i * 20 + 15}" width="190" height="2" fill="red" />
          <circle cx="193" cy="{i * 20 + 16.5}" r="6" fill="red" />
        {/each}
      </svg>
      {:else}
      <div class="text-2xl">No inputs available</div>
      {/if}
    </div>
  </div>
</div>
