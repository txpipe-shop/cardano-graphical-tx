<script lang="ts">
  import ProviderTopBar from '@/components/custom/provider-top-bar.svelte';
  import { providerStore } from '@/stores/provider-store';
  import { onMount, type Snippet } from 'svelte';
  import '../app.css';

  interface Props {
    data: {
      providers: import('@/types/provider-config').ProviderConfig[];
    };
    children: Snippet;
  }

  let { data, children }: Props = $props();

  onMount(() => {
    providerStore.initializeWithServerData(data.providers);
  });
</script>

<div class="min-h-screen min-w-screen">
  <ProviderTopBar />
  <div class="py-5">
    {@render children()}
  </div>
</div>
