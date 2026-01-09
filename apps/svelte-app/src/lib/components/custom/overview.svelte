<script lang="ts">
  import type { cardano } from '@alexandria/types';
  import { formatDate } from '../primitive-utils';
  import { Card, CardContent } from '../ui/card';
  import MintList from './lists/mint-list.svelte';
  import UtxoList from './lists/utxo-list.svelte';

  let { displayTx }: { displayTx: cardano.Tx } = $props();
</script>

<Card>
  <CardContent class="space-y-2">
    <div class="flex justify-around gap-4">
      <div class="flex">
        <p class="font-bold">Created:</p>
        &nbsp;{formatDate(displayTx?.createdAt)}
      </div>
      <div class="flex">
        <p class="font-bold">Fee:</p>
        &nbsp;
        {displayTx ? displayTx.fee.toString() : '-'}
      </div>
      <div class="flex">
        <p class="font-bold">Block Height:</p>
        &nbsp;{displayTx?.block?.height ?? '-'}
      </div>
      {#if displayTx.validityInterval}
        <div class="flex">
          <p class="font-bold">Invalid Before:</p>
          &nbsp;{displayTx?.validityInterval?.invalidBefore ?? '-'}
        </div>
        <div class="flex">
          <p class="font-bold">Invalid Hereafter:</p>
          &nbsp;{displayTx?.validityInterval?.invalidHereafter ?? '-'}
        </div>
      {/if}
    </div>
  </CardContent>
</Card>

<UtxoList title="Inputs" list={displayTx.inputs} />
<UtxoList title="Outputs" list={displayTx.outputs} />
{#if displayTx.referenceInputs && displayTx.referenceInputs.length > 0}
  <UtxoList title="Reference Inputs" list={displayTx.referenceInputs} />
{:else}
  <Card>
    <CardContent class="text-muted-foreground text-center text-sm">
      No reference inputs in this transaction.
    </CardContent>
  </Card>
{/if}
{#if displayTx.mint && Object.keys(displayTx.mint).length > 0}
  <MintList title="Minted Assets" list={displayTx.mint} />
{:else}
  <Card>
    <CardContent class="text-muted-foreground text-center text-sm">
      No minted assets in this transaction.
    </CardContent>
  </Card>
{/if}
