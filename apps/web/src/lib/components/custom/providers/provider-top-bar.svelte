<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { Badge } from '@/components/ui/badge';
  import { Button } from '@/components/ui/button';
  import { Select } from '@/components/ui/select';
  import TxPipeShop from '@/images/txpipe_shop.png';
  import { allProviders, currentProvider, providerStore } from '@/stores/provider-store';
  import { cn } from '@/utils';
  import { onMount } from 'svelte';
  import { getNetworkColor, getProviderTypeColor } from './color-utils';
  import ProvidersForm from './providers-form.svelte';

  let theme = $state<'light' | 'dark'>('light');

  onMount(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') {
      theme = stored;
    } else {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    applyTheme();
  });

  $effect(() => {
    applyTheme();
    localStorage.setItem('theme', theme);
  });

  function applyTheme() {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }

  function toggleTheme() {
    theme = theme === 'light' ? 'dark' : 'light';
  }

  interface Props {
    class?: string;
  }

  let { class: className }: Props = $props();

  let showCustomForm = $state(false);

  async function handleProviderChange(providerId: string) {
    const provider = $allProviders.find((p) => p.id === providerId);
    if (provider) providerStore.setCurrentProvider(provider);
    let currentPathname = $page.url.pathname;
    await goto(currentPathname + '?provider=' + providerId);
  }

  // Reactive values
  let selectItems = $derived($allProviders.map((p) => ({ value: p.id, label: p.name })));

  let selectedProviderId = $derived($currentProvider?.id || '');
</script>

<div
  class={cn(
    'bg-background/95 supports-[backdrop-filter]:bg-background/60 border-b backdrop-blur',
    className
  )}
>
  <div class="container mx-auto px-4 pb-3 pt-5">
    <div class="flex items-center justify-between gap-3">
      <div class="flex gap-3">
        <img src={TxPipeShop} alt="TxPipe Shop" class="h-12 w-12 rounded-md" />
        <h3 class="text-3xl font-extrabold"><a href="/">Alejandria Explorer</a></h3>
      </div>
      <div class="flex gap-3">
        <div class="flex flex-col items-end justify-end gap-1">
          <div class="flex items-end justify-end gap-1">
            <span class="text-muted-foreground text-sm font-medium">Current Provider:</span>
            <Badge variant="outline" class={getProviderTypeColor($currentProvider?.type || '')}>
              {$currentProvider?.type?.toUpperCase() || 'N/A'}
            </Badge>
            <Badge variant="outline" class={getNetworkColor($currentProvider?.network || '')}>
              {$currentProvider?.network || 'unknown'}
            </Badge>
          </div>

          {#if $currentProvider}
            <div class="text-muted-foreground flex items-start justify-start gap-2 text-sm">
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

          <Button class="bg-gray-800 px-4 py-2 dark:text-gray-200 " onclick={toggleTheme}>
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </Button>
        </div>
      </div>
    </div>
    <ProvidersForm bind:showCustomForm />
  </div>
</div>
