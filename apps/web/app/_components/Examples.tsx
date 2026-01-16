"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useConfigs, useGraphical, useUI } from "~/app/_contexts";
import {
  AddressExamples,
  DSLExamples,
  NETWORK,
  OPTIONS,
  ROUTES,
  TxExamples,
  USER_CONFIGS,
} from "~/app/_utils";
import addCBORsToContext from "./Input/TxInput/txInput.helper";

export function Examples({
  showTxExamples,
  showDSLExamples = false,
  showAddressesExamples = false,
}: {
  showTxExamples?: boolean;
  showDSLExamples?: boolean;
  showAddressesExamples?: boolean;
}) {
  const router = useRouter();
  const { setError, setLoading } = useUI();
  const { configs, updateConfigs } = useConfigs();
  const { transactions, setTransactionBox } = useGraphical();
  const [query, setQuery] = useState<string>("");
  const [toGo, setToGo] = useState<string>("");

  const handleClick =
    (title: string, option: OPTIONS, txs: string) => async () => {
      const multiplesInputs = txs.split(",").map((tx) => tx.trim());
      const uniqueInputs = Array.from(new Set(multiplesInputs));
      addCBORsToContext(
        option,
        uniqueInputs,
        NETWORK.PREPROD,
        setError,
        transactions,
        setTransactionBox,
        setLoading,
      );
      updateConfigs(USER_CONFIGS.QUERY, txs);
      updateConfigs(USER_CONFIGS.NET, "preprod");
      updateConfigs(USER_CONFIGS.OPTION, option);
      setQuery(txs);
      setToGo(title.startsWith("Draw") ? ROUTES.GRAPHER : ROUTES.DISSECT);
    };

  const handleAddressClick = async (raw: string) => {
    updateConfigs(USER_CONFIGS.QUERY, raw);
    router.push(ROUTES.ADDRESS + "?example=" + raw);
  };

  useEffect(() => {
    if (configs.query === query) router.push(toGo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, query, toGo]);

  return (
    <>
      <div className="mb-6 mt-10 text-3xl">Try one of these examples</div>
      <div className="flex w-full basis-1/4 flex-wrap justify-start gap-3">
        {showTxExamples &&
          TxExamples.map((example, index) => (
            <button
              key={index}
              type="submit"
              className="w-[24%] cursor-pointer justify-evenly rounded-lg border-2 bg-gray-100 p-4 text-left shadow"
              onClick={handleClick(
                example.title,
                example.title.endsWith("CBOR") ? OPTIONS.CBOR : OPTIONS.HASH,
                example.code,
              )}
            >
              <h3 className="text-xl">{example.title}</h3>

              <code className="mt-4 block w-full break-words text-gray-400">
                {example.code.substring(0, 30)}...
              </code>
            </button>
          ))}
        {showDSLExamples &&
          DSLExamples.map((example, index) => (
            <button
              key={index}
              type="submit"
              className="w-[24%] cursor-pointer justify-evenly rounded-lg border-2 bg-gray-100 p-4 text-left shadow"
              onClick={() =>
                router.push(ROUTES.DSL + "?example=" + example.title)
              }
            >
              <h3 className="text-xl">{example.title} DSL Usage Example</h3>
              <code className="mt-4 block w-full break-words text-gray-400">
                {example.code.substring(0, 30)}
              </code>
            </button>
          ))}
        {showAddressesExamples &&
          AddressExamples.map((example, index) => (
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
