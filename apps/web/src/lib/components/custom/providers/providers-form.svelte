<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from '$app/stores';
    import { allProviders, currentProvider, providerStore } from "@/stores/provider-store";
    import { LOCAL_PROVIDER_ID, type Network, type ProviderConfig } from '@/types/provider-config';
    import { Badge } from "../../ui/badge";
    import { Button } from "../../ui/button";
    import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
    import { Input } from "../../ui/input";
    import { Select } from "../../ui/select";
    import { getNetworkColor, getProviderTypeColor } from "./color-utils";


  let { showCustomForm = $bindable() } = $props()

  let utxoRpcUrl = $derived($allProviders.find(p => p.id === LOCAL_PROVIDER_ID)?.utxoRpcUrl || "");
  let miniBfUrl = $derived($allProviders.find(p => p.id === LOCAL_PROVIDER_ID)?.miniBfUrl || "");

  let customNetwork = $state<Network>('custom');

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
    if (
      !customNetwork ||
      !utxoRpcUrl.trim() ||
      !miniBfUrl.trim()
    ) {
      console.log('Invalid custom provider data');
      return;
    }

    provider = {
      id: LOCAL_PROVIDER_ID,
      description: 'UTxORPC + MiniBlockfrost services for Cardano Local testnet. Not realiable for older queries',
      isLocal: true,
      name: "Local (Dolos)",
      network: customNetwork,
      type: 'dolos',
      utxoRpcUrl: utxoRpcUrl.trim(),
      miniBfUrl: miniBfUrl.trim(),
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
      <div class="space-y-2 w-full">
        <label for="blockfrost-url" class="text-sm font-medium">Mini Blockfrost URL</label>
        <Input
          id="blockfrost-url"
          bind:value={miniBfUrl}
        />
      </div>
      <div class="space-y-2 w-full">
        <label for="utxorpc-url" class="text-sm font-medium">UTxO RPC URL</label>
        <Input
          id="utxorpc-url"
          bind:value={utxoRpcUrl}
        />
      </div>
      <div class="space-y-2">
        <label for="custom-network" class="text-sm font-medium">Network</label>
        <Select
        items={[
          // { value: 'mainnet', label: 'Mainnet' },
          { value: 'preprod', label: 'Preprod' },
          { value: 'preview', label: 'Preview' },
          // { value: 'custom', label: 'Custom' }
        ]}
        bind:value={customNetwork}

        />
      </div>
    </div>

    <div class="flex justify-end gap-2">
      <Button variant="outline" onclick={resetCustomForm}>Cancel</Button>
      <Button
        onclick={handleEditLocalProvider}
        disabled={!miniBfUrl.trim() || !utxoRpcUrl.trim() || !customNetwork}
      >
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
              {#if provider.isLocal}
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