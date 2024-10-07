"use client";

import { Suspense } from "react";
import { DissectSection, Error, Header } from "../_components";
import { useGraphical, useUI } from "../_contexts";
import { isEmpty } from "../_utils";
import Loading from "../loading";

export default function Index() {
  const { transactions } = useGraphical();
  const { error } = useUI();
  return (
    <div>
      <Header />
      <Suspense fallback={<Loading />}>
        {!isEmpty(error) ? (
          <Error action="dissecting" />
        ) : transactions.transactions[0] ? (
          <DissectSection tx={transactions.transactions[0]} />
        ) : (
          <></>
        )}
      </Suspense>
    </div>
  );
}
