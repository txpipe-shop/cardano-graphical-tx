<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
	import { Badge } from '@/components/ui/badge';
	import { Button } from '@/components/ui/button';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table/index';
	import type { CardanoTx } from '@/types';
	import type { ProviderConfig } from '@/types/provider-config';
	import { createProviderClient } from '@/client/provider-loader';
	import { builtInProviders, currentProvider } from '@/stores/provider-store';

	interface Props {
		data: {
			tx: CardanoTx | null;
			isServerLoaded: boolean;
			error?: string;
		};
	}

	let { data }: Props = $props();

	let provider = $currentProvider ? $currentProvider : $builtInProviders[0];

	// client states
	let clientTx = $state<CardanoTx | null>(null);
	let clientLoading = $state(false);
	let clientError = $state<string | null>(null);

	// Tabs
	type TabKey = 'diagram' | 'io' | 'cbor' | 'scripts' | 'refInputs';
	let activeTab = $state<TabKey>('diagram');

	// CBOR editors (non-functional placeholders)
	let cborRaw = $state('');
	let cborDecoded = $state('');

	function reloadWithProvider(providerId: string) {
		const url = new URL($page.url);
		url.searchParams.set('provider', providerId);
		goto(url.toString());
	}

	function refreshData() {
		if ($currentProvider) reloadWithProvider($currentProvider.id);
	}

	onMount(async () => {
		if (!data.isServerLoaded && $currentProvider && !$currentProvider.isBuiltIn) {
			clientLoading = true;
			clientError = null;
			try {
				await loadCustomProviderData($currentProvider);
			} catch (err) {
				clientError = err instanceof Error ? err.message : 'Unknown error loading tx';
			} finally {
				clientLoading = false;
			}
		}
	});

		async function loadCustomProviderData(provider: ProviderConfig) {
		const client = createProviderClient(provider);
			const hash = $page.params.hash as unknown as import('@/types/utxo-model').Hash;
			const tx = await client.getTx({ hash });
		clientTx = tx;
	}

	const displayTx = $derived(data.isServerLoaded ? data.tx : clientTx);

	function formatDate(s?: number) {
		if (!s) return '-';
		try {
			return new Date(s * 1000).toLocaleString();
		} catch {
			return '-';
		}
	}
</script>

