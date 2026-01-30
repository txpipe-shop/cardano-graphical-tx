"use client";
import { useSearchParams } from "next/navigation";
import {
  Header,
  InfoPanel,
  Playground,
  TxInfo,
  TxInput,
  UtxoInfo,
} from "~/app/_components";
import { useUI } from "~/app/_contexts";
import { useTransactionLoader } from "~/app/_hooks/useTransactionLoader";
import { TX_URL_PARAM, UTXO_URL_PARAM } from "~/app/_utils";
import Loading from "~/app/loading";

export default function Index() {
  useTransactionLoader();

  const { loading } = useUI();
  const searchParams = useSearchParams();
  const selectedTx = searchParams?.get(TX_URL_PARAM) || undefined;
  const selectedUtxo = searchParams?.get(UTXO_URL_PARAM) || undefined;

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
