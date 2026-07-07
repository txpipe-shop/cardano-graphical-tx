import { Hash } from "@laceanatomy/types";
import { fetchCborByHash as fetchCborByHashAction } from "~/app/tx/cbor/actions";
import { NETWORK, type Network } from "~/app/_utils/network-config";
import { getU5CProviderWeb } from "~/app/_utils/u5c-provider-web";

export async function fetchCborByHash(
  hash: string,
  network: Network,
  port: string,
): Promise<{ cbor: string }> {
  if (network === NETWORK.DEVNET) {
    const provider = getU5CProviderWeb(Number(port));
    return { cbor: await provider.getCBOR({ hash: Hash(hash) }) };
  }
  return fetchCborByHashAction(hash, network);
}
