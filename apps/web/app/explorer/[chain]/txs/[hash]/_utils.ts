import { type Hash } from "@laceanatomy/types";
import { headers } from "next/headers";
import {
  type ChainNetwork,
  getDbSyncProvider,
} from "~/server/api/dbsync-provider";
import { loadTxPageData } from "./_shared";

type PageData = {
  chain: ChainNetwork;
  hash: Hash;
};

export async function loadPageData({ chain, hash }: PageData) {
  const provider = getDbSyncProvider(chain);
  const parseCborViaApi = async (cbor: string) => {
    const formData = new FormData();
    formData.append("tx", cbor);

    const requestHeaders = headers();
    const host =
      requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
    const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";

    if (!host) {
      throw new Error("Unable to resolve host for CBOR parsing");
    }

    const res = await fetch(`${protocol}://${host}/api/cbor/devnet`, {
      method: "POST",
      body: formData,
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(res.statusText || "Failed to parse CBOR");
    }

    const data = await res.json();
    if (!data?.tx) {
      throw new Error("Transaction cbor could not be parsed");
    }

    return data.tx;
  };

  return loadTxPageData(provider, hash, parseCborViaApi);
}
