"use client";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import {
  Header,
  InfoPanel,
  Playground,
  TxInfo,
  UtxoInfo,
} from "../_components";
import { ROUTES, TX_URL_PARAM, UTXO_URL_PARAM } from "../_utils";
import Loading from "../loading";

interface GrapherProps {
  searchParams?: {
    [TX_URL_PARAM]?: string;
    [UTXO_URL_PARAM]?: string;
  };
}
export default function Index({ searchParams }: GrapherProps) {
  const { replace } = useRouter();
  const { [TX_URL_PARAM]: selectedTx, [UTXO_URL_PARAM]: selectedUtxo } =
    searchParams || {};

  useEffect(() => {
    // Remove URL params when reloading the page
    replace(ROUTES.GRAPHER);
  }, [replace]);

  return (
    <Suspense fallback={<Loading />}>
      <div className="relative h-dvh w-full overflow-hidden">
        <div className="absolute w-full">
          <Header />
        </div>
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
    </Suspense>
  );
}
