"use client";

import { Suspense } from "react";
import { Header, TxInput } from "../_components";
import Examples from "../examples";
import Loading from "../loading";

export default function Index() {
  return (
    <div>
      <Header />
      <TxInput />
      <Suspense fallback={<Loading />}>
        <div className="flex h-full w-full flex-col items-center justify-center">
          <div className="w-2/3 text-center">
            <Examples />
          </div>
        </div>
      </Suspense>
    </div>
  );
}
