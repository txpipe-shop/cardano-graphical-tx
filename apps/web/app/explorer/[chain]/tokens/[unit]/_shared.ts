import { type DolosProvider } from "@laceanatomy/cardano-provider-dolos";
import { Hash, Unit, type cardano } from "@laceanatomy/types";
import {
  HOLDERS_PAGE_SIZE,
  TX_PAGE_SIZE,
} from "~/app/_components/ExplorerSection/Tokens/constants";

export type AssetInfo = {
  unit: string;
  policyId: string;
  assetNameHex: string;
  fingerprint: string;
  totalSupply: string;
  mintOrBurnCount: number;
  initialMintTxHash: string;
  metadata: cardano.NullableTokenMetadata;
  metadataSources: string[];
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
  hasMoreTransactions: boolean;
};

const TX_FETCH_SIZE = TX_PAGE_SIZE + 1;
const HOLDERS_FETCH_SIZE = HOLDERS_PAGE_SIZE + 1;

function deriveMetadataSource(
  cip26: cardano.CIP26Metadata | null,
  cip68:
    | cardano.CIP68MetadataNft222
    | cardano.CIP68MetadataFt333
    | cardano.CIP68MetadataRft444
    | cardano.CIP68MetadataMapV4
    | null,
  cip25: cardano.CIP25MetadataV1 | null,
): string[] {
  const sources: string[] = [];
  if (cip26?.name) sources.push("token-registry");
  if (cip68) sources.push("cip68");
  if (cip25) sources.push("blockfrost-onchain");
  return sources;
}

export async function loadTokenPageData(
  provider: DolosProvider,
  unit: string,
  chain: string,
  txPage: number = 1,
): Promise<TokenPageData> {
  const rawUnit = unit.startsWith("0x") ? unit.slice(2) : unit;

  const rawInfo = await provider.getAssetInfo(rawUnit);
  const network = chain === "mainnet" ? "mainnet" : "preprod";

  const [addressesResp, rawTxs, cipResult] = await Promise.all([
    provider
      .getAssetHolders(rawUnit, HOLDERS_FETCH_SIZE, 1)
      .catch(() => [] as AssetAddress[]),
    provider.getAssetTxs(rawUnit, TX_FETCH_SIZE, txPage, "desc").catch(
      () =>
        [] as {
          txHash: string;
          txIndex: number;
          blockHeight: number;
          blockTime: number;
        }[],
    ),
    provider
      .getTokenMetadata?.({ unit: Unit(rawUnit), network })
      .catch(() => null),
  ]);

  const hasMoreTransactions = rawTxs.length > TX_PAGE_SIZE;
  const pageTxs = rawTxs.slice(0, TX_PAGE_SIZE);
  const hashesToFetch = pageTxs.map((t) => t.txHash);

  const txResults = await Promise.allSettled(
    hashesToFetch.map((hash) => provider.getTx({ hash: Hash(hash) })),
  );
  const txs = txResults
    .filter(
      (r): r is PromiseFulfilledResult<cardano.Tx> => r.status === "fulfilled",
    )
    .map((r) => r.value);

  const cip26 = cipResult?.Cip26 ?? null;
  const cip25 = cipResult?.Cip25v1 ?? cipResult?.Cip25v2 ?? null;
  const cip68 =
    cipResult?.Cip68v4 ??
    cipResult?.Cip68v3 ??
    cipResult?.Cip68v2 ??
    cipResult?.Cip68v1 ??
    null;

  const metadataSources = deriveMetadataSource(cip26, cip68, cip25);

  const assetInfo: AssetInfo = {
    unit: rawUnit,
    policyId: rawInfo.policyId,
    assetNameHex: rawInfo.assetName ?? "",
    fingerprint: rawInfo.fingerprint,
    totalSupply: rawInfo.totalSupply,
    mintOrBurnCount: rawInfo.mintOrBurnCount,
    initialMintTxHash: rawInfo.initialMintTxHash,
    metadata: cipResult ?? {
      Cip25v1: null,
      Cip25v2: null,
      Cip26: null,
      Cip68v1: null,
      Cip68v2: null,
      Cip68v3: null,
      Cip68v4: null,
    },
    metadataSources,
  };

  const hasMoreHolders = addressesResp.length > HOLDERS_PAGE_SIZE;
  const addresses = addressesResp.slice(0, HOLDERS_PAGE_SIZE);

  return {
    assetInfo,
    addresses,
    addressesTotal: hasMoreHolders ? null : addressesResp.length,
    hasMoreHolders,
    transactions: txs,
    hasMoreTransactions,
  };
}
