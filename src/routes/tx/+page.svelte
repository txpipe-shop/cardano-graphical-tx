<script lang="ts">
  import { Card, CardContent } from '@/components/ui/card';
  import { Badge } from '@/components/ui/badge';
  import { Input } from '@/components/ui/input';
  import { ScrollArea } from '@/components/ui/scroll-area';

  export let data;

  function handleClick() {
    console.log(data);
  }
</script>

<svelte:head>
  <title>Transactions</title>
</svelte:head>

<div class="space-y-6 p-6">
  <div class="text-2xl font-semibold" on:click={handleClick}>Transactions</div>

  <Input placeholder="Search by transaction hash" class="w-full" />

  <ScrollArea class="h-[calc(100vh-10rem)] pr-2">
    <div class="space-y-4">
      {#each data.transactions as tx (tx.hash)}
        <Card class="bg-muted">
          <CardContent class="space-y-2 p-4">
            <div class="flex items-center justify-between text-sm text-muted-foreground">
              <div class="flex items-center gap-2">
                <span class="font-mono text-xs">{tx.hash}</span>
              </div>
              <div class="flex items-center gap-2">
                <Badge variant="secondary">Total TODO</Badge>
                <Badge variant="destructive">Fee -{tx.fee}</Badge>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <div class="font-semibold">From</div>
                {#each tx.inputs as input (input.txHash + input.index)}
                  <div class="text-sm">
                    <span class="font-mono">{input.txHash}#{input.index}</span>
                  </div>
                {/each}
              </div>
              <div class="space-y-2">
                <div class="font-semibold">To</div>
                {#each tx.outputs as output (output.index)}
                  <div class="text-sm">
                    <span class="font-mono">{output.addr}</span>
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
