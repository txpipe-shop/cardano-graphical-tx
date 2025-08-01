<script lang="ts">
  import { Card, CardContent } from '@/components/ui/card';
  import { Badge } from '@/components/ui/badge';
  import { Input } from '@/components/ui/input';
  import { ScrollArea } from '@/components/ui/scroll-area';

  export let data;
</script>

<svelte:head>
  <title>Transactions</title>
</svelte:head>

<div class="space-y-6 p-6">
  <h1>Transactions</h1>

  <Input placeholder="Search by transaction hash" class="w-full" />

  <ScrollArea class="h-[calc(100vh-10rem)] pr-2">
    <div class="space-y-4">
      {#each data.transactions as tx (tx.hash)}
        <Card class="bg-muted">
          <CardContent class="space-y-2 p-4">
            <div class="flex items-center justify-between text-sm text-muted-foreground">
              <div class="flex items-center gap-2">
                <h4>Tx: {tx.hash}</h4>
              </div>
              <div class="flex items-center gap-2">
                <Badge variant="secondary">Total TODO</Badge>
                <Badge variant="destructive">Fee -{tx.fee}</Badge>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <div class="font-semibold">Inputs</div>
                {#each tx.inputs as input (input.outRef.hash + input.outRef.index)}
                  <div class="text-sm">
                    <a href={'/tx/' + input.outRef.hash} class="font-mono"
                      >{input.outRef.hash}#{input.outRef.index}</a
                    >
                  </div>
                {/each}
              </div>
              <div class="space-y-2">
                <div class="font-semibold">Outputs</div>
                {#each tx.outputs as output (output.outRef.index)}
                  <div class="text-sm">
                    <span class="font-mono">{output.address}</span>
                    {#if output.coin}
                      <span class="ml-2">{output.coin}</span>
                    {/if}
                  </div>
                {/each}
              </div>
            </div>
          </CardContent>
        </Card>
      {/each}
    </div>
  </ScrollArea>
</div>
