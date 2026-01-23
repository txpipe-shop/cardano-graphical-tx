"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { DissectSection, Error } from "~/app/_components";
import { addCBORsToContext, addDevnetCBORsToContext } from "~/app/_components/Input/TxInput/txInput.helper";
import { useConfigs, useGraphical, useUI } from "~/app/_contexts";
import { isEmpty, NETWORK, OPTIONS, USER_CONFIGS } from "~/app/_utils";
import { isValidChain, mapChainToNetwork } from "~/app/_utils/network";
import Loading from "~/app/loading";

export default function DissectPage() {
  const { chain } = useParams();
  const searchParams = useSearchParams();
  const { transactions, setTransactionBox, dimensions } = useGraphical();
  const { loading, error, setLoading, setError } = useUI();
  const { configs, updateConfigs } = useConfigs();
  const hasFetched = useRef(false);

  const hashFromQuery = searchParams.get("hash");

  useEffect(() => {
    if (!isValidChain(chain)) return;

    const network = mapChainToNetwork(chain);
    let inputToProcess: string | undefined;
    let optionToUse: OPTIONS;

    if (hashFromQuery) {
      inputToProcess = hashFromQuery;
      optionToUse = OPTIONS.HASH;
      updateConfigs(USER_CONFIGS.OPTION, OPTIONS.HASH);
      updateConfigs(USER_CONFIGS.QUERY, hashFromQuery);
    } else if (configs.query && !isEmpty(configs.query)) {
      inputToProcess = configs.query;
      optionToUse = configs.option;
    } else {
      return;
    }

    if (!inputToProcess) return;


    let existingTx;
    if (optionToUse === OPTIONS.HASH) {
      existingTx = transactions.transactions.find(tx => tx.txHash === inputToProcess);
    } else {
      existingTx = undefined;
    }

    if (existingTx && hasFetched.current) return;
    if (hasFetched.current) return;

    hasFetched.current = true;
    setLoading(true);
    setError("");

    const size = { x: dimensions.width, y: dimensions.height };
    const fetchTransaction = async () => {
      try {
        if (network === NETWORK.DEVNET) {
          await addDevnetCBORsToContext(
            optionToUse,
            Number(configs.port),
            [inputToProcess],
            setError,
            transactions,
            setTransactionBox,
            setLoading,
            size,
          );
        } else {
          await addCBORsToContext(
            optionToUse,
            [inputToProcess],
            network,
            setError,
            transactions,
            setTransactionBox,
            setLoading,
            size,
          );
        }
      } catch (error) {
        console.error(error);
        setError("Failed to fetch transaction");
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [chain, hashFromQuery, configs.query, configs.option, configs.port, configs.net, transactions, dimensions]);

  useEffect(() => {
    hasFetched.current = false;
  }, [hashFromQuery, configs.query]);

  if (loading) return <Loading />;

  let txToShow;
  if (hashFromQuery) {
    txToShow = transactions.transactions.find(tx => tx.txHash === hashFromQuery);
  } else if (configs.query) {
    txToShow = transactions.transactions[0];
  }

  return (
    <div>
      {!isEmpty(error) ? (
        <Error action="dissecting" goal="transaction" option={configs.option} />
      ) : txToShow ? (
        <DissectSection tx={txToShow} />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center p-5">
          <p className="text-gray-500">Enter a transaction hash or CBOR to dissect</p>
        </div>
      )}
    </div>
  );
}
