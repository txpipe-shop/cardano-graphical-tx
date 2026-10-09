import { U5CProvider } from "@laceanatomy/cardano-provider-u5c";
import { createUpstreamTransport, memoize } from "./upstream";

export const getU5CProviderNode = memoize(
  (port: number) =>
    new U5CProvider({
      transport: createUpstreamTransport(`http://localhost:${port}`),
    }),
);
