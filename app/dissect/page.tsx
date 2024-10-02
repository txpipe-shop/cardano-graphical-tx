"use client";

import { DissectSection, Header, Loading } from "../_components";
import { useGraphical, useUI } from "../_contexts";
import { isEmpty } from "../_utils";

export default function Index() {
  const { transactions } = useGraphical();
  const { loading, error } = useUI();
  return (
    <>
      <Header />
      {!isEmpty(error) ? (
        <div className="flex h-screen flex-col gap-3 p-10 pt-32 text-center">
          Dissect Error: {error}
        </div>
      ) : loading ? (
        <div>
          <Loading />
        </div>
      ) : transactions.transactions[0] ? (
        <DissectSection tx={transactions.transactions[0]} />
      ) : (
        <div>Look for tx</div>
      )}
    </>
  );
}
