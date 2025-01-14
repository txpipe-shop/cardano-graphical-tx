"use client";

import { DissectSection, Error, Header, TxInput } from "~/app/_components";
import { useConfigs, useGraphical, useUI } from "~/app/_contexts";
import { isEmpty } from "~/app/_utils";
import Loading from "~/app/loading";

export default function Index() {
  const { transactions } = useGraphical();
  const { error, loading } = useUI();
  const { configs } = useConfigs();

  if (loading) return <Loading />;
  return (
    <div>
      <Header />
      <TxInput />

      {!isEmpty(error) ? (
        <Error action="dissecting" goal="transaction" option={configs.option} />
      ) : (
        transactions.transactions[0] && (
          <DissectSection tx={transactions.transactions[0]} />
        )
      )}
    </div>
  );
}
