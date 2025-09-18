<script lang="ts">
  import { goto } from '$app/navigation';
  import { Badge } from '@/components/ui/badge';
  import { Button } from '@/components/ui/button';
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
  import { Input } from '@/components/ui/input';
  import { Select } from '@/components/ui/select';
  import { allProviders, currentProvider, providerStore } from '@/stores/provider-store';
  import type { Network, ProviderConfig } from '@/types/provider-config';
  import { cn } from '@/utils';


  interface Props {
    class?: string;
  }

  let { class: className }: Props = $props();

  let showCustomForm = $state(false);
  let customName = $state('');
  let utxoRpcUrl = $state('');
  let utxoRpcApiKey = $state('');
  let miniBfUrl = $state('');
  let miniBfApiKey = $state('');

  let customType = $state<'dolos'>('dolos');
  let customNetwork = $state<Network>('custom');

  function handleProviderChange(providerId: string) {
    const provider = $allProviders.find((p) => p.id === providerId);
    if (provider) {
      providerStore.setCurrentProvider(provider);
    }
  }

  function handleAddCustomProvider() {
    let provider: ProviderConfig;
    if (
      !customName.trim() ||
      !utxoRpcUrl.trim() ||
      !utxoRpcApiKey.trim() ||
      !miniBfUrl.trim() ||
      !miniBfApiKey.trim()
    ) {
      console.log('Invalid custom provider data');
      return;
    }

    provider = {
      id: 'custom-' + Date.now(),
      description: '',
      isBuiltIn: false,
      name: customName.trim(),
      network: customNetwork,
      type: 'dolos',
      utxoRpcUrl: utxoRpcUrl.trim(),
      utxoRpcApiKey: utxoRpcApiKey.trim(),
      miniBfUrl: miniBfUrl.trim(),
      miniBfApiKey: miniBfApiKey.trim()
    };
    const newProvider = providerStore.addCustomProvider(provider);

    providerStore.setCurrentProvider(newProvider);

    resetCustomForm();
  }
  function resetCustomForm() {
    showCustomForm = false;
    customName = '';
    utxoRpcUrl = '';
    utxoRpcApiKey = '';
    miniBfUrl = '';
    miniBfApiKey = '';
    customType = 'dolos';
    customNetwork = 'custom';
  }

  function getProviderTypeColor(type: string) {
    switch (type) {
      case 'utxorpc':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'blockfrost':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-blue-100 text-gray-800 dark:bg-blue-900 dark:text-blue-300';
    }
  }

  function getNetworkColor(network: string) {
    switch (network) {
      case 'preprod':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'preview':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    }
  }

  // Reactive values
  let selectItems = $derived(
    $allProviders.map((p) => ({
      value: p.id,
      label: p.name
    }))
  );

  let selectedProviderId = $derived($currentProvider?.id || '');

  function viewTransactionsWithProvider(providerId: string) {
    goto(`/tx?provider=${providerId}`);
  }

  function removeCustomProvider(providerId: string) {
    if (confirm('Remove this custom provider?')) {
      providerStore.removeCustomProvider(providerId);
    }
  }

  function setCurrentProvider(provider: ProviderConfig) {
    providerStore.setCurrentProvider(provider);
  }
</script>

<div
  class={cn(
    'border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
    className
  )}
