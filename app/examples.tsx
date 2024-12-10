"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { setCBOR } from "./_components/Header/header.helper";
import { useConfigs, useGraphical, useUI } from "./_contexts";
import {
  cbor1,
  getCborFromHash,
  hash1,
  hash2,
  KONVA_COLORS,
  ROUTES,
  USER_CONFIGS,
} from "./_utils";

export default function Examples() {
  const router = useRouter();
  const { setError } = useUI();
  const { configs, updateConfigs } = useConfigs();
  const { transactions, setTransactionBox } = useGraphical();
  const [query, setQuery] = useState<string>("");
  const [toGo, setToGo] = useState<string>("");

  const examples = [
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
        {examples.map((example, index) => (
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
      </div>
    </>
  );
}
