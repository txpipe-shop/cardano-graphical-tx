"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Header,
  InfoPanel,
  Playground,
  TxInfo,
  TxInput,
  UtxoInfo,
} from "~/app/_components";
import { useConfigs, useUI } from "~/app/_contexts";
import { isEmpty, ROUTES, TX_URL_PARAM, UTXO_URL_PARAM } from "~/app/_utils";
import Loading from "~/app/loading";

interface GrapherProps {
  searchParams?: {
    [TX_URL_PARAM]?: string;
    [UTXO_URL_PARAM]?: string;
  };
}

export default function Index({ searchParams }: GrapherProps) {
  const { replace } = useRouter();
  const { loading } = useUI();
  const { configs } = useConfigs();
  const { [TX_URL_PARAM]: selectedTx, [UTXO_URL_PARAM]: selectedUtxo } =
    searchParams || {};

  useEffect(() => {
    if (isEmpty(configs.query)) {
      replace(ROUTES.TX);
      return;
    }
    // Remove URL params when reloading the page
    replace(ROUTES.GRAPHER);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replace]);

  if (loading) return <Loading />;

  return (
    <>
      <div className="relative h-dvh w-full overflow-hidden">
        <InfoPanel
          isVisible={selectedTx !== undefined}
          from="left"
          title="TX Information"
        >
          <TxInfo />
        </InfoPanel>
        <InfoPanel
          isVisible={selectedUtxo !== undefined}
          from="right"
          title="UTXO Information"
        >
          <UtxoInfo />
        </InfoPanel>
        <Playground />
      </div>
      <div className="absolute w-full">
        <Header />
        <TxInput />
      </div>
    </>
  );
}
