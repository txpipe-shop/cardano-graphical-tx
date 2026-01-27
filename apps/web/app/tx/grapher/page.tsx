"use client";
import {
  Header,
  InfoPanel,
  Playground,
  TxInfo,
  TxInput,
  UtxoInfo,
} from "~/app/_components";
import { useUI } from "~/app/_contexts";
import { TX_URL_PARAM, UTXO_URL_PARAM } from "~/app/_utils";
import Loading from "~/app/loading";
import { useTransactionLoader } from "~/app/_hooks/useTransactionLoader";

interface GrapherProps {
  searchParams?: {
    [TX_URL_PARAM]?: string;
    [UTXO_URL_PARAM]?: string;
  };
}

export default function Index({ searchParams }: GrapherProps) {
  useTransactionLoader();

  const { loading } = useUI();
  const { [TX_URL_PARAM]: selectedTx, [UTXO_URL_PARAM]: selectedUtxo } =
    searchParams || {};

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
