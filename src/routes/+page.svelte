<script lang="ts">
  import { goto } from '$app/navigation';
  import { Badge } from '@/components/ui/badge';
  import { Button } from '@/components/ui/button';
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
  import { allProviders, currentProvider, providerStore } from '@/stores/provider-store';
  import type { ProviderConfig } from '@/types/provider-config';

  function viewTransactionsWithProvider(providerId: string) {
    goto(`/tx?provider=${providerId}`);
  }

  function viewBlocksWithProvider(providerId: string) {
    goto(`/block?provider=${providerId}`);
  }

  function removeCustomProvider(providerId: string) {
    if (confirm('Remove this custom provider?')) {
      providerStore.removeCustomProvider(providerId);
    }
  }

  function setCurrentProvider(provider: ProviderConfig) {
    providerStore.setCurrentProvider(provider);
  }

  function getProviderTypeColor(type: string) {
    switch (type) {
      case 'utxorpc':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'blockfrost':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'dbsync':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  }

  function getNetworkColor(network: string) {
    switch (network) {
      case 'mainnet':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'preprod':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'preview':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  }
</script>

<div class="container mx-auto space-y-6 px-4 py-3">
  <div>
    <h1 class="mb-2 text-4xl font-extrabold text-center">Alejandria Explorer</h1>
    <p class="text-lg text-muted-foreground text-center">Multi-provider Cardano blockchain explorer</p>
  </div>

  <Card>
    <CardHeader>
      <CardTitle>Current Provider</CardTitle>
    </CardHeader>
    <CardContent>
      {#if $currentProvider}
        <div class="mb-4 flex items-center gap-3">
          <h3 class="text-lg font-semibold">{$currentProvider.name}</h3>
          <Badge class={getProviderTypeColor($currentProvider.type)}>
            {$currentProvider.type.toUpperCase()}
          </Badge>
          <Badge class={getNetworkColor($currentProvider.network)}>
            {$currentProvider.network}
          </Badge>
        </div>
        <p class="mb-4 text-sm text-muted-foreground">
          {$currentProvider.description}
        </p>
        <div class="flex gap-2">
          <Button onclick={() => viewTransactionsWithProvider($currentProvider.id)}>
            View Transactions
          </Button>
          <Button variant="outline" onclick={() => viewBlocksWithProvider($currentProvider.id)}>
            View Blocks
          </Button>
        </div>
      {:else}
        <p class="text-muted-foreground">No provider selected</p>
      {/if}
    </CardContent>
  </Card>

  <Card>
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
                <Button
                  size="sm"
                  variant="outline"
                  onclick={() => viewBlocksWithProvider(provider.id)}
                >
                  Blocks
                </Button>
              </div>
            </div>
          </Card>
        {/each}
      </div>
    </CardContent>
  </Card>
</div>
