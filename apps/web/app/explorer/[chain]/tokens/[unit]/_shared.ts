import { type cardano } from "@laceanatomy/types";

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

export type TokenSummary = {
  assetInfo: AssetInfo;
  addresses: AssetAddress[];
  addressesTotal: number | null;
  hasMoreHolders: boolean;
  allHolders?: AssetAddress[];
};

export type TokenPageData = TokenSummary & {
  transactions: cardano.Tx[];
  hasMoreTransactions: boolean;
};
