<script lang="ts">
    import { quintInOut } from "svelte/easing";
    import { fade } from "svelte/transition";
    import { CardTitle } from "../ui/card";
    import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
    let {title, children, defaultOpen = false} = $props();
    let myOpen = $state(defaultOpen);

</script>

<Collapsible bind:open={() => myOpen, () => myOpen = !myOpen}>
  <CollapsibleTrigger class="flex justify-between w-full text-2xl py-2">
    <CardTitle>{title}</CardTitle>
    <div class="font-bold">{myOpen ? "▼" : "◄"}</div>
  </CollapsibleTrigger>
  <CollapsibleContent class="space-y-2 pt-1 " forceMount>

    {#snippet child({ props, open })}
      {#if open}
        <div {...props} class="border-dashed border-l-4 pl-4 flex flex-col gap-2"
          transition:fade={{ duration: 250, easing: quintInOut }}>
          {@render children()}
        </div>
      {/if}
    {/snippet}
  </CollapsibleContent>
</Collapsible>