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
  metadataSource: "token-registry" | "cip68" | "blockfrost-onchain" | "none";
  cip68Metadata: Record<string, unknown> | null;
  cip68ReferenceUtxo: { txHash: string; outputIndex: number } | null;
  rawRegistryMetadata: TokenMetadata | null;
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
  addressesTotal: number | null;
  hasMoreHolders: boolean;
  allHolders?: AssetAddress[];
  transactions: cardano.Tx[];
  transactionsTotal: number;
};

const TX_PAGE_SIZE = 30;
const HOLDERS_PAGE_SIZE = 20;
const HOLDERS_FETCH_SIZE = HOLDERS_PAGE_SIZE + 1;

type PlutusDataJson = Record<string, unknown> & {
  bytes?: string;
  int?: number;
  big_int?: string;
  string?: string;
  list?: PlutusDataJson[];
  map?: { k: PlutusDataJson; v: PlutusDataJson }[];
  constructor?: number;
  fields?: PlutusDataJson[];
};

function plutusDataToValue(pd: PlutusDataJson): unknown {
  if (typeof pd.bytes === "string") {
    try {
      const decoded = Buffer.from(pd.bytes, "hex").toString("utf8");
      if (/^[\x20-\x7E\n\r\t]*$/.test(decoded)) return decoded;
      return `0x${pd.bytes}`;
    } catch {
      return `0x${pd.bytes}`;
    }
  }
  if (typeof pd.int === "number") return pd.int;
  if (typeof pd.big_int === "string") return BigInt(pd.big_int);
  if (typeof pd.string === "string") return pd.string;
  if (pd.map) {
    const result: Record<string, unknown> = {};
    for (const { k, v } of pd.map) {
      const key = plutusDataToValue(k);
      if (typeof key === "string") {
        result[key] = plutusDataToValue(v);
      }
    }
    return result;
  }
  if (pd.list) {
    return (pd.list as PlutusDataJson[]).map(plutusDataToValue);
  }
  return pd;
}

function parseCip68Datum(json: Record<string, unknown>): Record<string, unknown> | null {
  try {
    const constructor = json["constructor"] as number | undefined;
    if (constructor !== 0) return null;

    const fields = json["fields"] as PlutusDataJson[] | undefined;
    if (!fields || fields.length === 0) return null;

    const metadataMap = fields[0];
    const mapEntries = metadataMap?.["map"] as
      | { k: PlutusDataJson; v: PlutusDataJson }[]
      | undefined;
    if (!mapEntries) return null;

    const result: Record<string, unknown> = {};
    for (const { k, v } of mapEntries) {
      const key = plutusDataToValue(k);
      if (typeof key === "string") {
        result[key] = plutusDataToValue(v);
      }
    }

    if (fields[1] && typeof fields[1]["int"] === "number") {
      result._version = fields[1]["int"];
    }

    return result;
  } catch {
    return null;
  }
}

function deriveMetadataSource(
  registryMetadata: TokenMetadata | null,
  cip68Metadata: Record<string, unknown> | null,
  onchainMetadata: Record<string, unknown> | null,
): "token-registry" | "cip68" | "blockfrost-onchain" | "none" {
  if (registryMetadata?.name) return "token-registry";
  if (cip68Metadata) return "cip68";
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

  const [addressesResp, assetTxs, cip68Result] = await Promise.all([
    provider
      .getAssetAddresses(rawUnit, HOLDERS_FETCH_SIZE, 1)
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
    provider.getTokenMetadata?.({ unit: rawUnit }).catch(() => null),
  ]);

  const cip68Parsed = cip68Result
    ? parseCip68Datum(cip68Result.metadata)
    : null;
  const cip68Metadata = cip68Parsed ?? cip68Result?.metadata ?? null;
  const cip68ReferenceUtxo = cip68Result?.referenceUtxo ?? null;

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
    cip68Metadata,
    rawInfo.onchainMetadata,
  );

  const cip68Name =
    typeof cip68Metadata?.name === "string" ? cip68Metadata.name : null;
  const cip68Description =
    typeof cip68Metadata?.description === "string"
      ? cip68Metadata.description
      : null;
  const cip68Ticker =
    typeof cip68Metadata?.ticker === "string" ? cip68Metadata.ticker : null;
  const cip68Url =
    typeof cip68Metadata?.url === "string" ? cip68Metadata.url : null;
  const cip68Logo =
    typeof cip68Metadata?.image === "string"
      ? cip68Metadata.image
      : typeof cip68Metadata?.logo === "string"
        ? cip68Metadata.logo
        : null;
  const cip68Decimals =
    typeof cip68Metadata?.decimals === "number"
      ? cip68Metadata.decimals
      : null;

  const metadata: TokenMetadata = {
    subject: rawUnit,
    name:
      registryMetadata?.name ??
      cip68Name ??
      rawInfo.metadata?.name ??
      null,
    description:
      registryMetadata?.description ??
      cip68Description ??
      rawInfo.metadata?.description ??
      null,
    ticker:
      registryMetadata?.ticker ??
      cip68Ticker ??
      rawInfo.metadata?.ticker ??
      null,
    url:
      registryMetadata?.url ??
      cip68Url ??
      rawInfo.metadata?.url ??
      null,
    logo:
      registryMetadata?.logo ??
      cip68Logo ??
      rawInfo.metadata?.logo ??
      null,
    decimals:
      registryMetadata?.decimals ??
      cip68Decimals ??
      rawInfo.metadata?.decimals ??
      null,
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
    cip68Metadata,
    cip68ReferenceUtxo,
    rawRegistryMetadata: registryMetadata,
  };

  const hasMoreHolders = addressesResp.length > HOLDERS_PAGE_SIZE;
  const addresses = addressesResp.slice(0, HOLDERS_PAGE_SIZE);

  return {
    assetInfo,
    addresses,
    addressesTotal: hasMoreHolders ? null : addressesResp.length,
    hasMoreHolders,
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
