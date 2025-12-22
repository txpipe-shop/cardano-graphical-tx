<script lang="ts">
  import { type CardanoTx, DatumType } from '@alexandria/types';
  import * as cbor2 from 'cbor2';
  import { onMount } from 'svelte';
  import { trunc } from '../primitive-utils';
  import { Button } from '../ui/button';
  import { Card, CardContent } from '../ui/card';

  let { tx, tab }: { tx: CardanoTx; tab?: string } = $props();
  let inputsWithDatum = tx.inputs
    .filter((i) => i.datum)
    .map((utxo) => ({ ref: utxo.outRef, datum: utxo.datum }));
  let outputsWithDatum = tx.outputs
    .filter((o) => o.datum)
    .map((utxo) => ({ ref: utxo.outRef, datum: utxo.datum }));
  let datumHash = $state('No hash');
  let datumHex = $state('No CBOR');
  let diagnostic = $state('No diagnostic');

  let activeTab = $state(
    inputsWithDatum.length > 0
      ? inputsWithDatum[0]
      : outputsWithDatum.length > 0
        ? outputsWithDatum[0]
        : null
  );

  onMount(() => {
    if (tab) {
      let foundTab =
        inputsWithDatum.find((t) => `${t.ref.hash}n${t.ref.index}` === tab) ||
        outputsWithDatum.find((t) => `${t.ref.hash}n${t.ref.index}` === tab);
      if (foundTab) activeTab = foundTab;
    }
  });

  $effect(() => {
    if (activeTab && activeTab.datum?.type === DatumType.HASH) {
      datumHash = activeTab.datum?.datumHashHex ?? 'No hash';
    } else if (activeTab && activeTab.datum?.type === DatumType.INLINE) {
      datumHex = activeTab.datum?.datumHex ?? 'No CBOR';
      try {
        diagnostic = cbor2.diagnose(activeTab.datum?.datumHex);
      } catch {
        diagnostic = 'Error parsing CBOR';
      }
    }
  });
</script>

<Card class="flex flex-row gap-2 px-5">
  {#if activeTab}
    <div class="flex w-min flex-col gap-2 p-2">
      {#if inputsWithDatum.length > 0}
        <div class="font-bold">Inputs with Datum:</div>
        {#each inputsWithDatum as tab}
          <Button
            size="sm"
            variant={activeTab.ref.hash == tab.ref.hash && activeTab.ref.index == tab.ref.index
              ? 'default'
              : 'outline'}
            onclick={() => (activeTab = tab)}
          >
            {trunc(`${tab.ref.hash}#${tab.ref.index}`, 20)}
          </Button>
        {/each}
      {/if}
      {#if outputsWithDatum.length > 0}
        <div class="mt-3 font-bold">Outputs with Datum:</div>
        {#each outputsWithDatum as tab}
          <Button
            size="sm"
            variant={activeTab.ref.hash == tab.ref.hash && activeTab.ref.index == tab.ref.index
              ? 'default'
              : 'outline'}
            onclick={() => (activeTab = tab)}
          >
            {trunc(`${tab.ref.hash}#${tab.ref.index}`, 20)}
          </Button>
        {/each}
      {/if}
    </div>
    <div class="w-3/4 p-2">
      {#if activeTab.datum?.type === DatumType.HASH}
        <div class="my-4">
          Datum Hash:
          <Card class="mt-2 whitespace-pre-wrap break-all p-2">
            {datumHash}
          </Card>
        </div>
      {:else if activeTab.datum?.type === DatumType.INLINE}
        <div class="my-4">
          INLINE DATUM:
          <Card class="mt-2 whitespace-pre-wrap break-all p-2">
            {datumHex}
          </Card>
        </div>
        <div class="my-4">
          Diagnostic:
          <Card class="mt-2 whitespace-pre-wrap break-all p-2">
            {diagnostic}
          </Card>
        </div>
      {/if}
    </div>
  {:else}
    <CardContent class="text-muted-foreground text-center text-sm">
      No inputs or outputs with datum in this transaction.
    </CardContent>
  {/if}
</Card>

