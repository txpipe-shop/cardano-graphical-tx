<script lang="ts">
  import { goto } from '$app/navigation';
  import { Card, CardContent } from '@/components/ui/card';
  import { currentProvider } from '@/stores/provider-store';

  $effect(() => {
    if ($currentProvider) {
      goto(`/tx?provider=${$currentProvider.id}`);
    }
  });
</script>

<div class="container mx-auto space-y-6 px-4 py-3">
  <div>
    <h1 class="mb-2 text-4xl font-extrabold text-center">Alejandria Explorer</h1>
    <p class="text-lg text-muted-foreground text-center">Multi-provider Cardano blockchain explorer</p>
  </div>
  {#if $currentProvider}
    <Card>
      <CardContent class="py-8 text-center">
        <div class="flex items-center justify-center gap-2">
          <div class="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
          <span class="text-muted-foreground">Loading data from provider...</span>
        </div>
      </CardContent>
    </Card>
  {:else}
    <div>
      Select a provider to see transactions!
    </div>
  {/if}


</div>