>
  <div class="container mx-auto px-4 pt-5 pb-3 ">
    <div class="flex items-center justify-between gap-4">
      <div class="flex items-end gap-3">
        <h3 class="text-3xl font-extrabold"> <a href="/">Alejandria Explorer</a></h3>
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-muted-foreground">Current Provider:</span>
          <Badge variant="outline" class={getProviderTypeColor($currentProvider?.type || '')}>
            {$currentProvider?.type?.toUpperCase() || 'N/A'}
          </Badge>
          <Badge variant="outline" class={getNetworkColor($currentProvider?.network || '')}>
            {$currentProvider?.network || 'unknown'}
          </Badge>
        </div>

        {#if $currentProvider}
          <div class="flex flex-col items-start gap-1 justify-start text-sm text-muted-foreground">
            {#if $currentProvider.isBuiltIn}
              <div>
                <span>•</span>
                <span>Built-in endpoint (configured server-side)</span>
              </div>
            {:else if $currentProvider.type === 'dolos'}
            <div>

              <span>•</span>
              <span class="max-w-xs truncate" title={$currentProvider.miniBfUrl}>
                Mini Blockfrost: {$currentProvider.miniBfUrl}
              </span>
            </div>
            <div>

              <span>•</span>
              <span class="max-w-xs truncate" title={$currentProvider.utxoRpcUrl}>
                UTxO RPC: {$currentProvider.utxoRpcUrl}
              </span>
            </div>
            {/if}
          </div>
        {/if}
      </div>

      <div class="flex items-center gap-2">
        <Select
          bind:value={selectedProviderId}
          onValueChange={handleProviderChange}
          items={selectItems}
          placeholder="Select provider..."
          subtitle="Select provider"
          class="min-w-48"
        />

        <Button variant="outline" size="sm" onclick={() => (showCustomForm = !showCustomForm)}>
          {showCustomForm ? 'Cancel' : 'Edit Providers List'}
        </Button>
      </div>
    </div>

    {#if showCustomForm}
      <Card class="mt-4">
        <CardHeader>
          <CardTitle class="text-lg">Add Custom Provider</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="space-y-2">
              <label for="custom-name" class="text-sm font-medium">Name</label>
              <Input id="custom-name" bind:value={customName} placeholder="My Custom Provider" />
            </div>

            <div class="space-y-2">
              <label for="blockfrost-url" class="text-sm font-medium">Blockfrost</label>
              <Input
                id="blockfrost-url"
                bind:value={miniBfUrl}
                placeholder="https://my-provider.com"
              />
              <label for="utxorpc-url" class="text-sm font-medium">UTxO RPC URL</label>
              <Input
                id="utxorpc-url"
                bind:value={utxoRpcUrl}
                placeholder="https://my-provider.com"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div class="space-y-2">
              <label for="custom-type" class="text-sm font-medium">Provider Type</label>
              <Select
                bind:value={customType}
                items={[
                  { value: 'dbsync', label: 'DB Sync' },
                  { value: 'dolos', label: 'Dolos' }
                ]}
                placeholder="Select type..."
              />
            </div>

            <div class="space-y-2">
              <label for="custom-network" class="text-sm font-medium">Network</label>
              <Select
                bind:value={customNetwork}
                items={[
                  { value: 'mainnet', label: 'Mainnet' },
                  { value: 'preprod', label: 'Preprod' },
                  { value: 'preview', label: 'Preview' },
                  { value: 'custom', label: 'Custom' }
                ]}
                placeholder="Select network..."
              />
            </div>

            <div class="space-y-2">
              <label for="utxorpc-api-key" class="text-sm font-medium"
                >UTxO RPC API Key (Optional)</label
              >
              <Input
                id="utxorpc-api-key"
                bind:value={utxoRpcApiKey}
                placeholder="Your API key"
                type="password"
              />
              <label for="minibf-api-key" class="text-sm font-medium">Mini bf</label>
              <Input
                id="minibf-api-key"
                bind:value={miniBfApiKey}
                placeholder="Your API key"
                type="password"
              />
            </div>
          </div>

          <div class="flex justify-end gap-2">
            <Button variant="outline" onclick={resetCustomForm}>Cancel</Button>
            <Button
              onclick={handleAddCustomProvider}
              disabled={!customName.trim() || !utxoRpcUrl.trim()}
            >
              Add Provider
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
                {#if provider.isBuiltIn}
                  <Badge variant="secondary" class="text-xs">Built-in</Badge>
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

              <p class="text-sm text-muted-foreground">
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

                {#if !provider.isBuiltIn}
                  <Button
                    size="sm"
                    variant="destructive"
                    onclick={() => removeCustomProvider(provider.id)}
                  >
                    Remove
                  </Button>
                {/if}

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
  </div>
</div>
