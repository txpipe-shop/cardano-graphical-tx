<script lang="ts">
    import { CardContent } from "../ui/card";
    import Card from "../ui/card/card.svelte";

  const { title, content, bg = "green"} = $props();

</script>

<Card class={`rounded-xl border border-black py-3 text-card-foreground shadow-sm mx-3 ${bg}`}>
  <CardContent>
    <div class="text-xs font-bold mb-2">
      {title}
    </div>
    <div class="text-lg">
      {content}
    </div>
  </CardContent>
</Card>