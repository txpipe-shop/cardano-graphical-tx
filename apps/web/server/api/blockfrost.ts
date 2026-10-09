import {
  CardanoEpochsApi,
  CardanoLedgerApi,
  CardanoTransactionsApi,
  Configuration,
} from "@laceanatomy/blockfrost-sdk";
import { type Network } from "@laceanatomy/types/cardano";
import { getNetworkConfigServer } from "./server-network-config";
import { UPSTREAM_HTTP_TIMEOUT_MS } from "./upstream";

function getBlockfrostConfig(network: Network): Configuration {
  const config = getNetworkConfigServer(network);
  return new Configuration({
    basePath: config.dolosBlockfrostUrl,
    apiKey: config.dolosBlockfrostApiKey,
    baseOptions: {
      timeout: UPSTREAM_HTTP_TIMEOUT_MS,
      headers: {
        "dmtr-api-key": config.dolosBlockfrostApiKey,
      },
    },
  });
}

export function getBlockfrostTransactionsApi(network: Network) {
  return new CardanoTransactionsApi(getBlockfrostConfig(network));
}

export function getBlockfrostLedgerApi(network: Network) {
  return new CardanoLedgerApi(getBlockfrostConfig(network));
}

export function getBlockfrostEpochsApi(network: Network) {
  return new CardanoEpochsApi(getBlockfrostConfig(network));
}
