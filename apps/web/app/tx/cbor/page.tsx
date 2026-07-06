"use client";

import {
  Button,
  Chip,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";
import type { ValidationResponse } from "@laceanatomy/napi-pallas";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { DissectSection, Header } from "~/app/_components";
import CborView from "~/app/_components/CborView";
import { DetailTabs } from "~/app/_components/DetailTabs";
import { parseTxToGraphical } from "~/app/_components/Input/TxInput/txInput.helper";
import ValidationView from "~/app/_components/ValidationView";
import { type IGraphicalTransaction } from "~/app/_interfaces";
import { getTxFromCbor, validateTx } from "~/app/_utils";
import { NETWORK, type Network } from "~/app/_utils/network-config";

const NETWORKS = Object.values(NETWORK);

function NetworkSelector({
  network,
  onChange,
}: {
  network: Network;
  onChange: (net: Network) => void;
}) {
  return (
    <Popover placement="bottom" showArrow>
      <PopoverTrigger>
        <Chip
          variant="dot"
          color="success"
          size="lg"
          className="cursor-pointer capitalize border-border"
        >
          {network}
        </Chip>
      </PopoverTrigger>
      <PopoverContent className="flex gap-1">
        {NETWORKS.map((value) => (
          <Chip
            key={value}
            variant="dot"
            color={network === value ? "success" : "danger"}
            className="cursor-pointer capitalize min-w-full text-center"
            onClick={() => onChange(value)}
          >
            {value}
          </Chip>
        ))}
      </PopoverContent>
    </Popover>
  );
}

export default function CborPage() {
  const searchParams = useSearchParams();
  const [hashInput, setHashInput] = useState("");
  const [network, setNetwork] = useState<Network>(NETWORK.MAINNET);
  const [devnetPort, setDevnetPort] = useState("5164");
  const [initialCbor, setInitialCbor] = useState<string | null>(null);
  const [parsedTx, setParsedTx] = useState<IGraphicalTransaction | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dissect");
  const [validationLoading, setValidationLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [validationResult, setValidationResult] =
    useState<ValidationResponse | null>(null);

  useEffect(() => {
    const hashParam = searchParams.get("hash");
    const netParam = searchParams.get("net");
    const portParam = searchParams.get("port");

    if (hashParam) setHashInput(hashParam);
    if (netParam && NETWORKS.includes(netParam as Network))
      setNetwork(netParam as Network);
    if (portParam) setDevnetPort(portParam);

    if (hashParam && netParam && NETWORKS.includes(netParam as Network)) {
      setIsLoading(true);
      const net = netParam as Network;

      const fetchUrl = new URL("/api/cbor/fetch", window.location.origin);
      fetchUrl.searchParams.set("hash", hashParam);
      fetchUrl.searchParams.set("net", net);
      if (net === NETWORK.DEVNET)
        fetchUrl.searchParams.set("port", portParam || "5164");

      fetch(fetchUrl.toString())
        .then(async (res) => {
          if (!res.ok) {
            const text = await res.text().catch(() => res.statusText);
            throw new Error(text);
          }
          return res.json() as Promise<{ cbor: string }>;
        })
        .then(({ cbor }) => {
          setInitialCbor(cbor);
          return getTxFromCbor(cbor, net);
        })
        .then((tx) => {
          const gtx = parseTxToGraphical([tx], { transactions: [], utxos: {} });
          setParsedTx(gtx[0]!);
        })
        .catch((e) => {
          const msg =
            e instanceof Response
              ? e.statusText
              : e instanceof Error
                ? e.message
                : "Failed to fetch and parse";
          setParseError(msg);
        })
        .finally(() => setIsLoading(false));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateUrl = useCallback(
    (hash: string, net: Network) => {
      const params = new URLSearchParams();
      params.set("hash", hash);
      params.set("net", net);
      if (net === NETWORK.DEVNET) params.set("port", devnetPort);
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}?${params.toString()}`,
      );
    },
    [devnetPort],
  );

  const fetchAndParse = useCallback(
    async (hash: string, net: Network) => {
      setIsLoading(true);
      setParseError(null);
      try {
        const fetchUrl = new URL("/api/cbor/fetch", window.location.origin);
        fetchUrl.searchParams.set("hash", hash);
        fetchUrl.searchParams.set("net", net);
        if (net === NETWORK.DEVNET)
          fetchUrl.searchParams.set("port", devnetPort);

        const res = await fetch(fetchUrl.toString());
        if (!res.ok) {
          const text = await res.text().catch(() => res.statusText);
          throw new Error(text);
        }
        const { cbor } = (await res.json()) as { cbor: string };
        setInitialCbor(cbor);

        const tx = await getTxFromCbor(cbor, net);
        const gtx = parseTxToGraphical([tx], { transactions: [], utxos: {} });
        setParsedTx(gtx[0]!);
      } catch (e) {
        const msg =
          e instanceof Response
            ? e.statusText
            : e instanceof Error
              ? e.message
              : "Failed to fetch and parse";
        setParseError(msg);
        setParsedTx(null);
      } finally {
        setIsLoading(false);
      }
    },
    [devnetPort],
  );

  const handleFetch = useCallback(() => {
    if (!hashInput.trim()) return;
    updateUrl(hashInput.trim(), network);
    fetchAndParse(hashInput.trim(), network);
  }, [hashInput, network, updateUrl, fetchAndParse]);

  const handleNetworkChange = useCallback(
    (net: Network) => {
      setNetwork(net);
      if (hashInput.trim()) updateUrl(hashInput.trim(), net);
    },
    [hashInput, updateUrl],
  );

  const handleReParse = useCallback(async () => {
    if (!initialCbor) return;
    setIsLoading(true);
    setParseError(null);
    try {
      const tx = await getTxFromCbor(initialCbor, network);
      const gtx = parseTxToGraphical([tx], { transactions: [], utxos: {} });
      setParsedTx(gtx[0]!);
    } catch (e) {
      const msg =
        e instanceof Response
          ? e.statusText
          : e instanceof Error
            ? e.message
            : "Failed to parse CBOR";
      setParseError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [initialCbor, network]);

  const handleValidate = useCallback(async () => {
    if (!initialCbor) return;
    setValidationLoading(true);
    setValidationError(null);
    setValidationResult(null);
    try {
      const result = await validateTx(initialCbor, network);
      setValidationResult(result);
    } catch (e) {
      setValidationError(e instanceof Error ? e.message : "Validation failed");
    } finally {
      setValidationLoading(false);
    }
  }, [initialCbor, network]);

  const tabs = [
    {
      key: "dissect",
      title: "Dissect",
      content: isLoading ? (
        <div className="flex flex-1 items-center justify-center text-p-secondary">
          Loading...
        </div>
      ) : parseError ? (
        <div className="flex flex-1 items-center justify-center p-6">
          <p className="break-words whitespace-pre-wrap text-center text-red-2">
            {parseError}
          </p>
        </div>
      ) : parsedTx ? (
        <div className="flex-1 min-h-0 overflow-auto">
          <DissectSection tx={parsedTx} />
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center p-6">
          <p className="text-center text-p-secondary">
            Enter a transaction hash and click Fetch, or paste CBOR into the
            editor
          </p>
        </div>
      ),
    },
    {
      key: "validation",
      title: "Validation",
      content: validationLoading ? (
        <div className="flex flex-1 items-center justify-center text-p-secondary">
          Validating...
        </div>
      ) : validationError ? (
        <div className="flex flex-1 items-center justify-center p-6">
          <p className="whitespace-pre-wrap text-center text-red-2">
            {validationError}
          </p>
        </div>
      ) : validationResult ? (
        <div className="flex-1 min-h-0 overflow-auto">
          <ValidationView validation={validationResult} />
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center p-6">
          <Button
            size="sm"
            variant="flat"
            className="font-mono shadow-md"
            onPress={handleValidate}
            isLoading={validationLoading}
            isDisabled={!initialCbor}
          >
            Run Validation
          </Button>
        </div>
      ),
    },
    {
      key: "diagram",
      title: "Diagram",
      content: <div className="flex flex-1 items-center justify-center p-6" />,
    },
  ];

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-5 md:overflow-hidden">
        <div className="flex shrink-0 items-center gap-2">
          <NetworkSelector network={network} onChange={handleNetworkChange} />
          {network === NETWORK.DEVNET && (
            <Input
              value={devnetPort}
              onValueChange={setDevnetPort}
              placeholder="Port"
              className="w-24"
              size="sm"
              variant="bordered"
            />
          )}
          <Input
            value={hashInput}
            onValueChange={setHashInput}
            placeholder="Transaction hash..."
            variant="bordered"
            className="flex-1"
            size="sm"
          />
          <Button
            variant="flat"
            className="shrink-0 font-mono shadow-md"
            size="sm"
            onPress={handleFetch}
            isLoading={isLoading}
          >
            Fetch
          </Button>
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-hidden md:min-h-0 md:flex-row">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <CborView cbor={initialCbor} />
            <div className="flex shrink-0 justify-center pt-2">
              <Button
                size="sm"
                variant="flat"
                className="font-mono shadow-md"
                onPress={handleReParse}
              >
                CBOR → Transaction
              </Button>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-border bg-surface p-4">
            <DetailTabs
              tabs={tabs}
              defaultTab="dissect"
              activeTab={activeTab}
              onTabChange={setActiveTab}
              ariaLabel="Transaction analysis"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
