<script lang="ts">
  import TxTable from '$lib/components/tx-table.svelte';
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
  import { Badge } from '@/components/ui/badge';
  import { Button } from '@/components/ui/button';
  import { currentProvider, builtInProviders } from '@/stores/provider-store';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import type { CardanoTx } from '@/types';
  import type { ProviderConfig } from '@/types/provider-config';
  import { createProviderClient } from '@/client/provider-loader';

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

  let provider = $currentProvider ? $currentProvider : $builtInProviders[0];

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

  // client side loading
  onMount(async () => {
    if (!data.isServerLoaded && $currentProvider && !$currentProvider.isBuiltIn) {
      clientLoading = true;
      clientError = null;

      try {
        await loadCustomProviderData($currentProvider);
      } catch (error) {
        clientError = error instanceof Error ? error.message : 'Unknown error loading data';
      } finally {
        clientLoading = false;
      }
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

<div class="container mx-auto space-y-6 px-4 py-3">
  <div class="flex items-center justify-between">
    <h1 class="text-4xl font-extrabold">Transactions</h1>
    <Button onclick={refreshData} variant="outline">Refresh with Current Provider</Button>
  </div>

  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        Data Source Information
        <Badge variant="secondary">{provider.type.toUpperCase()}</Badge>
        <Badge variant="outline">{provider.network}</Badge>
        {#if data.isServerLoaded}
          <Badge variant="default">Server-side</Badge>
        {:else}
          <Badge variant="outline">Client-side</Badge>
        {/if}
      </CardTitle>
    </CardHeader>
    <CardContent class="space-y-2">
      <div class="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
        <div>
          <span class="font-medium">Provider:</span>
          {provider.name}
        </div>
        <div>
          <span class="font-medium">Loading:</span>
          {#if data.isServerLoaded}
            <span class="text-green-600">Server-side (SSR)</span>
          {:else if clientLoading}
            <span class="text-blue-600">Client-side (loading...)</span>
          {:else}
            <span class="text-blue-600">Client-side</span>
          {/if}
        </div>
      </div>
      <div class="pt-2">
        <span class="text-sm text-muted-foreground">
          {data.error}
          {#if clientError}
            <br /><span class="text-red-600">Client error: {clientError}</span>
          {/if}
        </span>
      </div>
    </CardContent>
  </Card>

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
        {:else}
          No transaction data available from the current provider.
        {/if}
      </CardContent>
    </Card>
  {/if}
</div>
