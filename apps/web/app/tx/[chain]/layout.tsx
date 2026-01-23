"use client";

import { redirect, useParams } from "next/navigation";
import { useEffect } from "react";
import { Header, TxInput } from "~/app/_components";
import { useConfigs } from "~/app/_contexts";
import { ROUTES, USER_CONFIGS } from "~/app/_utils";
import { isValidChain, mapChainToNetwork } from "~/app/_utils/network";

export default function ChainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { chain } = useParams();
  const { configs, updateConfigs } = useConfigs();

  useEffect(() => {
    if (isValidChain(chain)) {
      const network = mapChainToNetwork(chain);
      updateConfigs(USER_CONFIGS.NET, network);
    } else {
      redirect(ROUTES.TX(configs.net));
    }
  }, [chain]);

  return (
    <div>
      <Header />
      <TxInput />
      {children}
    </div>
  );
}

