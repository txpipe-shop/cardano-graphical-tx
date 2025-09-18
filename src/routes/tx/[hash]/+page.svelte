<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { createProviderClient } from '@/client/provider-loader';
  import Cbor from '@/components/custom/cbor.svelte';
  import Datum from '@/components/custom/datum.svelte';
  import Dissect from '@/components/custom/dissect.svelte';
  import Overview from '@/components/custom/overview.svelte';
  import Scripts from '@/components/custom/scripts.svelte';
  import { Button } from '@/components/ui/button';
  import { Card, CardContent } from '@/components/ui/card';
  import Diagram from '@/components/ui/diagram/diagram.svelte';
  import { currentProvider } from '@/stores/provider-store';
  import type { CardanoTx } from '@/types';
  import type { ProviderConfig } from '@/types/provider-config';

  interface Props {
    data: {
      tx: CardanoTx | null;
      isServerLoaded: boolean;
      error?: string;
    };
  }

  let { data }: Props = $props();

  // client states
  let clientTx = $state<CardanoTx | null>(null);
  let clientLoading = $state(false);
  let clientError = $state<string | null>(null);

  // Tabs
  type TabKey = 'Overview' | 'Diagram' | 'Dissect' | 'CBOR' | 'Datum' | 'Scripts';
  const tabs = ['Overview', 'Diagram', 'Dissect', 'CBOR', 'Datum', 'Scripts'] as const;
  let activeTab = $state<TabKey>('Overview');
  let cbor = $state<string>('');

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
          console.error(error);
          clientError = error instanceof Error ? error.message : 'Unknown error loading tx';
        })
        .finally(() => {
          clientLoading = false;
        });
    }
  });

  async function loadCustomProviderData(provider: ProviderConfig) {
    const client = createProviderClient(provider);
    const hash = $page.params.hash as unknown as import('@/types/utxo-model').Hash;
    clientTx = await client.getTx({ hash });
    cbor = await client.getCBOR({ hash });
  }

  const displayTx = $derived(data.isServerLoaded ? data.tx : clientTx);
</script>

<div class="container mx-auto space-y-6 px-4 py-3">
  <div class="flex items-center justify-between">
    <h1 class="text-3xl font-extrabold">{$page.params.hash}</h1>
    <Button variant="outline" onclick={refreshData} disabled={!$currentProvider}
      >Refresh with Current Provider</Button
    >
  </div>

  {#if clientLoading}
    <Card>
      <CardContent class="py-8 text-center">
        <div class="flex items-center justify-center gap-2">
          <div class="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
          <span class="text-muted-foreground">Loading transaction from custom provider...</span>
        </div>
      </CardContent>
    </Card>
  {:else if displayTx}
    <!-- Tabs header -->
    <div class="flex gap-2 border-b pb-2">
      {#each tabs as tab}
        <Button
          size="sm"
          variant={activeTab === tab ? 'default' : 'outline'}
          onclick={() => (activeTab = tab)}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</Button
        >

      {/each}
    </div>

    {#if data.error}
      <div class="text-sm text-red-600">{data.error}</div>
    {/if}
    {#if clientError}
      <div class="text-sm text-red-600">Client error: {clientError}</div>
    {/if}

    {#if activeTab === 'Overview'}
    <Overview {displayTx}/>
    {/if}

    {#if activeTab === 'Diagram'}
      <Card class="-z-20">
        <CardContent class="py-1">
        <Diagram tx={displayTx}/>
        </CardContent>
      </Card>
    {/if}

    {#if activeTab === 'Dissect'}
      <Dissect tx={displayTx}/>
    {/if}

    {#if activeTab === 'Datum'}
      <Datum tx={displayTx}/>
    {/if}

    {#if activeTab === 'CBOR'}
      <Cbor {cbor}/>
    {/if}

    {#if activeTab === 'Scripts'}
      <Scripts tx={displayTx}/>
    {/if}
  {:else}
    <Card>
      <CardContent class="py-8 text-center text-muted-foreground"
        >Transaction not found or not loaded.</CardContent
      >
    </Card>
  {/if}
</div>

<style>
  /* minimal overrides if needed */
</style>
