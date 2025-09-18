<script lang="ts">
  import ProviderTopBar from '@/components/custom/providers/provider-top-bar.svelte';
  import { providerStore } from '@/stores/provider-store';
  import { onMount, type Snippet } from 'svelte';
  import '../app.css';

  interface Props {
    providers: import('@/types/provider-config').ProviderConfig[];
    children: Snippet;
  }

  let { providers, children }: Props = $props();
  console.log("LAYOUT, ", providers);
  onMount(() => {
    console.log("MOUNT, ", providers);
    providerStore.initializeWithServerData(providers);
  });
</script>

<div class="min-h-screen min-w-screen">
  <ProviderTopBar />
  <div class="py-5">
    {@render children()}
  </div>
</div>
