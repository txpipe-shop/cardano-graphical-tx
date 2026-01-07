<script lang="ts">
  import ProviderTopBar from '@/components/custom/providers/provider-top-bar.svelte';
  import { providerStore } from '@/stores/provider-store';
  import { onMount, type Snippet } from 'svelte';
  import '../app.css';
  import type { ProviderConfig } from '@/providers/types';

  interface Props {
    data: { providers: ProviderConfig[] };
    children: Snippet;
  }

  let { data, children }: Props = $props();
  onMount(() => {
    providerStore.initializeWithServerData(data.providers);
  });
</script>

<div class="min-w-screen min-h-screen">
  <ProviderTopBar />
  <div class="py-5">
    {@render children()}
  </div>
</div>
