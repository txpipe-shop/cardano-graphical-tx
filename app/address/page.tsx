"use client";

import { Suspense } from "react";
import { Header, AddressInput } from "~/app/_components";
import Loading from "~/app/loading";

import { ExamplesAddress } from "../_components/Examples";

export default function Index() {
  return (
    <div>
      <Header />
      {/* <AddressInput /> */}
      <Suspense fallback={<Loading />}>
        <div className="flex h-full w-full flex-col items-center justify-center">
          <div className="w-2/3 text-center">
            <ExamplesAddress />
          </div>
        </div>
      </Suspense>
    </div>
  );
}
