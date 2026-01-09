<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { allProviders, currentProvider, providerStore } from '@/stores/provider-store';
  import { Badge } from '../../ui/badge';
  import { Button } from '../../ui/button';
  import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
  import { Input } from '../../ui/input';
  import { Select } from '../../ui/select';
  import { getNetworkColor, getProviderTypeColor } from './color-utils';
  import {
    isU5CProvider,
    LOCAL_PROVIDER_ID,
    type Network,
    type ProviderConfig,
    type U5CConfig
  } from '@/providers/types';

  let { showCustomForm = $bindable() } = $props();

  const u5cProviders: U5CConfig = $allProviders
    .filter((p) => p.id === LOCAL_PROVIDER_ID && isU5CProvider(p))
    .map((p) => {
      if (isU5CProvider(p)) {
        return p;
      }
      throw new Error('Invalid U5C provider');
    })[0];

  let utxoRpcUrl = $derived(u5cProviders?.utxoRpcUrl || '');

  let customNetwork = $state<Network>('devnet');

  function resetCustomForm() {
    showCustomForm = false;
  }

  function viewTransactionsWithProvider(providerId: string) {
    goto(`/tx?provider=${providerId}`);
  }

  function setCurrentProvider(provider: ProviderConfig) {
    providerStore.setCurrentProvider(provider);
  }

  function handleEditLocalProvider() {
    let provider: ProviderConfig;
    if (!customNetwork || !utxoRpcUrl.trim()) {
      console.log('Invalid custom provider data');
      return;
    }

    provider = {
      id: LOCAL_PROVIDER_ID,
      description:
        'UTxORPC + MiniBlockfrost services for Cardano Local testnet. Not realiable for older queries',
      browser: true,
      name: 'Local (Dolos)',
      network: customNetwork,
      type: 'u5c',
      utxoRpcUrl: utxoRpcUrl.trim(),
      isActive: true
    };

    providerStore.updateLocalProvider(provider);
    if ($currentProvider && $currentProvider?.id === LOCAL_PROVIDER_ID) {
      const url = new URL($page.url);
      url.searchParams.set('provider', $currentProvider.id);
      goto(url.toString());
    }
    resetCustomForm();
  }
</script>

{#if showCustomForm}
  <Card class="mt-4">
    <CardHeader>
      <CardTitle class="text-lg">Edit Local Provider</CardTitle>
    </CardHeader>
    <CardContent class="h-30 flex flex-col justify-between gap-4">
      <div class="flex w-full gap-4">
        <div class="w-full space-y-2">
          <label for="utxorpc-url" class="text-sm font-medium">UTxO RPC URL</label>
          <Input id="utxorpc-url" bind:value={utxoRpcUrl} />
        </div>
        <div class="space-y-2">
          <label for="custom-network" class="text-sm font-medium">Network</label>
          <Select
            items={[
              // { value: 'mainnet', label: 'Mainnet' },
              { value: 'preprod', label: 'Preprod' },
              { value: 'preview', label: 'Preview' }
              // { value: 'custom', label: 'Custom' }
            ]}
            bind:value={customNetwork}
          />
        </div>
      </div>

      <div class="flex justify-end gap-2">
        <Button variant="outline" onclick={resetCustomForm}>Cancel</Button>
        <Button onclick={handleEditLocalProvider} disabled={!utxoRpcUrl.trim() || !customNetwork}>
          Save
        </Button>
      </div>
    </CardContent>
    <CardHeader>
      <CardTitle>Available Providers</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {#each $allProviders as provider (provider.id)}
          <Card class="p-4">
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <h4 class="font-medium">{provider.name}</h4>
                {#if provider.browser}
                  <Badge variant="secondary" class="text-xs">Local</Badge>
                {/if}
              </div>

              <div class="flex items-center gap-2">
                <Badge class={getProviderTypeColor(provider.type)}>
                  {provider.type.toUpperCase()}
                </Badge>
                <Badge class={getNetworkColor(provider.network)}>
                  {provider.network}
                </Badge>
              </div>

              <p class="text-muted-foreground text-sm">
                {provider.description}
              </p>

              <div class="flex gap-1">
                <Button
                  size="sm"
                  variant={$currentProvider?.id === provider.id ? 'default' : 'outline'}
                  onclick={() => setCurrentProvider(provider)}
                >
                  {$currentProvider?.id === provider.id ? 'Current' : 'Select'}
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onclick={() => viewTransactionsWithProvider(provider.id)}
                >
                  Transactions
                </Button>
              </div>
            </div>
          </Card>
        {/each}
      </div>
    </CardContent>
  </Card>
{/if}
