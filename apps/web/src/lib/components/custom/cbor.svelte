<script lang="ts">
    import * as cbor2 from "cbor2";
    import { onMount } from "svelte";
    import { Card, CardContent } from "../ui/card";

  let { cbor, error }: { cbor: string, error: string | undefined} = $props();
  let cborRaw = $derived(cbor);
  let cborDecoded = $state('');

  onMount(async () => {
    if (!cborRaw) {
      cborDecoded = '';
      return;
    }
    try {
      cborDecoded = cbor2.diagnose(cborRaw)
    } catch (error) {
      cborDecoded = `Diagnostic error: ${error instanceof Error ? error.message : "Unknown error"}`
    }
  });

</script>

<Card class="h-full">
  <CardContent class="grid grid-cols-1 gap-4 py-1 md:grid-cols-2 h-full">
    <div class="flex flex-col gap-2">
      <div class="font-medium">Decoded</div>
      <textarea
        class="h-96 w-full resize-none rounded-md border bg-background p-2 font-mono text-sm whitespace-pre-wrap break-all"
        bind:value={cborDecoded}
        disabled={true}
        placeholder="No decoded CBOR JSON"
      ></textarea>
    </div>
    <div class="flex flex-col gap-2">
      <div class="font-medium">CBOR</div>
      <textarea
        class="h-96 w-full resize-none rounded-md border bg-background p-2 font-mono text-sm"
        bind:value={cborRaw}
        placeholder={error ?? "CBOR not available" }
      ></textarea>
    </div>
  </CardContent>
</Card>