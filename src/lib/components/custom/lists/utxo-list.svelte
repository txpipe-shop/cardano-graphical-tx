<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import type { UTxO } from "@/types/cardano/cardano";
  import type { OutRef } from "@/types/utxo-model";
  import { formatAddress, getAssetName, trunc } from "../../primitive-utils";
  import { Badge } from "../../ui/badge";
  import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";

  type UTxOProps = {
    title: string;
    list: UTxO[];
  };

  let {title, list}: UTxOProps = $props();

  async function goToDatumTab(utxo: OutRef) {
    const currentPathname = $page.url.pathname;

    const params = new URLSearchParams($page.url.searchParams);
    params.set('datumTab', `${utxo.hash}n${utxo.index}`);

    const newUrl = `${currentPathname}?${params.toString()}`;
    await goto(newUrl);
  }
</script>

<Card>
  <CardHeader>
    <CardTitle class="text-lg">{title} ({(list as UTxO[]).length}) </CardTitle>
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
        {#each (list as UTxO[]) as utxo}
          <TableRow>
            <TableCell class="font-mono break-all whitespace-pre-wrap text-sm w-1/4"
              >{trunc(utxo.outRef.hash, 15)}#{utxo.outRef.index.toString()}</TableCell
            >
            <TableCell class="font-mono break-all whitespace-pre-wrap text-sm w-1/4">
              <div class="flex items-center">
                {#if !utxo.address}
                  <div class="flex">No address
                    <div class="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-orange-500 font-extrabold">found</div></div>
                {:else}
                <div class="flex gap-0">
                  <div>
                    {formatAddress(utxo.address, false).slice(0, 15) + '...' + formatAddress(utxo.address, false).slice(-15, -6)}
                  </div>
                  <div class="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-orange-500 font-extrabold">
                    {formatAddress(utxo.address, false).slice(-5)}
                  </div>
                </div>
                {/if}
              </div>
            </TableCell>
            <TableCell class="font-mono break-all whitespace-pre-wrap text-sm w-1/12">
              <Badge variant="secondary">
                {utxo.coin ? utxo.coin.toString() : '-'}
              </Badge>
            </TableCell>
            <TableCell class="font-mono break-all whitespace-pre-wrap text-sm w-1/12">
              {#if utxo.datum}
                <Badge variant="outline" class="cursor-pointer" onclick={() => goToDatumTab(utxo.outRef)}>
                  Yes
                </Badge>
              {:else}
                -
              {/if}
            </TableCell>
            <TableCell class="flex w-full gap-1 flex-wrap">
              {#if Object.entries(utxo.value).length > 0}
                <div class="flex w-full gap-1 flex-wrap">
                  {#each Object.entries(utxo.value) as [k, v]}
                  <Badge variant="outline" class="text-black dark:text-white">
                    {getAssetName(k)}: {v}
                  </Badge>
                  <br/>
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