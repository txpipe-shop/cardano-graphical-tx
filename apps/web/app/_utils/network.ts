import { NETWORK } from "./constants";

export const isValidChain = (chain: string | undefined | string[]): chain is NETWORK => {
  return Object.values(NETWORK).includes(chain as NETWORK);
}

export const mapChainToNetwork = (chain: string): NETWORK => {
  switch (chain) {
    case "mainnet":
      return NETWORK.MAINNET;
    case "preprod":
      return NETWORK.PREPROD;
    case "preview":
      return NETWORK.PREVIEW;
    case "devnet":
      return NETWORK.DEVNET;
    default:
      return NETWORK.MAINNET;
  }
};