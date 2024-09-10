"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Header,
  InfoPanel,
  Loading,
  Playground,
  TxInfo,
  UtxoInfo,
} from "./_components";
import { useGraphical } from "./_contexts";
import { ROUTES, TX_URL_PARAM, UTXO_URL_PARAM } from "./_utils";

interface HomeProps {
  searchParams?: {
    [TX_URL_PARAM]?: string;
    [UTXO_URL_PARAM]?: string;
  };
}
export default function Index({ searchParams }: HomeProps) {
  const { replace } = useRouter();
  const { [TX_URL_PARAM]: selectedTx, [UTXO_URL_PARAM]: selectedUtxo } =
    searchParams || {};
  const { loading } = useGraphical();

  useEffect(() => {
    // Remove URL params when reloading the page
    replace(ROUTES.HOME);
  }, [replace]);
  return (
    <div className="overflow-hidden">
      {loading ? (
        <Loading />
      ) : (
        <>
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
        </>
      )}
      <Header />
    </div>
  );
}
