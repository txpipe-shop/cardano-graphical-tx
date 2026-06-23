import { type DolosProvider } from "@laceanatomy/cardano-provider-dolos";
import {
  TokenRegistryClient,
  type TokenMetadata,
} from "@laceanatomy/cardano-token-registry-sdk";
import { Hash, type cardano } from "@laceanatomy/types";

export type AssetInfo = {
  unit: string;
  policyId: string;
  assetNameHex: string;
  fingerprint: string;
  totalSupply: string;
  mintOrBurnCount: number;
  initialMintTxHash: string;
  metadata: TokenMetadata | null;
  onchainMetadata: Record<string, unknown> | null;
  onchainMetadataStandard: string | null;
  metadataSource: "token-registry" | "blockfrost-onchain" | "none";
};

export type AssetAddress = {
  address: string;
  quantity: string;
};

export type AssetHistory = {
  txHash: string;
  action: "minted" | "burned";
  amount: string;
};

export type TokenPageData = {
  assetInfo: AssetInfo;
  addresses: AssetAddress[];
  addressesTotal: number;
  transactions: cardano.Tx[];
  transactionsTotal: number;
};

const TX_PAGE_SIZE = 30;

function deriveMetadataSource(
  registryMetadata: TokenMetadata | null,
  onchainMetadata: Record<string, unknown> | null,
): "token-registry" | "blockfrost-onchain" | "none" {
  if (registryMetadata?.name) return "token-registry";
  if (onchainMetadata) return "blockfrost-onchain";
  return "none";
}

export async function loadTokenPageData(
  provider: DolosProvider,
  unit: string,
  txPage: number = 1,
): Promise<TokenPageData> {
  const rawUnit = unit.startsWith("0x") ? unit.slice(2) : unit;

  const rawInfo = await provider.getAssetInfo(rawUnit);

  const [addressesResp, assetTxs] = await Promise.all([
    provider
      .getAssetAddresses(rawUnit, 100, 1)
      .catch(() => [] as AssetAddress[]),
    provider.getAssetTransactions(rawUnit, 100, 1).catch(
      () =>
        [] as {
          txHash: string;
          txIndex: number;
          blockHeight: number;
          blockTime: number;
        }[],
    ),
  ]);

  const txHashes = assetTxs.map((t) => t.txHash);
  const startIndex = (txPage - 1) * TX_PAGE_SIZE;
  const hashesToFetch = txHashes.slice(startIndex, startIndex + TX_PAGE_SIZE);

  const txResults = await Promise.allSettled(
    hashesToFetch.map((hash) => provider.getTx({ hash: Hash(hash) })),
  );
  const txs = txResults
    .filter(
      (r): r is PromiseFulfilledResult<cardano.Tx> => r.status === "fulfilled",
    )
    .map((r) => r.value);

  const tokenClient = new TokenRegistryClient();
  const registryMetadata = await tokenClient.getToken(rawUnit);

  const metadataSource = deriveMetadataSource(
    registryMetadata,
    rawInfo.onchainMetadata,
  );

  const metadata: TokenMetadata = {
    subject: rawUnit,
    name: registryMetadata?.name ?? rawInfo.metadata?.name ?? null,
    description:
      registryMetadata?.description ?? rawInfo.metadata?.description ?? null,
    ticker: registryMetadata?.ticker ?? rawInfo.metadata?.ticker ?? null,
    url: registryMetadata?.url ?? rawInfo.metadata?.url ?? null,
    logo: registryMetadata?.logo ?? rawInfo.metadata?.logo ?? null,
    decimals: registryMetadata?.decimals ?? rawInfo.metadata?.decimals ?? null,
    policy: registryMetadata?.policy ?? rawInfo.policyId ?? null,
  };

  const assetInfo: AssetInfo = {
    unit: rawUnit,
    policyId: rawInfo.policyId,
    assetNameHex: rawInfo.assetName ?? "",
    fingerprint: rawInfo.fingerprint,
    totalSupply: rawInfo.totalSupply,
    mintOrBurnCount: rawInfo.mintOrBurnCount,
    initialMintTxHash: rawInfo.initialMintTxHash,
    metadata,
    onchainMetadata: rawInfo.onchainMetadata,
    onchainMetadataStandard: rawInfo.onchainMetadataStandard,
    metadataSource,
  };

  return {
    assetInfo,
    addresses: addressesResp,
    addressesTotal: addressesResp.length,
    transactions: txs,
    transactionsTotal: assetTxs.length,
  };
}

export function resolveUnit(unit: string): string {
  if (unit.startsWith("asset")) {
    return unit;
  }
  const cleaned = unit.startsWith("0x") ? unit.slice(2) : unit;
  return cleaned;
}
