"use client";

import { Examples, Header, TxInput } from "~/app/_components";
import { useUI } from "~/app/_contexts";
import Loading from "~/app/loading";

export default function Index() {
  const { loading } = useUI();
  if (loading) return <Loading />;
  return (
    <div>
      <Header />
      <TxInput />
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="w-2/3 text-center">
          <Examples />
        </div>
      </div>
    </div>
  );
}
