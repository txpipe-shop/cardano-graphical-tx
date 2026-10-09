import { Hash, Unit, type cardano } from "@laceanatomy/types";
import { type Network } from "@laceanatomy/types/cardano";
import { cache } from "react";
import {
  HOLDERS_PAGE_SIZE,
  TX_PAGE_SIZE,
} from "~/app/_components/ExplorerSection/Tokens/constants";
import { getDolosProvider } from "~/server/api/dolos-provider";
import type {
  AssetAddress,
  AssetInfo,
  TokenPageData,
  TokenSummary,
} from "./_shared";

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

function toRawUnit(unit: string) {
  return unit.startsWith("0x") ? unit.slice(2) : unit;
}

const getAssetInfo = cache((chain: Network, rawUnit: string) =>
  getDolosProvider(chain).getAssetInfo(rawUnit),
);

const loadTokenTxs = cache(
  async (
    chain: Network,
    rawUnit: string,
    txPage: number,
  ): Promise<Pick<TokenPageData, "transactions" | "hasMoreTransactions">> => {
    const provider = getDolosProvider(chain);
    const rawTxs = await provider
      .getAssetTxs(rawUnit, TX_FETCH_SIZE, txPage, "desc")
      .catch(
        () =>
          [] as {
            txHash: string;
            txIndex: number;
            blockHeight: number;
            blockTime: number;
          }[],
      );

    const hasMoreTransactions = rawTxs.length > TX_PAGE_SIZE;
    const pageTxs = rawTxs.slice(0, TX_PAGE_SIZE);
    const txResults = await Promise.allSettled(
      pageTxs.map((t) => provider.getTx({ hash: Hash(t.txHash) })),
    );
    const transactions = txResults
      .filter(
        (r): r is PromiseFulfilledResult<cardano.Tx> =>
          r.status === "fulfilled",
      )
      .map((r) => r.value);

    return { transactions, hasMoreTransactions };
  },
);

export const loadTokenSummary = cache(
  async (chain: Network, unit: string): Promise<TokenSummary> => {
    const rawUnit = toRawUnit(unit);
    const rawInfo = await getAssetInfo(chain, rawUnit);
    const provider = getDolosProvider(chain);
    const network = chain === "mainnet" ? "mainnet" : "preprod";

    const [addressesResp, cipResult] = await Promise.all([
      provider
        .getAssetHolders(rawUnit, HOLDERS_FETCH_SIZE, 1)
        .catch(() => [] as AssetAddress[]),
      provider
        .getTokenMetadata?.({ unit: Unit(rawUnit), network })
        .catch(() => null),
    ]);

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
    };
  },
);

export const loadTokenPageData = cache(
  async (
    chain: Network,
    unit: string,
    txPage: number,
  ): Promise<TokenPageData> => {
    const rawUnit = toRawUnit(unit);
    // An unknown asset fails here, before the list lookups start.
    await getAssetInfo(chain, rawUnit);
    const [summary, txs] = await Promise.all([
      loadTokenSummary(chain, unit),
      loadTokenTxs(chain, rawUnit, txPage),
    ]);
    return { ...summary, ...txs };
  },
);
