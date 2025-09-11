<script lang="ts">
  import { trunc, truncHash } from '$lib/components/primitive-utils';
  import { Card, CardContent } from '$lib/components/ui/card';
  import {
      Table,
      TableBody,
      TableCell,
      TableRow
  } from '$lib/components/ui/table/index';
  import type { CardanoTx } from '@/types';
  import { hexToAscii, hexToBech32 } from '@/types/cardano/utils';
  import { HexString } from '@/types/utxo-model';
  import Badge from './ui/badge/badge.svelte';

  export let txs: CardanoTx[] = [];

  function formatDate(s?: number) {
    if (!s) return '-';
    try {
      return new Date(s * 1000).toLocaleString();
    } catch {
      return '-';
    }
  }
  function getAssetName(policyAndName: string) {
    if (policyAndName.length <= 56) return `(${policyAndName})`;
    const nameHex = policyAndName.slice(56);
    let name = '';
    try {
      name = trunc(hexToAscii(HexString(nameHex)), 20);;
      if (!name || name.trim() === '') name = '(empty)';
    } catch {
      name = trunc(nameHex, 20);
    }
    return `${name}`;
  }

  function formatAddress(address: string) {
    try {
      return trunc(hexToBech32(HexString(address), "addr_test"), 30);
    } catch {
      return trunc(address);
    }
  }
</script>

<Card class="mt-4">
  <CardContent class="">
    <Table class="">
      <TableBody class="w-full">
        {#each txs as tx (tx.hash)}
          <TableRow class="w-full">
            <TableCell>
              <a class="text-blue-600 hover:underline" href={'/tx/' + tx.hash}>{truncHash(tx.hash)}</a>
            </TableCell>
            <TableCell>Date: {formatDate(tx.createdAt)}</TableCell>
            <TableCell>Fee: {tx.fee}</TableCell>
          </TableRow>
          <TableRow class="border-b-2 border-gray-300 w-full">
            <TableCell colspan={1} >
              {#each tx.inputs as input, i}
                {#if i !== 0}
                  <hr class="w-full my-1">
                {/if}
                {formatAddress(input.address)} <br>
                {#if input.value}
                  <Badge variant="outline">
                    lovelace: {input.coin}
                  </Badge> <br/>
                  {#each Object.entries(input.value) as [k, v]}
                    <Badge variant="outline">
                      {getAssetName(k)}: {v}
                    </Badge>
                    <br/>
                  {/each}
                  {:else}
                    No Value
                {/if}
                <br>
              {/each}
            </TableCell>
            <TableCell colspan={2} >
              {#each tx.outputs as output, i}
                {#if i !== 0}
                  <hr class="w-full my-1">
                {/if}
                {formatAddress(output.address)} <br>
                {#if output.value}
                  <Badge variant="outline">
                    lovelace: {output.coin}
                  </Badge> <br/>
                  {#each Object.entries(output.value) as [k, v]}
                    <Badge variant="outline">
                      {getAssetName(k)}: {v}
                    </Badge>
                    <br/>
                  {/each}
                  {:else}
                    No Value
                {/if}
                <br>
              {/each}
            </TableCell>
          </TableRow>
        {/each}
      </TableBody>
    </Table>
  </CardContent>
</Card>
