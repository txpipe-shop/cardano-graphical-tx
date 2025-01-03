"use client";

import { useRouter } from "next/navigation";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useConfigs, useGraphical, useUI } from "../_contexts";
import {
  cbor1,
  examples_address,
  getAddressInfo,
  getCborFromHash,
  hash1,
  hash2,
  KONVA_COLORS,
  ROUTES,
  USER_CONFIGS,
} from "../_utils";
import { setCBOR } from "./Header/header.helper";
import type { Output } from "~/napi-pallas";

export function Examples({
  showDSLExample = false,
}: {
  showDSLExample?: boolean;
}) {
  const router = useRouter();
  const { setError } = useUI();
  const { configs, updateConfigs } = useConfigs();
  const { transactions, setTransactionBox } = useGraphical();
  const [query, setQuery] = useState<string>("");
  const [toGo, setToGo] = useState<string>("");

  const examples_tx = [
    {
      title: "Draw CBOR",
      code: cbor1,
      onclick: async () => {
        await setCBOR(
          "preprod",
          cbor1,
          transactions,
          setTransactionBox,
          setError,
          true,
        );
        setQuery(cbor1);
        updateConfigs(USER_CONFIGS.QUERY, cbor1);
        updateConfigs(USER_CONFIGS.NET, "preprod");
        updateConfigs(USER_CONFIGS.OPTION, "cbor");
        setToGo(ROUTES.GRAPHER);
      },
    },
    {
      title: "Draw Tx Hash",
      code: hash1,
      onclick: async () => {
        const { cbor, warning } = await getCborFromHash(
          hash1,
          "preprod",
          setError,
        );
        if (warning) {
          toast.error(warning, {
            icon: "🚫",
            style: {
              fontWeight: "bold",
              color: KONVA_COLORS.RED_WARNING,
            },
            duration: 5000,
          });
          return;
        }
        await setCBOR(
          "preprod",
          cbor,
          transactions,
          setTransactionBox,
          setError,
          true,
        );
        setQuery(hash1);
        updateConfigs(USER_CONFIGS.QUERY, hash1);
        updateConfigs(USER_CONFIGS.NET, "preprod");
        updateConfigs(USER_CONFIGS.OPTION, "hash");
        setToGo(ROUTES.GRAPHER);
      },
    },
    {
      title: "Dissect CBOR",
      code: cbor1,
      onclick: async () => {
        await setCBOR(
          "preprod",
          cbor1,
          transactions,
          setTransactionBox,
          setError,
          true,
        );
        setQuery(cbor1);
        updateConfigs(USER_CONFIGS.QUERY, cbor1);
        updateConfigs(USER_CONFIGS.NET, "preprod");
        updateConfigs(USER_CONFIGS.OPTION, "cbor");
        setToGo(ROUTES.DISSECT);
      },
    },
    {
      title: "Dissect Tx Hash",
      code: hash2,
      onclick: async () => {
        const { cbor } = await getCborFromHash(hash2, "preprod", setError);
        await setCBOR(
          "preprod",
          cbor,
          transactions,
          setTransactionBox,
          setError,
          true,
        );
        setQuery(hash2);
        updateConfigs(USER_CONFIGS.QUERY, hash2);
        updateConfigs(USER_CONFIGS.NET, "preprod");
        updateConfigs(USER_CONFIGS.OPTION, "hash");
        setToGo(ROUTES.DISSECT);
      },
    },
  ];

  useEffect(() => {
    if (configs.query === query) {
      router.push(toGo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, query, toGo]);

  return (
    <>
      <div className="mb-6 mt-10 text-3xl">Try one of these examples</div>
      <div className="flex w-full basis-1/4 flex-wrap justify-between gap-3">
        {examples_tx.map((example, index) => (
          <button
            key={index}
            type="submit"
            className="w-[24%] cursor-pointer justify-evenly rounded-lg border-2 bg-gray-100 p-4 text-left shadow"
            onClick={example.onclick}
          >
            <h3 className="text-xl">{example.title}</h3>

            <code className="mt-4 block w-full break-words text-gray-400">
              {example.code.substring(0, 30)}...
            </code>
          </button>
        ))}
        {showDSLExample && (
          <button
            type="submit"
            className="w-[24%] cursor-pointer justify-evenly rounded-lg border-2 bg-gray-100 p-4 text-left shadow"
            onClick={() => router.push(ROUTES.DSL + "?example=true")}
          >
            <h3 className="text-xl">DSL Usage Example</h3>

            <code className="mt-4 block w-full break-words text-gray-400">
              {`{ "transaction": { "name": "example", "fee": 1,...`}
            </code>
          </button>
        )}
      </div>
    </>
  );
}

export function ExamplesAddress({
  setAddressInfo,
}: {
  setAddressInfo: Dispatch<SetStateAction<Output>>;
}): JSX.Element {
  const router = useRouter();
  const { setError } = useUI();
  const { configs, updateConfigs } = useConfigs();
  const [query, setQuery] = useState<string>("");
  const [toGo] = useState<string>("");

  const handleAddressClick = async (raw: string) => {
    const res = await getAddressInfo(raw, setError);
    if (res.error) {
      setError(res.error);
      return;
    }
    setQuery(raw);
    updateConfigs(USER_CONFIGS.QUERY, raw);
    setAddressInfo(res);
  };

  useEffect(() => {
    if (configs.query === query) {
      router.push(toGo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, query, toGo]);

  return (
    <>
      <div className="mb-6 mt-10 text-3xl">Try one of these examples</div>
      <div className="flex w-full basis-1/4 flex-wrap justify-start gap-3">
        {examples_address.map((example, index) => (
          <button
            key={index}
            type="submit"
            className="w-[24%] cursor-pointer justify-evenly rounded-lg border-2 bg-gray-100 p-4 text-left shadow"
            onClick={() => handleAddressClick(example.address)}
          >
            <h3 className="text-xl">{example.title}</h3>
            <code className="mt-4 block w-full break-words text-gray-400">
              {example.address.substring(0, 30)}...
            </code>
          </button>
        ))}
      </div>
    </>
  );
}
