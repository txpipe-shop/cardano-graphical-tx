<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { SvelteURLSearchParams } from 'svelte/reactivity';
  import type { cardano, OutRef } from '@laceanatomy/types';
  import { formatAddress, getAssetName, trunc } from '../../primitive-utils';
  import { Badge } from '../../ui/badge';
  import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
  import Copy from '../copy.svelte';

  type UTxOProps = {
    title: string;
    list: cardano.UTxO[];
  };

  let { title, list }: UTxOProps = $props();

  async function goToDatumTab(utxo: OutRef) {
    const currentPathname = $page.url.pathname;

    const params = new SvelteURLSearchParams($page.url.searchParams);
    params.set('datumTab', `${utxo.hash}n${utxo.index}`);

    const newUrl = `${currentPathname}?${params.toString()}`;
    await goto(newUrl);
  }
</script>

<Card>
  <CardHeader>
    <CardTitle class="text-lg">{title} ({(list as cardano.UTxO[]).length})</CardTitle>
  </CardHeader>
  <CardContent class="overflow-x-auto">
    <Table>
      <TableHeader>
        <TableHead>TxOut Ref</TableHead>
        <TableHead>Address</TableHead>
        <TableHead>Coin</TableHead>
        <TableHead>Has Datum</TableHead>
        <TableHead>Values</TableHead>
      </TableHeader>

      <TableBody>
        {#each list as cardano.UTxO[] as utxo (utxo.outRef.hash + utxo.outRef.index)}
          <TableRow>
            <TableCell class="w-1/4 whitespace-pre-wrap break-all font-mono text-sm">
              <div class="flex items-start">
                {trunc(utxo.outRef.hash, 15)}#{utxo.outRef.index.toString()}
                <Copy content={utxo.outRef.hash + '#' + utxo.outRef.index} text="utxo reference" />
              </div>
            </TableCell>
            <TableCell class="w-1/4 whitespace-pre-wrap break-all font-mono text-sm">
              <div class="flex items-start">
                {#if !utxo.address}
                  <div class="flex">
                    No address
                    <div
                      class="bg-gradient-to-r from-purple-500 to-orange-500 bg-clip-text font-extrabold text-transparent"
                    >
                      found
                    </div>
                  </div>
                {:else}
                  <div class="flex gap-0">
                    <div>
                      {formatAddress(utxo.address, false).slice(0, 15) +
                        '...' +
                        formatAddress(utxo.address, false).slice(-15, -6)}
                    </div>
                    <div
                      class="bg-gradient-to-r from-purple-500 to-orange-500 bg-clip-text font-extrabold text-transparent"
                    >
                      {formatAddress(utxo.address, false).slice(-5)}
                    </div>
                  </div>
                  &nbsp;
                  <Copy content={formatAddress(utxo.address, false)} text="address" />
                {/if}
              </div>
            </TableCell>
            <TableCell class="w-1/12 whitespace-pre-wrap break-all font-mono text-sm">
              <Badge variant="secondary">
                {utxo.coin ? utxo.coin.toString() : '-'}
              </Badge>
            </TableCell>
            <TableCell class="w-1/12 whitespace-pre-wrap break-all font-mono text-sm">
              {#if utxo.datum}
                <Badge
                  variant="outline"
                  class="bg-accent-foreground dark:bg-accent cursor-pointer text-white"
                  onclick={() => goToDatumTab(utxo.outRef)}
                >
                  Yes
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    version="1.1"
                    width="256"
                    height="256"
                    viewBox="0 0 256 256"
                    xml:space="preserve"
                  >
                    <g
                      style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;"
                      transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"
                    >
                      <path
                        d="M 84 37.02 c -3.313 0 -6 -2.687 -6 -6 V 12 H 58.98 c -3.313 0 -6 -2.687 -6 -6 s 2.687 -6 6 -6 H 84 c 3.313 0 6 2.687 6 6 v 25.02 C 90 34.333 87.313 37.02 84 37.02 z"
                        style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;"
                        transform=" matrix(1 0 0 1 0 0) "
                        stroke-linecap="round"
                      />
                      <path
                        d="M 33.961 62.039 c -1.536 0 -3.071 -0.586 -4.243 -1.758 c -2.343 -2.343 -2.343 -6.142 0 -8.484 l 50.039 -50.04 c 2.342 -2.343 6.143 -2.343 8.484 0 c 2.344 2.343 2.344 6.142 0 8.485 L 38.204 60.281 C 37.033 61.453 35.497 62.039 33.961 62.039 z"
                        style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;"
                        transform=" matrix(1 0 0 1 0 0) "
                        stroke-linecap="round"
                      />
                      <path
                        d="M 73.658 90 H 16.341 C 7.331 90 0 82.669 0 73.658 V 16.341 C 0 7.331 7.331 0 16.341 0 h 17.62 c 3.313 0 6 2.687 6 6 s -2.687 6 -6 6 h -17.62 C 13.947 12 12 13.947 12 16.341 v 57.317 C 12 76.053 13.947 78 16.341 78 h 57.317 C 76.053 78 78 76.053 78 73.658 V 56.039 c 0 -3.313 2.687 -6 6 -6 s 6 2.687 6 6 v 17.619 C 90 82.669 82.669 90 73.658 90 z"
                        style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;"
                        transform=" matrix(1 0 0 1 0 0) "
                        stroke-linecap="round"
                      />
                    </g>
                  </svg>
                </Badge>
              {:else}
                -
              {/if}
            </TableCell>
            <TableCell class="flex w-full flex-wrap gap-1">
              {#if Object.entries(utxo.value).length > 0}
                <div class="flex w-full flex-wrap gap-1">
                  {#each Object.entries(utxo.value) as [k, v] (k)}
                    <Badge variant="outline" class="text-black dark:text-white">
                      {getAssetName(k)}: {v}
                    </Badge>
                    <br />
                  {/each}
                </div>
              {:else}
                -
              {/if}
            </TableCell>
          </TableRow>
        {/each}
      </TableBody>
    </Table>
  </CardContent>
</Card>
