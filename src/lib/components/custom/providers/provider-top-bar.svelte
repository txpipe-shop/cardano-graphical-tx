<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { Badge } from '@/components/ui/badge';
  import { Button } from '@/components/ui/button';
  import { Select } from '@/components/ui/select';
  import TxPipeShop from "@/images/txpipe_shop.png";
  import { allProviders, currentProvider, providerStore } from '@/stores/provider-store';
  import { cn } from '@/utils';
  import { getNetworkColor, getProviderTypeColor } from './color-utils';
  import ProvidersForm from './providers-form.svelte';

  interface Props { class?: string; }

  let { class: className }: Props = $props();

  let showCustomForm = $state(false);

  async function handleProviderChange(providerId: string) {
    const provider = $allProviders.find((p) => p.id === providerId);
    if (provider) providerStore.setCurrentProvider(provider);
    let currentPathname = $page.url.pathname;
    await goto(currentPathname + "?provider=" + providerId);
  }

  // Reactive values
  let selectItems = $derived(
    $allProviders.map((p) => ({ value: p.id, label: p.name }))
  );

  let selectedProviderId = $derived($currentProvider?.id || '');
</script>

<div
  class={cn(
    'border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
    className
  )}
>
  <div class="container mx-auto px-4 pt-5 pb-3 ">
    <div class="flex items-center justify-between gap-3">
      <div class="flex gap-3">
        <img src={TxPipeShop} alt="TxPipe Shop" class="h-12 w-12 rounded-md"/>
        <h3 class="text-3xl font-extrabold"> <a href="/">Alejandria Explorer</a></h3>
      </div>
      <div class="flex gap-3">
        <div class="flex items-end justify-end flex-col gap-1">
          <div class="flex items-end justify-end gap-1">
            <span class="text-sm font-medium text-muted-foreground">Current Provider:</span>
            <Badge variant="outline" class={getProviderTypeColor($currentProvider?.type || '')}>
              {$currentProvider?.type?.toUpperCase() || 'N/A'}
            </Badge>
            <Badge variant="outline" class={getNetworkColor($currentProvider?.network || '')}>
              {$currentProvider?.network || 'unknown'}
            </Badge>
          </div>

          {#if $currentProvider}
            <div class="flex items-start gap-2 justify-start text-sm text-muted-foreground">
              {#if !$currentProvider.isLocal}
                <span>Built-in endpoint</span>
              {:else if $currentProvider.type === 'dolos'}
                <span class="max-w-xs truncate" title={$currentProvider.miniBfUrl}>
                  Mini Blockfrost: {$currentProvider.miniBfUrl}
                </span>
                <span class="max-w-xs truncate" title={$currentProvider.utxoRpcUrl}>
                  • UTxO RPC: {$currentProvider.utxoRpcUrl}
                </span>
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
            {showCustomForm ? 'Cancel' : 'Edit Local Provider'}
          </Button>
        </div>
      </div>
    </div>
    <ProvidersForm bind:showCustomForm />
  </div>
</div>
