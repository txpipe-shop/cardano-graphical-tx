<script lang="ts">
  import { goto } from '$app/navigation';
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
  <div>
    Select a provider to see transactions!
  </div>


</div>
