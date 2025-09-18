<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { createProviderClient } from '@/client/provider-loader';
  import TxTable from '@/components/custom/tx-table.svelte';
  import { Badge } from '@/components/ui/badge';
  import { Button } from '@/components/ui/button';
  import { Card, CardContent } from '@/components/ui/card';
  import { currentProvider } from '@/stores/provider-store';
  import type { CardanoTx } from '@/types';
  import type { ProviderConfig } from '@/types/provider-config';

  interface Props {
    data: {
      transactions: CardanoTx[];
      isServerLoaded: boolean;
      error?: string;
    };
  }

  let { data }: Props = $props();

  let clientTransactions = $state<CardanoTx[]>([]);
  let clientLoading = $state(false);
  let clientError = $state<string | null>(null);

  function reloadWithProvider(providerId: string) {
    const url = new URL($page.url);
    url.searchParams.set('provider', providerId);
    goto(url.toString());
  }

  function refreshData() {
    if ($currentProvider) {
      reloadWithProvider($currentProvider.id);
    }
  }

  $effect(() => {
    if (!data.isServerLoaded && $currentProvider && $currentProvider.isLocal) {
      clientLoading = true;
      clientError = null;

      loadCustomProviderData($currentProvider)
        .catch((error) => {
          clientError = error instanceof Error ?  error.message : 'Unknown error loading data';
        })
        .finally(() => {
          clientLoading = false;
        });
    }
  });
  async function loadCustomProviderData(provider: ProviderConfig) {
    const client = createProviderClient(provider);

    const tx = await client.getLatestTx();

    const txs = await client.getTxs({
      before: tx.hash,
      limit: 100
    });

    clientTransactions = txs;
  }

  let displayTransactions = $derived(data.isServerLoaded ? data.transactions : clientTransactions);
</script>

<div class="container mx-auto space-y-6 py-3">
  <div class="flex items-center justify-between">
    <div class="flex gap-2 items-end">

      <h1 class="text-4xl font-extrabold">Transactions</h1>
      <Badge variant="outline" class="h-8">
        {#if data.isServerLoaded}
          <span class="text-green-600">Server-side (SSR)</span>
        {:else if clientLoading}
          <span class="text-blue-600">Client-side (loading...)</span>
        {:else}
          <span class="text-blue-600">Client-side</span>
        {/if}
      </Badge>
    </div>
      <Button onclick={refreshData} variant="outline" disabled={!$currentProvider}>
      Refresh with Current Provider
    </Button>
  </div>

  {#if clientLoading}
    <Card>
      <CardContent class="py-8 text-center">
        <div class="flex items-center justify-center gap-2">
          <div class="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
          <span class="text-muted-foreground">Loading data from custom provider...</span>
        </div>
      </CardContent>
    </Card>
  {:else if displayTransactions && displayTransactions.length > 0}
    <TxTable txs={displayTransactions} />
  {:else}
    <Card>
      <CardContent class="py-8 text-center text-muted-foreground">
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
