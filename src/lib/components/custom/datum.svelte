<script lang="ts">
    import type { CardanoTx } from "@/types";
    import { DatumType } from "@/types/utxo-model";
    import * as cbor2 from "cbor2";
    import { trunc } from "../primitive-utils";
    import { Button } from "../ui/button";
    import { Card, CardContent } from "../ui/card";

  let {tx} : {tx : CardanoTx} = $props();
  let inputsWithDatum = tx.inputs.filter(i => i.datum)
  .map(utxo => ({ref: utxo.outRef, datum: utxo.datum}));
  let outputsWithDatum = tx.outputs.filter(o => o.datum).map(utxo => ({ref: utxo.outRef, datum: utxo.datum}));
  let datumHash = $state('No hash');
  let datumHex = $state('No CBOR');
  let diagnostic = $state('No diagnostic');

  let activeTab = $state(inputsWithDatum.length > 0 ? inputsWithDatum[0] : (outputsWithDatum.length > 0 ? outputsWithDatum[0] : null));
  $effect(() => {
    if(activeTab && activeTab.datum?.type === DatumType.HASH){
      datumHash = activeTab.datum?.datumHashHex ?? 'No hash';
    } else if(activeTab && activeTab.datum?.type === DatumType.INLINE){
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
  <div class="flex flex-col gap-2 p-2 w-min">
    {#if inputsWithDatum.length > 0}
    <div class="font-bold">
      Inputs with Datum:
    </div>
    {#each inputsWithDatum as tab}
      <Button
        size="sm"
        variant={activeTab.ref.hash == tab.ref.hash && activeTab.ref.index == tab.ref.index ? 'default' : 'outline'}
        onclick={() => (activeTab = tab)}
      >
        {trunc(`${tab.ref.hash}#${tab.ref.index}`, 20)}
      </Button>
    {/each}
    {/if}
    {#if outputsWithDatum.length > 0}
    <div class="font-bold mt-3">
      Outputs with Datum:
    </div>
    {#each outputsWithDatum as tab}
      <Button
        size="sm"
        variant={activeTab.ref.hash == tab.ref.hash && activeTab.ref.index == tab.ref.index ? 'default' : 'outline'}
        onclick={() => (activeTab = tab)}
      >
        {trunc(`${tab.ref.hash}#${tab.ref.index}`, 20)}
      </Button>
    {/each}
    {/if}
  </div>
  <div class="p-2 w-3/4">
      <div class="my-4">
        Datum Hash:
          <Card class="p-2 mt-2 break-all whitespace-pre-wrap">
            {datumHash}
          </Card>
      </div>
      <div class="my-4">
        CBOR:
          <Card class="p-2 mt-2 break-all whitespace-pre-wrap">
            {datumHex}
          </Card>
      </div>
      <div class="my-4">
        Diagnostic:
          <Card class="p-2 mt-2 break-all whitespace-pre-wrap">
            {diagnostic}
          </Card>
      </div>


    </div>
  {:else}
    <CardContent class="text-sm text-center text-muted-foreground">
      No inputs or outputs with datum in this transaction.
    </CardContent>
  {/if}
</Card>