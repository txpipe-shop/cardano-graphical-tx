<script lang="ts">
  import type { UTxO } from "@/types/cardano/cardano";
  import { formatAddress, getAssetName } from "../../primitive-utils";
  import { Badge } from "../../ui/badge";
  import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";

  type UTxOProps = {
    title: string;
    list: UTxO[];
  };

  let {title, list}: UTxOProps = $props();

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
            <TableCell class="font-mono break-all whitespace-pre-wrap text-xs w-1/4"
              >{utxo.outRef.hash}#{utxo.outRef.index.toString()}</TableCell
            >
            <TableCell class="font-mono break-all whitespace-pre-wrap text-xs w-1/4"
              >{formatAddress(utxo.address, false)}</TableCell
            >
            <TableCell class="font-mono break-all whitespace-pre-wrap text-xs w-1/12"
              >{utxo.coin ? utxo.coin.toString() : '-'}</TableCell
            >
            <TableCell class="font-mono break-all whitespace-pre-wrap text-xs w-1/12"
              >{utxo.datum ? 'Yes' : '-'}</TableCell
            >
            <TableCell class="flex w-full gap-1 flex-wrap">
              {#if Object.entries(utxo.value).length > 0}
                <div class="flex w-full gap-1 flex-wrap">
                  {#each Object.entries(utxo.value) as [k, v]}
                  <Badge variant="outline">
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