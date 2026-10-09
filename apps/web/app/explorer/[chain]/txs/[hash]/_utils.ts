import { cborParse } from "@laceanatomy/napi-pallas";
import { Hash } from "@laceanatomy/types";
import { type Network } from "@laceanatomy/types/cardano";
import { cache } from "react";
import { isEmpty } from "~/app/_utils";
import { getDolosProvider } from "~/server/api/dolos-provider";
import { loadTxPageData } from "./_shared";

async function parseCbor(cbor: string) {
  const res = cborParse(cbor);
  if (!isEmpty(res.error) || !res.cborRes) {
    throw new Error(res.error || "Transaction cbor could not be parsed");
  }
  return res.cborRes;
}

export const getTx = cache((chain: Network, hash: string) =>
  getDolosProvider(chain).getTx({ hash: Hash(hash) }),
);

export const loadPageData = cache((chain: Network, hash: string) => {
  const provider = getDolosProvider(chain);
  return loadTxPageData(
    {
      getTx: () => getTx(chain, hash),
      getCBOR: (query) => provider.getCBOR(query),
    },
    Hash(hash),
    parseCbor,
  );
});
