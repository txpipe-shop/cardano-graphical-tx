<script lang="ts">
    import type { CardanoTx } from "@/types";
    import { Button } from "../ui/button";
    import { Card, CardContent } from "../ui/card";
  let {tx} : {tx : CardanoTx} = $props();
  let {redeemers} = tx;
  let activeTab = $state(redeemers?.[0] ?? undefined);
</script>


<Card class="flex flex-row justify-between gap-2">
  {#if !redeemers || redeemers.length === 0}
    <CardContent class="text-sm text-center text-muted-foreground">
      No scripts on this transaction.
    </CardContent>
  {:else}
  <div class="flex flex-col gap-2 p-2 w-min">
    {#each redeemers as tab}
      <Button
        size="sm"
        variant={activeTab?.purpose == tab.purpose && activeTab.index == tab.index ? 'default' : 'outline'}
        onclick={() => (activeTab = tab)}
      >
        {tab?.purpose} {tab?.index}
      </Button>
    {/each}
  </div>
  <div class="p-2 w-full grid grid-cols-3 gap-3">
    {#if activeTab}
      <div class="mb-4 ">

        Script Hash:
        <Card class="p-2 mt-2 break-all whitespace-pre-wrap">
          {activeTab.scriptHash}
        </Card>
      </div>
      <div class="mb-4 ">

        Mem:
        <Card class="p-2 mt-2 break-all whitespace-pre-wrap">
              {activeTab.unitMem}
          </Card>
      </div>
      <div class="mb-4 ">
          Cpu:
        <Card class="p-2 mt-2 break-all whitespace-pre-wrap">
              {activeTab.unitSteps}
          </Card>
      </div>
      <div class="mb-4 ">
        Redeemer data hash:
        <Card class="p-2 mt-2 break-all whitespace-pre-wrap">
              {activeTab.redeemerDataHash}
          </Card>
      </div>
      <div class="mb-4 ">
        Purpose:
        <Card class="p-2 mt-2 break-all whitespace-pre-wrap">
              {activeTab.purpose}
          </Card>
      </div>
      <div class="mb-4 ">
        Fee:
        <Card class="p-2 mt-2 break-all whitespace-pre-wrap">
              {activeTab.fee}
          </Card>
      </div>
      {/if}
    </div>
  {/if}
</Card>