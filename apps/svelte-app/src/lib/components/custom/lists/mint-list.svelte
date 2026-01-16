<script lang="ts">
  import { type Value } from '@laceanatomy/types';
  import { getAssetName } from '../../primitive-utils';
  import { Badge } from '../../ui/badge';
  import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
  import { Table, TableBody, TableCell, TableRow } from '../../ui/table';

  type ValueProps = {
    title: string;
    list: Value;
  };

  let { title, list }: ValueProps = $props();
  function getBadgeColor(amount: bigint): string {
    if (amount > 0n) return 'dark:bg-green-800 dark:text-white bg-green-500 text-black';
    else return 'dark:bg-red-800 dark:text-white bg-red-500 text-black';
  }
</script>

<Card>
  <CardHeader>
    <CardTitle class="text-lg">{title}</CardTitle>
  </CardHeader>
  <CardContent class="overflow-x-auto">
    <Table>
      <TableBody>
        <TableRow class="flex w-full flex-wrap gap-2 ">
          <TableCell colspan={5} class="flex w-full flex-wrap gap-2">
            {#each Object.entries(list) as [k, v] (k)}
              <Badge variant="outline" class={'text-sm ' + getBadgeColor(v)}>
                <div class="font-extrabold">{getAssetName(k)}</div>
                : {v}
              </Badge>
            {/each}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </CardContent>
</Card>
