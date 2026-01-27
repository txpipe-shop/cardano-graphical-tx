import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import {
  addCBORsToContext,
  addDevnetCBORsToContext,
} from "~/app/_components/Input/TxInput/txInput.helper";
import { useConfigs, useGraphical, useUI } from "~/app/_contexts";
import {
  HASH_URL_PARAM,
  NET_URL_PARAM,
  type Network,
  NETWORK,
  OPTIONS,
  USER_CONFIGS,
} from "~/app/_utils";

export const useTransactionLoader = () => {
  const { transactions, setTransactionBox, dimensions } = useGraphical();
  const { setError, setLoading, refreshTrigger } = useUI();
  const { configs, updateConfigs } = useConfigs();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchTransactions = async () => {
      const hashParam = searchParams.get(HASH_URL_PARAM);
      const netParam = searchParams.get(NET_URL_PARAM);

      // Prioritize URL params
      const query = hashParam || configs.query;
      const network = (netParam as Network) || configs.net;

      if (!query) return;

      // Sync URL params to config if they exist and are different
      if (hashParam && hashParam !== configs.query) {
        updateConfigs(USER_CONFIGS.QUERY, hashParam);
      }
      if (netParam && netParam !== configs.net) {
        updateConfigs(USER_CONFIGS.NET, netParam as Network);
      }

      const multiplesInputs = query.split(",").map((tx) => tx.trim());
      const uniqueInputs = Array.from(new Set(multiplesInputs));
      const size = {
        x: dimensions.width || window.innerWidth,
        y: dimensions.height || window.innerHeight,
      };

      const option = hashParam ? OPTIONS.HASH : configs.option;

      if (network === NETWORK.DEVNET) {
        await addDevnetCBORsToContext(
          option,
          Number(configs.port),
          uniqueInputs,
          setError,
          transactions,
          setTransactionBox,
          setLoading,
          size,
        );
      } else {
        await addCBORsToContext(
          option,
          uniqueInputs,
          network,
          setError,
          transactions,
          setTransactionBox,
          setLoading,
          size,
        );
      }
    };

    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, refreshTrigger]);
};
