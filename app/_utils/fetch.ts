import { StatusCodes } from "http-status-codes";
import type { Dispatch, SetStateAction } from "react";
import type { IBlockfrostResponse, ICborTransaction } from "../_interfaces";
import { env } from "../env.mjs";
import { API_ROUTES, NETWORK } from "./constants";

export const getApiKey = (network: NETWORK): string => {
  switch (network) {
    case NETWORK.MAINNET:
      return env.NEXT_PUBLIC_MAINNET_BLOCKFROST_KEY;
    case NETWORK.PREPROD:
      return env.NEXT_PUBLIC_PREPROD_BLOCKFROST_KEY;
    case NETWORK.PREVIEW:
      return env.NEXT_PUBLIC_PREVIEW_BLOCKFROST_KEY;
    default:
      throw new Error("Invalid network provided");
  }
};

export const getBlockfrostUTxO = (network: NETWORK, hash: string) => {
  return `https://cardano-${network}.blockfrost.io/api/v0/txs/${hash}/utxos`;
};

export const getBlockfrostTx = (network: NETWORK, hash: string) => {
  return `https://cardano-${network}.blockfrost.io/api/v0/txs/${hash}`;
};

export const getBlockfrostRedeemers = (network: NETWORK, hash: string) => {
  return `https://cardano-${network}.blockfrost.io/api/v0/txs/${hash}/redeemers`;
};

export const getBlockfrostMetadata = (network: NETWORK, hash: string) => {
  return `https://cardano-${network}.blockfrost.io/api/v0/txs/${hash}/metadata`;
};

const parseQuery = (
  route: (typeof API_ROUTES)[keyof typeof API_ROUTES],
  query: Record<string, any>,
) => {
  const url = new URL(route, window.location.origin);
  Object.keys(query).forEach((key) => {
    if (query[key]) url.searchParams.append(key, query[key]);
  });
  return url;
};

export const getTxFromCbor = async (
  cbor: string,
  network: NETWORK,
  setFetchError: Dispatch<SetStateAction<string>>,
): Promise<ICborTransaction> => {
  try {
    const query = { network };
    const formData = new FormData();
    formData.append("cbor", cbor);
    const res = await fetch(parseQuery(API_ROUTES.CBOR, query), {
      method: "POST",
      body: formData,
    });
    if (res.status !== StatusCodes.OK) throw res;

    const data: ICborTransaction & { warning?: string } = await res.json();

    if (data.warning) console.warn(data.warning);

    return data;
  } catch (err: any) {
    console.log(err);
    setFetchError(err.statusText);
    throw err;
  }
};

export const getTxFromBlockfrost = async (
  txId: string,
  network: NETWORK,
  setFetchError: Dispatch<SetStateAction<string>>,
): Promise<IBlockfrostResponse> => {
  try {
    const query = { network, txId };
    const res = await fetch(parseQuery(API_ROUTES.HASH, query));
    if (res.status !== StatusCodes.OK) throw res;
    const data = await res.json();

    return data as IBlockfrostResponse;
  } catch (error) {
    console.error("Error processing Transaction Hash:", error);
    setFetchError("Error processing Hash");
    throw error;
  }
};
