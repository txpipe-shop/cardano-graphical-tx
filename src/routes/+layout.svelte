<script lang="ts">
  import '../app.css';
  import ProviderTopBar from '@/components/provider-top-bar.svelte';
  import { providerStore } from '@/stores/provider-store';
  import { onMount, type Snippet } from 'svelte';

  interface Props {
    data: {
      providers: import('@/types/provider-config').ProviderConfig[];
      defaultProvider: import('@/types/provider-config').ProviderConfig;
    };
    children: Snippet;
  }

  let { data, children }: Props = $props();

  onMount(() => {
    providerStore.initializeWithServerData(data.providers, data.defaultProvider);
  });
</script>

<div class="min-h-screen min-w-screen">
  <ProviderTopBar />
  <div class="p-5">
    {@render children()}
  </div>
</div>
