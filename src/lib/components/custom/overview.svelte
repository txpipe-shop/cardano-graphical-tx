<script lang="ts">
  import type { CardanoTx } from "@/types";
  import { formatDate, ListType } from "../primitive-utils";
  import { Card, CardContent } from "../ui/card";
  import UtxoList from "./utxo-list.svelte";

  let {displayTx} : {displayTx : CardanoTx} = $props();
</script>

<Card>
  <CardContent class="space-y-2">
    <div class="flex gap-4 justify-around">
      <div class="flex">
        <p class="font-bold">Created:</p> &nbsp;{formatDate(displayTx?.createdAt)}
        <br/>
      </div>
      <div class="flex">
        <p class="font-bold">Fee:</p> &nbsp;
        {displayTx ? displayTx.fee.toString() : '-'}
      </div>
      <div class="flex"><p class="font-bold">Epoch:</p> &nbsp;{displayTx?.createdAt ?? '-'}
      </div>

    </div>
  </CardContent>
</Card>


<UtxoList title="Inputs" list={displayTx.inputs} type={ListType.UTXO}/>
<UtxoList title="Outputs" list={displayTx.outputs} type={ListType.UTXO}/>
{#if displayTx.referenceInputs && displayTx.referenceInputs.length > 0}
  <UtxoList title="Reference Inputs" list={displayTx.referenceInputs} type={ListType.UTXO}/>
{:else}
  <Card>
    <CardContent class="text-sm text-center text-muted-foreground">
      No reference inputs in this transaction.
    </CardContent>
  </Card>
{/if}
{#if displayTx.mint && Object.keys(displayTx.mint).length > 0}
  <UtxoList title="Minted Assets" list={displayTx.mint} type={ListType.VALUE}/>
{:else}
  <Card>
    <CardContent class="text-sm text-center text-muted-foreground">
      No minted assets in this transaction.
    </CardContent>
  </Card>
{/if}
