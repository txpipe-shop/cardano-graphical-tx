<script lang="ts">
  import { Badge } from '@/components/ui/badge';
  import { Button } from '@/components/ui/button';
  import { Select } from '@/components/ui/select';
  import { allProviders, currentProvider, providerStore } from '@/stores/provider-store';
  import { cn } from '@/utils';
  import { getNetworkColor, getProviderTypeColor } from './color-utils';
  import ProvidersForm from './providers-form.svelte';

  interface Props { class?: string; }

  let { class: className }: Props = $props();

  let showCustomForm = $state(false);

  console.log($allProviders);
  function handleProviderChange(providerId: string) {
    const provider = $allProviders.find((p) => p.id === providerId);
    if (provider) providerStore.setCurrentProvider(provider);
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
            {#if !$currentProvider.isLocal}
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

    <ProvidersForm bind:showCustomForm />
  </div>
</div>
