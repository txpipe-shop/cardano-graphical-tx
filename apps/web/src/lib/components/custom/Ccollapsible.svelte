<script lang="ts">
  import { quintInOut } from 'svelte/easing';
  import { fade } from 'svelte/transition';
  import { CardTitle } from '../ui/card';
  import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
  let { title, children, defaultOpen = false } = $props();
  let myOpen = $state(defaultOpen);
</script>

<Collapsible bind:open={() => myOpen, () => (myOpen = !myOpen)}>
  <CollapsibleTrigger class="flex w-full justify-between py-2 text-2xl">
    <CardTitle>{title}</CardTitle>
    <div class="font-bold">{myOpen ? '▼' : '◄'}</div>
  </CollapsibleTrigger>
  <CollapsibleContent class="space-y-2 pt-1 " forceMount>
    {#snippet child({ props, open })}
      {#if open}
        <div
          {...props}
          class="flex flex-col gap-2 border-l-4 border-dashed pl-4"
          transition:fade={{ duration: 250, easing: quintInOut }}
        >
          {@render children()}
        </div>
      {/if}
    {/snippet}
  </CollapsibleContent>
</Collapsible>
