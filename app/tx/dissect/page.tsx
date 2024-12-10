"use client";

import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { DissectSection, Error, Header, TxInput } from "~/app/_components";
import { useGraphical, useUI } from "~/app/_contexts";
import { isEmpty, ROUTES } from "~/app/_utils";
import Loading from "~/app/loading";

export default function Index() {
  const { transactions } = useGraphical();
  const { error } = useUI();
  const router = useRouter();
  if (isEmpty(error) && !transactions.transactions[0]) router.push(ROUTES.TX);
  return (
    <div>
      <Header />
      <TxInput />
      <Suspense fallback={<Loading />}>
        {!isEmpty(error) ? (
          <Error action="dissecting" />
        ) : (
          transactions.transactions[0] && (
            <DissectSection tx={transactions.transactions[0]} />
          )
        )}
      </Suspense>
    </div>
  );
}