<div class="container mx-auto space-y-6 px-4 py-3">
	<div class="flex items-center justify-between">
		<h1 class="text-3xl font-extrabold">Transaction</h1>
		<Button variant="outline" onclick={refreshData}>Refresh with Current Provider</Button>
	</div>

	<Card>
		<CardHeader>
			<CardTitle class="flex flex-wrap items-center gap-2">
				<span class="truncate">{$page.params.hash}</span>
				<Badge variant="secondary">{provider.type.toUpperCase()}</Badge>
				<Badge variant="outline">{provider.network}</Badge>
				{#if data.isServerLoaded}
					<Badge variant="default">Server-side</Badge>
				{:else}
					<Badge variant="outline">Client-side</Badge>
				{/if}
			</CardTitle>
		</CardHeader>
		<CardContent class="space-y-2">
			{#if data.error}
				<div class="text-sm text-red-600">{data.error}</div>
			{/if}
			{#if clientError}
				<div class="text-sm text-red-600">Client error: {clientError}</div>
			{/if}
			<div class="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
				<div><span class="font-medium">Created:</span> {formatDate(displayTx?.createdAt)}</div>
				<div><span class="font-medium">Fee:</span> {displayTx ? displayTx.fee.toString() : '-'}</div>
				<div><span class="font-medium">Inputs:</span> {displayTx?.inputs.length ?? '-'}</div>
				<div><span class="font-medium">Outputs:</span> {displayTx?.outputs.length ?? '-'}</div>
				<div><span class="font-medium">Reference Inputs:</span> {displayTx?.referenceInputs.length ?? '-'}</div>
				<div><span class="font-medium">Minted/Burned Assets:</span> {displayTx ? Object.keys(displayTx.mint).length : '-'}</div>
			</div>
		</CardContent>
	</Card>

	{#if clientLoading}
		<Card>
			<CardContent class="py-8 text-center">
				<div class="flex items-center justify-center gap-2">
					<div class="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
					<span class="text-muted-foreground">Loading transaction from custom provider...</span>
				</div>
			</CardContent>
		</Card>
	{:else if displayTx}
		<!-- Tabs header -->
		<div class="flex gap-2 border-b pb-2">
			<Button size="sm" variant={activeTab === 'diagram' ? 'default' : 'outline'} onclick={() => (activeTab = 'diagram')}>Diagram</Button>
			<Button size="sm" variant={activeTab === 'io' ? 'default' : 'outline'} onclick={() => (activeTab = 'io')}>Inputs / Outputs</Button>
			<Button size="sm" variant={activeTab === 'cbor' ? 'default' : 'outline'} onclick={() => (activeTab = 'cbor')}>CBOR</Button>
			<Button size="sm" variant={activeTab === 'scripts' ? 'default' : 'outline'} onclick={() => (activeTab = 'scripts')}>Scripts</Button>
			<Button size="sm" variant={activeTab === 'refInputs' ? 'default' : 'outline'} onclick={() => (activeTab = 'refInputs')}>Referenced Inputs</Button>
		</div>

		<!-- Diagram Tab -->
		{#if activeTab === 'diagram'}
			<Card>
				<CardContent class="py-6">
					<div class="h-64 w-full rounded-md bg-green-500"></div>
				</CardContent>
			</Card>
		{/if}

		<!-- Inputs / Outputs Tab -->
		{#if activeTab === 'io'}
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<Card>
					<CardHeader><CardTitle class="text-lg">Inputs ({displayTx.inputs.length})</CardTitle></CardHeader>
					<CardContent class="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>TxOut Ref</TableHead>
									<TableHead>Address</TableHead>
									<TableHead>Coin</TableHead>
									<TableHead>Datum</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{#each displayTx.inputs as i}
									<TableRow>
										<TableCell class="font-mono text-xs">{i.outRef.hash}:{i.outRef.index.toString()}</TableCell>
										<TableCell class="font-mono text-xs truncate max-w-[260px]">{i.address}</TableCell>
										<TableCell>{i.coin.toString()}</TableCell>
										<TableCell>{i.datum ? 'Yes' : '-'}</TableCell>
									</TableRow>
								{/each}
							</TableBody>
						</Table>
					</CardContent>
				</Card>

				<Card>
					<CardHeader><CardTitle class="text-lg">Outputs ({displayTx.outputs.length})</CardTitle></CardHeader>
					<CardContent class="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>TxOut Ref</TableHead>
									<TableHead>Address</TableHead>
									<TableHead>Coin</TableHead>
									<TableHead>Datum</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{#each displayTx.outputs as o}
									<TableRow>
										<TableCell class="font-mono text-xs">{o.outRef.hash}:{o.outRef.index.toString()}</TableCell>
										<TableCell class="font-mono text-xs truncate max-w-[260px]">{o.address}</TableCell>
										<TableCell>{o.coin.toString()}</TableCell>
										<TableCell>{o.datum ? 'Yes' : '-'}</TableCell>
									</TableRow>
								{/each}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>
		{/if}

		<!-- CBOR Tab -->
		{#if activeTab === 'cbor'}
			<Card>
				<CardContent class="grid grid-cols-1 gap-4 py-6 md:grid-cols-2">
					<div class="flex flex-col gap-2">
						<label class="text-sm font-medium">CBOR</label>
						<textarea class="h-64 w-full resize-none rounded-md border bg-background p-2 font-mono text-xs" bind:value={cborRaw} placeholder="Paste raw CBOR here"></textarea>
					</div>
					<div class="flex flex-col gap-2">
						<label class="text-sm font-medium">Decoded</label>
						<textarea class="h-64 w-full resize-none rounded-md border bg-background p-2 font-mono text-xs" bind:value={cborDecoded} placeholder="Decoded CBOR JSON"></textarea>
					</div>
				</CardContent>
			</Card>
		{/if}

		<!-- Scripts Tab -->
		{#if activeTab === 'scripts'}
			<Card>
				<CardHeader><CardTitle class="text-lg">Scripts</CardTitle></CardHeader>
				<CardContent class="py-4 text-sm text-muted-foreground">No scripts to display yet.</CardContent>
			</Card>
		{/if}

		<!-- Referenced Inputs Tab -->
		{#if activeTab === 'refInputs'}
			<Card>
				<CardHeader><CardTitle class="text-lg">Referenced Inputs ({displayTx.referenceInputs.length})</CardTitle></CardHeader>
				<CardContent class="overflow-x-auto">
					{#if displayTx.referenceInputs.length === 0}
						<div class="py-4 text-sm text-muted-foreground">No referenced inputs.</div>
					{:else}
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>TxOut Ref</TableHead>
									<TableHead>Address</TableHead>
									<TableHead>Coin</TableHead>
									<TableHead>Datum</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{#each displayTx.referenceInputs as r}
									<TableRow>
										<TableCell class="font-mono text-xs">{r.outRef.hash}:{r.outRef.index.toString()}</TableCell>
										<TableCell class="font-mono text-xs truncate max-w-[260px]">{r.address}</TableCell>
										<TableCell>{r.coin.toString()}</TableCell>
										<TableCell>{r.datum ? 'Yes' : '-'}</TableCell>
									</TableRow>
								{/each}
							</TableBody>
						</Table>
					{/if}
				</CardContent>
			</Card>
		{/if}
	{:else}
		<Card>
			<CardContent class="py-8 text-center text-muted-foreground">Transaction not found or not loaded.</CardContent>
		</Card>
	{/if}
</div>

<style>
	/* minimal overrides if needed */
</style>
