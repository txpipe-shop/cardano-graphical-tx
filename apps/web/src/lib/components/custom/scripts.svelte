<script lang="ts">
  import type { CardanoTx } from '@alexandria/types';
  import { Button } from '../ui/button';
  import { Card, CardContent } from '../ui/card';
  let { tx }: { tx: CardanoTx } = $props();
  let { witnesses } = tx;
  let { redeemers } = witnesses ?? { redeemers: [] };
  let activeTab = $state(redeemers?.[0] ?? undefined);
</script>

<Card class="flex h-80 flex-row justify-between gap-2 px-5">
  {#if !redeemers || redeemers.length === 0}
    <CardContent class="text-muted-foreground text-center text-sm">
      No scripts on this transaction.
    </CardContent>
  {:else}
    <div class="flex w-min flex-col gap-2 overflow-y-scroll p-2">
      {#each redeemers as tab}
        <Button
          size="sm"
          variant={activeTab?.purpose == tab.purpose && activeTab.index == tab.index
            ? 'default'
            : 'outline'}
          onclick={() => (activeTab = tab)}
        >
          {tab?.purpose}
          {tab?.index}
        </Button>
      {/each}
    </div>
    <div class="grid w-full grid-cols-3 gap-3 p-2">
      {#if activeTab}
        <div class="mb-4">
          Script Hash:
          <Card class="mt-2 whitespace-pre-wrap break-all p-2">
            {activeTab.scriptHash !== '' ? activeTab.scriptHash : '-'}
          </Card>
        </div>
        <div class="mb-4">
          Mem:
          <Card class="mt-2 whitespace-pre-wrap break-all p-2">
            {activeTab.unitMem}
          </Card>
        </div>
        <div class="mb-4">
          Cpu:
          <Card class="mt-2 whitespace-pre-wrap break-all p-2">
            {activeTab.unitSteps}
          </Card>
        </div>
        <div class="mb-4">
          Redeemer data hash:
          <Card class="mt-2 whitespace-pre-wrap break-all p-2">
            {activeTab.redeemerDataHash}
          </Card>
        </div>
        <div class="mb-4">
          Purpose:
          <Card class="mt-2 whitespace-pre-wrap break-all p-2">
            {activeTab.purpose}
          </Card>
        </div>
        <div class="mb-4">
          Fee:
          <Card class="mt-2 whitespace-pre-wrap break-all p-2">
            {activeTab.fee}
          </Card>
        </div>
      {/if}
    </div>
  {/if}
</Card>
