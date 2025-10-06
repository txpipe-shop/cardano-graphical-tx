<script lang="ts">
    import { formatAddress, getAssetName } from "@/components/primitive-utils";
    import { Badge } from "@/components/ui/badge";
    import { Unit, type Value } from "@/types/utxo-model";

    let { list, mints } = $props();

  function getBadgeColor(assetId: string, mintedAssets: Value | undefined): string {
    if (mintedAssets && assetId in mintedAssets && mintedAssets[Unit(assetId)] > 0n) {
      return 'bg-green-800';
    } else if (mintedAssets && assetId in mintedAssets && mintedAssets[Unit(assetId)] < 0n) {
      return 'bg-red-800';
    }
    return '';
  }

</script>


<div>
  {#each list as utxo, i}
    {#if i !== 0}
    <hr class="w-full border-white">
    {/if}
    <div class={"flex items-center gap-2 " + (i !== 0 ? "my-2" : "mb-2")}>
      <Badge variant="secondary">
        {Number(utxo.coin) / 1000000} ₳
      </Badge>
      <div class="flex items-center">
        {formatAddress(utxo.address, false).slice(0, 15) + '...' + formatAddress(utxo.address, false).slice(-15, -6)}
        <div class="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-orange-500 font-extrabold">
          {formatAddress(utxo.address, false).slice(-5)}
        </div>
      </div>
    </div>
    {#if Object.entries(utxo.value).length > 0}
      <div class="flex w-full gap-1 flex-wrap my-2">
        {#each Object.entries(utxo.value) as [k, v]}
        <Badge variant="outline" class={getBadgeColor(k, mints) + "text-black dark:text-white"}>
          <div class="dark:text-white font-extrabold text-yellow-950">{getAssetName(k)}</div>: {v}
        </Badge>
        <br/>
        {/each}
      </div>
    {/if}
  {/each}
</div>