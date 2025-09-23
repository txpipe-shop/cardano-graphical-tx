<script lang="ts">
    import { formatDate } from "@/components/primitive-utils";
    import { Badge } from "@/components/ui/badge";
    import { TableCell, TableRow } from "@/components/ui/table";
    import type { CardanoTx } from "@/types";

    let { tx } : {tx: CardanoTx} = $props();

</script>

<TableRow class="w-full bg-[#29294f]">
  <TableCell>
    <div class="flex items-center gap-1">
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-hash fsmall">
        <line x1="4" y1="9" x2="20" y2="9"></line>
        <line x1="4" y1="15" x2="20" y2="15"></line>
        <line x1="10" y1="3" x2="8" y2="21">
        </line><line x1="16" y1="3" x2="14" y2="21"></line>
      </svg>
      <a class="text-blue-600 hover:underline" href={'/tx/' + tx.hash}>{tx.hash}</a>
    </div>
  </TableCell>
  <TableCell>
    <div class="flex items-center gap-1">
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-clock fsmall">
        <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
      </svg>
      {formatDate(tx.createdAt)}
    </div>
  </TableCell>
  <TableCell> Fee: {Number(tx.fee) / 1000000} ₳</TableCell>
  <TableCell>
    <div class="flex items-center justify-center gap-1">
      {#if tx.witnesses && tx.witnesses.scripts && tx.witnesses.scripts?.length > 0}
        {#if tx.witnesses.scripts.some(s => s.type === 'native')}
        <Badge variant="outline" class="text-bold bg-yellow-400 text-black">
          Native Script
        </Badge>
        {:else if tx.witnesses.scripts.some(s => s.type === 'plutusV1')}
        <Badge variant="outline" class="text-bold bg-purple-600">
          Plutus V1
        </Badge>
        {:else if tx.witnesses.scripts.some(s => s.type === 'plutusV2')}
        <Badge variant="outline" class="text-bold bg-purple-800">
          Plutus V2
        </Badge>
        {:else if tx.witnesses.scripts.some(s => s.type === 'plutusV3')}
        <Badge variant="outline" class="text-bold bg-gray-600">
          Plutus V3
        </Badge>
        {/if}
      {/if}
    </div>
  </TableCell>
</TableRow>