<script lang="ts">
  import type { UTxO } from "@/types/cardano/cardano";
  import { type Value } from "@/types/utxo-model";
  import { formatAddress, getAssetName, ListType } from "../primitive-utils";
  import { Badge } from "../ui/badge";
  import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

  type UTxOProps = {
  title: string;
  list: UTxO[];
  type: ListType.UTXO;
};

type ValueProps = {
  title: string;
  list: Value;
  type: ListType.VALUE;
};

type Props = UTxOProps | ValueProps;

  let {title, list, type = ListType.UTXO}: Props = $props();
</script>

<Card>
  <CardHeader>
    <CardTitle class="text-lg">{title} {#if type === ListType.UTXO}
    ({(list as UTxO[]).length})
  {/if}</CardTitle>
  </CardHeader>
  <CardContent class="overflow-x-auto">
    <Table>
      {#if type === ListType.UTXO}
        <TableHeader>
          <TableRow>
            <TableHead>TxOut Ref</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Coin</TableHead>
          <TableHead>Has Datum</TableHead>
          <TableHead>Values</TableHead>
        </TableRow>
      </TableHeader>
      {/if}
      <TableBody>
        {#if type === ListType.VALUE}
        <div class="flex w-full gap-2 flex-wrap">
          {#each Object.entries(list) as [k, v]}
          <Badge variant="outline">
            {getAssetName(k)}: {v}
          </Badge>
          {/each}
        </div>
        {:else}
          {#each (list as UTxO[]) as utxo}
            <TableRow>
              <TableCell class="font-mono break-all whitespace-pre-wrap text-xs w-1/4"
                >{utxo.outRef.hash}#{utxo.outRef.index.toString()}</TableCell
              >
              <TableCell class="font-mono break-all whitespace-pre-wrap text-xs w-1/4"
                >{formatAddress(utxo.address)}</TableCell
              >
              <TableCell class="font-mono break-all whitespace-pre-wrap text-xs w-1/12"
                >{utxo.coin.toString()}</TableCell
              >
              <TableCell class="font-mono break-all whitespace-pre-wrap text-xs w-1/12"
                >{utxo.datum ? 'Yes' : '-'}</TableCell
              >
              <TableCell class="flex w-full gap-1 flex-wrap">

                {#if utxo.value}
                  <div class="flex w-full gap-1 flex-wrap">
                    <Badge variant="outline">
                      lovelace: {utxo.coin}
                    </Badge> <br/>
                    {#each Object.entries(utxo.value) as [k, v]}
                    <Badge variant="outline">
                      {getAssetName(k)}: {v}
                    </Badge>
                    <br/>
                    {/each}
                  </div>
                {:else}
                  No Value
                {/if}
              </TableCell>
            </TableRow>
          {/each}
        {/if}
      </TableBody>
    </Table>
  </CardContent>
</Card>