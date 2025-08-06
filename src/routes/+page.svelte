<script lang="ts">
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
  import { Badge } from '@/components/ui/badge';
  import { Button } from '@/components/ui/button';
  import { currentProvider, allProviders } from '@/stores/provider-store';
  import { goto } from '$app/navigation';

  function viewTransactionsWithProvider(providerId: string) {
    goto(`/tx?provider=${providerId}`);
  }

  function viewBlocksWithProvider(providerId: string) {
    goto(`/block?provider=${providerId}`);
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
    <h1 class="mb-2 text-4xl font-extrabold">Alejandria Explorer</h1>
    <p class="text-lg text-muted-foreground">Multi-provider Cardano blockchain explorer</p>
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

  <Card>
    <CardHeader>
      <CardTitle>How to Use</CardTitle>
    </CardHeader>
    <CardContent class="space-y-4">
      <div>
        <h4 class="mb-2 font-medium">Top Bar Provider Selection</h4>
        <p class="text-sm text-muted-foreground">
          Use the top bar to select different data providers. The selection applies globally and
          will be used for subsequent page loads that support provider switching.
        </p>
      </div>

      <div>
        <h4 class="mb-2 font-medium">Custom Providers</h4>
        <p class="text-sm text-muted-foreground">
          Click "Add Custom" in the top bar to configure your own provider endpoints. This is useful
          for connecting to local development networks or custom API endpoints.
        </p>
      </div>

      <div>
        <h4 class="mb-2 font-medium">Built-in Providers</h4>
        <ul class="space-y-1 text-sm text-muted-foreground">
          <li>• <strong>Preprod</strong> - Cardano preprod testnet via UTxORPC</li>
          <li>• <strong>Preview</strong> - Cardano preview testnet via Blockfrost</li>
          <li>• <strong>Mainnet</strong> - Cardano mainnet via UTxORPC</li>
          <li>• <strong>Vector/Prime</strong> - Custom testnet environments</li>
        </ul>
      </div>
    </CardContent>
  </Card>
</div>
