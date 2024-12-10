"use client";

import { Suspense } from "react";
import { Header, PropBlock } from "~/app/_components";
import Loading from "~/app/loading";

export default function Index() {
  return (
    <div>
      <Header />
      <Suspense fallback={<Loading />}>
        <div className="p-5">
          <div className="text-center text-6xl">Address</div>
          <PropBlock title="Coming soon" value="COmiNg SoOn" color="green" />
        </div>
      </Suspense>
    </div>
  );
}
