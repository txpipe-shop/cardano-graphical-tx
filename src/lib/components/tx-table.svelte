<script lang="ts">
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
  } from '$lib/components/ui/table/index';
  import { Card, CardContent } from '$lib/components/ui/card';
  import type { CardanoTx } from '@/types';
  import { truncHash } from '$lib/components/primitive-utils';
  import { tryToParseCip20Metadata } from '@/types/cardano/utils';

  export let txs: CardanoTx[] = [];
</script>

<Card class="mt-4">
  <CardContent class="overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead class="whitespace-nowrap">Date</TableHead>
          <TableHead class="whitespace-nowrap">Hash</TableHead>
          <TableHead class="whitespace-nowrap">Outputs</TableHead>
          <TableHead class="whitespace-nowrap">Metadata</TableHead>
          <TableHead class="whitespace-nowrap">Reference Inputs</TableHead>
          <TableHead class="whitespace-nowrap">Mints / Burns</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {#each txs as tx (tx.hash)}
          <TableRow>
            <TableCell>Soon</TableCell>
            <TableCell>
              <a class="text-blue-600 hover:underline" href={'/tx/' + tx.hash}>{truncHash(tx.hash)}</a>
            </TableCell>
            <TableCell>{tx.outputs.length}</TableCell>
            <TableCell class="max-w-[200px] truncate overflow-hidden whitespace-nowrap"
              >{tryToParseCip20Metadata(tx.metadata)?.join('\n') || '-'}</TableCell
            >
            <TableCell>{tx.referenceInputs.length}</TableCell>
            <TableCell>{Object.keys(tx.mint).length}</TableCell>
          </TableRow>
        {/each}
      </TableBody>
    </Table>
  </CardContent>
</Card>
