"use client";

import type { ValidationResponse } from "@laceanatomy/napi-pallas";
import { NETWORK, type Network } from "@laceanatomy/types/cardano";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { parseTxToGraphical } from "~/app/_components/Input/TxInput/txInput.helper";
import { useConfigs } from "~/app/_contexts";
import type { IGraphicalTransaction } from "~/app/_interfaces";
import {
  getTxFromCbor,
  HASH_URL_PARAM,
  NET_URL_PARAM,
  toErrorMessage,
  USER_CONFIGS,
  validateTx,
} from "~/app/_utils";
import { fetchCborByHash } from "~/app/tx/cbor/_utils";

const FALLBACK_PARSE_ERROR = "Failed to parse CBOR";
const FALLBACK_VALIDATION_ERROR = "Validation failed";
const PORT_PARAM = "port";

export function useCborPageState() {
  const searchParams = useSearchParams();
  const { configs, updateConfigs } = useConfigs();
  const network = configs.net as Network;
  const devnetPort = configs.port;

  const [hashInput, setHashInput] = useState(
    () => searchParams?.get(HASH_URL_PARAM) ?? "",
  );
  const [initialCbor, setInitialCbor] = useState<string | null>(null);
  const [currentCbor, setCurrentCbor] = useState<string>("");
  const [parsedTx, setParsedTx] = useState<IGraphicalTransaction | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dissect");
  const [validationLoading, setValidationLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [validationResult, setValidationResult] =
    useState<ValidationResponse | null>(null);

  useEffect(() => {
    const netParam = searchParams?.get(NET_URL_PARAM);
    const portParam = searchParams?.get(PORT_PARAM);
    if (netParam && netParam !== configs.net) {
      updateConfigs(USER_CONFIGS.NET, netParam as Network);
    }
    if (portParam && portParam !== configs.port) {
      updateConfigs(USER_CONFIGS.PORT, portParam);
    }
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateUrl = useCallback((hash: string, net: Network, port: string) => {
    const params = new URLSearchParams();
    params.set(HASH_URL_PARAM, hash);
    params.set(NET_URL_PARAM, net);
    if (net === NETWORK.DEVNET) params.set(PORT_PARAM, port);
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${params.toString()}`,
    );
  }, []);

  const fetchAndParse = useCallback(
    async (hash: string, net: Network, port: string) => {
      setIsLoading(true);
      setParseError(null);
      try {
        const { cbor } = await fetchCborByHash(hash, net, port);
        setInitialCbor(cbor);
        setCurrentCbor(cbor);
        const tx = await getTxFromCbor(cbor, net);
        const [gtx] = parseTxToGraphical([tx], { transactions: [], utxos: {} });
        setParsedTx(gtx ?? null);
      } catch (e) {
        setParseError(toErrorMessage(e, "Failed to fetch and parse"));
        setParsedTx(null);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    const hashParam = searchParams?.get(HASH_URL_PARAM);
    const netParam = searchParams?.get(NET_URL_PARAM);
    if (!hashParam || !netParam) return;
    const validNetworks: Network[] = Object.values(NETWORK) as Network[];
    if (!validNetworks.includes(netParam as Network)) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAndParse(hashParam, netParam as Network, devnetPort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleFetch = useCallback(() => {
    const hash = hashInput.trim();
    if (!hash) return;
    updateUrl(hash, network, devnetPort);
    fetchAndParse(hash, network, devnetPort);
  }, [hashInput, network, devnetPort, updateUrl, fetchAndParse]);

  const handleParseCbor = useCallback(async () => {
    const cbor = currentCbor.trim();
    if (!cbor) return;
    setIsLoading(true);
    setParseError(null);
    try {
      const tx = await getTxFromCbor(cbor, network);
      const [gtx] = parseTxToGraphical([tx], { transactions: [], utxos: {} });
      setParsedTx(gtx ?? null);
    } catch (e) {
      setParseError(toErrorMessage(e, FALLBACK_PARSE_ERROR));
      setParsedTx(null);
    } finally {
      setIsLoading(false);
    }
  }, [currentCbor, network]);

  const handleValidate = useCallback(async () => {
    const cbor = currentCbor.trim();
    if (!cbor) return;
    setValidationLoading(true);
    setValidationError(null);
    setValidationResult(null);
    try {
      setValidationResult(await validateTx(cbor, network));
    } catch (e) {
      setValidationError(toErrorMessage(e, FALLBACK_VALIDATION_ERROR));
    } finally {
      setValidationLoading(false);
    }
  }, [currentCbor, network]);

  return {
    activeTab,
    setActiveTab,
    hashInput,
    setHashInput,
    handleFetch,
    isFetching: isLoading,
    initialCbor,
    currentCbor,
    setCurrentCbor,
    handleParseCbor,
    parsedTx,
    parseError,
    isLoading,
    handleValidate,
    validationResult,
    validationError,
    validationLoading,
  };
}
