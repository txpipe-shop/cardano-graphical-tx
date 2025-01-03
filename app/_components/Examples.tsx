"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useConfigs, useGraphical, useUI } from "~/app/_contexts";
import {
  AddressExamples,
  getCborFromHash,
  KONVA_COLORS,
  OPTIONS,
  ROUTES,
  TxExamples,
  USER_CONFIGS,
} from "~/app/_utils";
import { setCBOR } from "./Header/header.helper";

export function Examples({
  showTxExamples,
  showDSLExample = false,
  showAddressesExamples = false,
}: {
  showTxExamples?: boolean;
  showDSLExample?: boolean;
  showAddressesExamples?: boolean;
}) {
  const router = useRouter();
  const { setError, setLoading } = useUI();
  const { configs, updateConfigs } = useConfigs();
  const { transactions, setTransactionBox } = useGraphical();
  const [query, setQuery] = useState<string>("");
  const [toGo, setToGo] = useState<string>("");

  const handleClick =
    (title: string, option: OPTIONS, tx: string) => async () => {
      if (option === OPTIONS.HASH) {
        const { cbor, warning } = await getCborFromHash(
          tx,
          "preprod",
          setError,
        );
        if (warning) {
          toast.error(warning, {
            icon: "🚫",
            style: { fontWeight: "bold", color: KONVA_COLORS.RED_WARNING },
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
          setLoading,
        );
      } else {
        await setCBOR(
          "preprod",
          tx,
          transactions,
          setTransactionBox,
          setError,
          setLoading,
        );
      }
      updateConfigs(USER_CONFIGS.QUERY, tx);
      updateConfigs(USER_CONFIGS.NET, "preprod");
      updateConfigs(USER_CONFIGS.OPTION, option);
      setQuery(tx);
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
