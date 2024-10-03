"use client";

import { DissectSection, Error, Header, Loading } from "../_components";
import { useGraphical, useUI } from "../_contexts";
import { isEmpty } from "../_utils";

export default function Index() {
  const { transactions } = useGraphical();
  const { loading, error } = useUI();
  return (
    <div>
      <Header />
      {!isEmpty(error) ? (
        <Error action="dissecting" />
      ) : loading ? (
        <Loading />
      ) : transactions.transactions[0] ? (
        <DissectSection tx={transactions.transactions[0]} />
      ) : (
        <></>
      )}
    </div>
  );
}
