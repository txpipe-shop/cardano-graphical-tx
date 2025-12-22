<script lang="ts">
  import { type CardanoTx, type Metadata, DatumType } from '@alexandria/types';
  import { formatAddress, getAssetName } from '../primitive-utils';
  import Box from './box.svelte';
  import Ccollapsible from './Ccollapsible.svelte';
  let { tx }: { tx: CardanoTx } = $props();

  function parseValues(
    value: Record<string, bigint>
  ): { policy: string; values: Record<string, bigint> }[] {
    const parsed: { policy: string; values: Record<string, bigint> }[] = [];
    for (const [key, amount] of Object.entries(value)) {
      const policy = key.slice(0, 56);
      const assetName = getAssetName(key);
      let policyEntry = parsed.find((p) => p.policy === policy);
      if (!policyEntry) {
        policyEntry = { policy, values: {} };
        parsed.push(policyEntry);
      }
      policyEntry.values[assetName] = amount;
    }
    return parsed;
  }
</script>

<Ccollapsible title={'DISSECTED INFORMATION'}>
  <Box title={'Tx Hash'} content={tx.hash} />
  <Box title={'Fee'} content={tx.fee} />
</Ccollapsible>

<Ccollapsible title={'INPUTS'}>
  {#each tx.inputs as input, i}
    <Ccollapsible title={`Input ${i + 1}`}>
      <Box title="UtxoRef Hash" content={`${input.outRef.hash}#${input.outRef.index}`} />
      <Box title="Address" content={`${formatAddress(input.address, false)}`} />
      <Box title="Lovelace" content={input.coin ? `${input.coin}` : '-'} />
      {#if Object.keys(input.value).length > 0}
        <Ccollapsible title={`Values`}>
          {#each parseValues(input.value) as value}
            <Ccollapsible title={`Policy: ${value.policy}`}>
              {#each Object.entries(value.values) as [assetName, amount]}
                <Box title={`Asset Name: Amount`} content={`${assetName}: ${amount}`} />
              {/each}
            </Ccollapsible>
          {/each}
        </Ccollapsible>
      {/if}
    </Ccollapsible>
  {/each}
</Ccollapsible>

<Ccollapsible title={'OUTPUTS'}>
  {#each tx.outputs as output, i}
    <Ccollapsible title={`Output ${i + 1}`}>
      <Box title="UtxoRef Hash" content={`${output.outRef.hash}#${output.outRef.index}`} />
      <Box title="Address" content={`${formatAddress(output.address, false)}`} />
      <Box title="Lovelace" content={`${output.coin}`} />
      {#if output.datum && output.datum.type === DatumType.HASH}
        <Box title="Datum Hash" content={`${output.datum.datumHashHex}`} />
      {/if}
      {#if output.datum && output.datum.type === DatumType.INLINE}
        <Box title="Inline Datum" content={`${output.datum.datumHex}`} />
      {/if}
      {#if output.consumedBy}
        <Box title="Consumed By" content={`${output.consumedBy}`} />
      {/if}
      {#if parseValues(output.value).length > 0}
        <Ccollapsible title={`Values`}>
          {#each parseValues(output.value) as value}
            <Ccollapsible title={`Policy: ${value.policy}`}>
              {#each Object.entries(value.values) as [assetName, amount]}
                <Box title={`Asset Name: Amount`} content={`${assetName}: ${amount}`} />
              {/each}
            </Ccollapsible>
          {/each}
        </Ccollapsible>
      {/if}
    </Ccollapsible>
  {/each}
</Ccollapsible>

{#if tx.referenceInputs.length > 0}
  <Ccollapsible title="REFERENCE INPUTS">
    {#each tx.referenceInputs as refInput, i}
      <Ccollapsible title={`Reference Input ${i + 1}`}>
        <Box title="UtxoRef Hash" content={`${refInput.outRef.hash}#${refInput.outRef.index}`} />
        <Box title="Address" content={`${formatAddress(refInput.address, false)}`} />
        <Box title="Lovelace" content={`${refInput.coin}`} />
        {#if refInput.datum && refInput.datum.type === DatumType.HASH}
          <Box title="Datum Hash" content={`${refInput.datum.datumHashHex}`} />
        {/if}
        {#if refInput.datum && refInput.datum.type === DatumType.INLINE}
          <Box title="Inline Datum" content={`${refInput.datum.datumHex}`} />
        {/if}
        {#if Object.keys(refInput.value).length > 0}
          <Ccollapsible title={`Values`}>
            {#each parseValues(refInput.value) as value}
              <Ccollapsible title={`Policy: ${value.policy}`}>
                {#each Object.entries(value.values) as [assetName, amount]}
                  <Box title={`Asset Name: Amount`} content={`${assetName}: ${amount}`} />
                {/each}
              </Ccollapsible>
            {/each}
          </Ccollapsible>
        {/if}
      </Ccollapsible>
    {/each}
  </Ccollapsible>
{/if}

{#if Object.keys(tx.mint).length > 0}
  <Ccollapsible title="MINTS AND BURNS">
    {#each parseValues(tx.mint) as value}
      <Ccollapsible title={`Policy: ${value.policy}`}>
        {#each Object.entries(value.values) as [assetName, amount]}
          <Box
            title={`Asset Name: Amount`}
            content={`${assetName}: ${amount}`}
            bg={amount > 0 ? 'bg-green-900' : 'bg-red-900'}
          />
        {/each}
      </Ccollapsible>
    {/each}
  </Ccollapsible>
{/if}

{#if tx.metadata}
  <Ccollapsible title="METADATA">
    {#each tx.metadata as Metadata as metadata}
      {#if typeof metadata === 'bigint' || typeof metadata === 'string'}
        <Box title={`Metadata`} content={`${metadata}`} />
      {:else if typeof metadata === 'object' && metadata !== null}
        {#each Object.entries(metadata) as [key, value]}
          <Box title={`Metadata Key`} content={`${key}`} />
          <Box title={`Metadata Value`} content={`${value}`} />
        {/each}
      {/if}
    {/each}
  </Ccollapsible>
{/if}
