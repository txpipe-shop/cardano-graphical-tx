import { StatusCodes } from "http-status-codes";
import type { Dispatch, SetStateAction } from "react";
import type { IBlockfrostResponse, ITransaction } from "../_interfaces";
import { env } from "../env.mjs";
import { API_ROUTES, ERRORS, NETWORK } from "./constants";

export const getApiKey = (network: NETWORK): string => {
  switch (network) {
    case NETWORK.MAINNET:
      return env.MAINNET_BLOCKFROST_KEY;
    case NETWORK.PREPROD:
      return env.PREPROD_BLOCKFROST_KEY;
    case NETWORK.PREVIEW:
      return env.PREVIEW_BLOCKFROST_KEY;
    default:
      throw new Error("Invalid network provided");
  }
};

export const getBlockfrostURL = (network: NETWORK, hash: string) => {
  return `https://cardano-${network}.blockfrost.io/api/v0/txs/${hash}/cbor`;
};
export const getUTxOsURL = (network: NETWORK, hash: string) => {
  return `https://cardano-${network}.blockfrost.io/api/v0/txs/${hash}/utxos`;
};

export const getTransactionURL = (network: NETWORK, hash: string) => {
  return `https://cardano-${network}.blockfrost.io/api/v0/txs/${hash}`;
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
): Promise<ITransaction> => {
  try {
    const query = { network };
    const formData = new FormData();
    formData.append("cbor", cbor);
    const res = await fetch(parseQuery(API_ROUTES.CBOR, query), {
      method: "POST",
      body: formData,
    });
    if (res.status !== StatusCodes.OK) throw res;

    const data: ITransaction & { warning?: string } = await res.json();

    if (data.warning) console.warn(data.warning);

    return data as ITransaction;
  } catch (err: any) {
    console.error(err);
    throw err;
  }
};

export const getCborFromHash = async (
  txId: string,
  network: NETWORK,
  setError: Dispatch<SetStateAction<string>>,
): Promise<IBlockfrostResponse> => {
  try {
    const query = { network, txId };
    const res = await fetch(parseQuery(API_ROUTES.HASH, query));
    if (res.status !== StatusCodes.OK) throw res;
    const data = await res.json();

    return data as IBlockfrostResponse;
  } catch (error) {
    if (error instanceof TypeError) {
      return {
        cbor: "",
        warning: ERRORS.internal_error,
      } as IBlockfrostResponse;
    } else {
      console.error("Error processing Transaction Hash:", error);
      setError("Error processing CBOR");
      throw error;
    }
  }
};

export const getDSLFromJSON = async (
  dsl: string,
  setError: Dispatch<SetStateAction<string>>,
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("dsl", dsl.replace(/\s+/g, ""));
    const res = await fetch(parseQuery(API_ROUTES.DSL, {}), {
      method: "POST",
      body: formData,
    });
    if (res.status !== StatusCodes.OK) throw res;
    return JSON.stringify(res);
  } catch (error) {
    console.error("Error processing JSON:", error);
    setError("Error processing JSON");
    throw error;
  }
};
