<script lang="ts">
  import { Card, CardContent } from '$lib/components/ui/card';
  import { Table, TableBody, TableCell, TableRow } from '$lib/components/ui/table/index';
  import type { CardanoTx } from '@alexandria/types';
  import TableFirstRow from './table-first-row.svelte';
  import TableValues from './table-values.svelte';

  export let txs: CardanoTx[] = [];
</script>

<Card class="mt-4">
  <CardContent class="relative overflow-x-auto">
    {#if txs.length === 0}
      No transactions found for this provider.
    {:else}
      <Table class="w-full text-base">
        <TableBody class="w-full">
          {#each txs as tx (tx.hash)}
            <TableFirstRow {tx} />
            <TableRow class="w-full border-b-2 border-gray-300">
              <TableCell colspan={1} class="">
                <TableValues list={tx.inputs} mints={tx.mint} />
              </TableCell>
              <TableCell colspan={3}>
                <TableValues list={tx.outputs} mints={tx.mint} />
              </TableCell>
            </TableRow>
          {/each}
        </TableBody>
      </Table>
    {/if}
  </CardContent>
</Card>
