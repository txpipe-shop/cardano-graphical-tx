"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Header, InfoPanel, Playground, TxInfo } from "./_components";
import { ROUTES, TX_URL_PARAM } from "./_utils";

interface HomeProps {
  searchParams?: {
    [TX_URL_PARAM]?: string;
  };
}
export default function Index({ searchParams }: HomeProps) {
  const { replace } = useRouter();
  const { [TX_URL_PARAM]: selectedTx } = searchParams || {};

  useEffect(() => {
    // Remove URL params when reloading the page
    replace(ROUTES.HOME);
  }, [replace]);
  return (
    <div className="overflow-hidden">
      <InfoPanel
        isVisible={selectedTx !== undefined}
        from="left"
        title="TX Information"
      >
        <TxInfo />
      </InfoPanel>
      <Playground />
      <Header />
    </div>
  );
}
