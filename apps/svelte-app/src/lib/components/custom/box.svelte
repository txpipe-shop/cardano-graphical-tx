<script lang="ts">
  import { CardContent } from '../ui/card';
  import Card from '../ui/card/card.svelte';

  const { title, content, bg = 'green' } = $props();
</script>

<Card class={`text-card-foreground mx-3 rounded-xl border border-black py-3 shadow-sm ${bg}`}>
  <CardContent>
    <div class="mb-2 text-xs font-bold">
      {title}
    </div>
    <div class="whitespace-pre-wrap break-all text-lg">
      {content}
    </div>
  </CardContent>
</Card>
