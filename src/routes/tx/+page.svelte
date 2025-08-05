<script lang="ts">
  import TxTable from '$lib/components/tx-table.svelte';

  export let data;
  //const exampleTxs = [
  //  {
  //    date: '2025-08-01 16:00',
  //    hash: 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  //    epochBlock: '428 / 123456',
  //    totalOutput: '10.5 ADA',
  //    fee: '0.17 ADA',
  //    size: '512 B',
  //    scriptSize: '128 B',
  //    mintsBurns: '+2 NFT'
  //  },
  //  {
  //    date: '2025-08-01 15:59',
  //    hash: 'ffabbeef00112233445566778899aabbccddeeff00112233445566778899aabb',
  //    epochBlock: '428 / 123455',
  //    totalOutput: '250 ADA',
  //    fee: '0.2 ADA',
  //    size: '630 B',
  //    scriptSize: '0 B',
  //    mintsBurns: '—'
  //  }
  //];
</script>

<h1 class="text-4xl font-extrabold">Transactions</h1>
<TxTable txs={data.txs} />
