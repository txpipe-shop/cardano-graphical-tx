<script lang="ts">
  import { navigating } from '$app/stores';
  import TxTable from '@/components/custom/tx-table/tx-table.svelte';
  import { Button } from '@/components/ui/button';
  import { Card, CardContent } from '@/components/ui/card';
  import { Input } from '@/components/ui/input';
  import { currentProvider } from '@/stores/provider-store';
  import type { Cardano, cardano } from '@alexandria/types';
  import type { ChainProvider } from '@alexandria/provider-core';
  import type { ProviderConfig } from '@/providers/types';
  import { loadProviderClient } from '@/providers/load-client';

  let isLoading = $derived($navigating !== null);

  interface Props {
    data: {
      transactions: Awaited<ReturnType<ChainProvider<cardano.UTxO, cardano.Tx, Cardano>['getTxs']>>;
      isServerLoaded: boolean;
    };
  }

  let { data }: Props = $props();

  let clientTransactions = $state<cardano.Tx[]>([]);
  let clientLoading = $state(false);
  let clientError = $state<string | null>(null);

  $effect(() => {
    if (!data.isServerLoaded && $currentProvider && $currentProvider.browser) {
      clientLoading = true;
      clientError = null;

      loadCustomProviderData($currentProvider)
        .catch((error) => {
          clientError = error instanceof Error ? error.message : 'Unknown error loading data';
        })
        .finally(() => {
          clientLoading = false;
        });
    }
  });
  async function loadCustomProviderData(provider: ProviderConfig) {
    const client = loadProviderClient(provider);

    const txs = await client.getTxs({
      limit: 100n,
      query: undefined
    });

    clientTransactions = txs.data;
  }

  let displayTransactions = $derived(
    data.isServerLoaded ? data.transactions.data : clientTransactions
  );

  let txHash = $state('');

  function handleSearch() {
    if (txHash.trim().length === 0) {
      return;
    }
    const providerId = $currentProvider ? $currentProvider.id : '';
    const url = `/tx/${txHash.trim()}?provider=${providerId}`;
    window.location.href = url;
  }
</script>

{#if isLoading}
  <div class="container mx-auto space-y-6 py-3">
    <Card>
      <CardContent class="py-8 text-center">
        <div class="flex items-center justify-center gap-2">
          <div class="border-primary h-6 w-6 animate-spin rounded-full border-b-2"></div>
          <span class="text-muted-foreground">Loading data from provider...</span>
        </div>
      </CardContent>
    </Card>
  </div>
{:else}
  <div class="container mx-auto space-y-6 py-3">
    <div class="flex items-center justify-between gap-2">
      <h1 class="text-4xl font-extrabold">Transactions</h1>
      <div class="flex w-1/2 gap-2">
        <Input placeholder="Search transactions..." bind:value={txHash} />
        <Button variant="default" onclick={handleSearch}>Search</Button>
      </div>
    </div>

    {#if clientLoading}
      <Card>
        <CardContent class="py-8 text-center">
          <div class="flex items-center justify-center gap-2">
            <div class="border-primary h-6 w-6 animate-spin rounded-full border-b-2"></div>
            <span class="text-muted-foreground">Loading data from custom provider...</span>
          </div>
        </CardContent>
      </Card>
    {:else if displayTransactions && displayTransactions.length > 0}
      <TxTable txs={displayTransactions} />
    {:else}
      <Card>
        <CardContent class="text-muted-foreground py-8 text-center">
          {#if clientError}
            Failed to load transaction data from custom provider.
            <br />
            <span class="text-red-600">Client error: {clientError}</span>
          {:else}
            No transaction data available from the current provider.
          {/if}
        </CardContent>
      </Card>
    {/if}
  </div>
{/if}
