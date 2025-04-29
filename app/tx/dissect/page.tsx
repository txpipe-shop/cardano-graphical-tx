"use client";

import { Tab, Tabs } from "@nextui-org/react";
import { DissectSection, Error, Header, TxInput } from "~/app/_components";
import { useConfigs, useGraphical, useUI } from "~/app/_contexts";
import { firstNChars, isEmpty, trimString } from "~/app/_utils";
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
        <div className="flex w-full flex-col">
          {transactions.transactions.length > 0 && (
            <Tabs
              aria-label="Options"
              classNames={{
                tabList: `gap-2 w-[10%] fixed right-2 top-[11.5rem] rounded-none m-3 p-3 rounded-xl border-2 border-b-8 border-black shadow shadow-black
        max-h-[20rem] max-h-[calc(100vw-12rem)] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300`,

                cursor: "bg-[#e6f1fe]",
                tab: "max-w-fit px-3 h-8",
                tabContent: "group-data-[selected=true]:text-[#006fee]",
                panel: "w-[calc(100vw-11.3rem)]",
              }}
              isVertical={true}
            >
              {transactions.transactions.map((tx) => (
                <Tab
                  key={tx.txHash}
                  title={
                    !isEmpty(tx.alias)
                      ? firstNChars(tx.alias, 12)
                      : trimString(tx.txHash, 6)
                  }
                >
                  <DissectSection tx={tx} key={tx.txHash} />
                </Tab>
              ))}
            </Tabs>
          )}
        </div>
      )}
    </div>
  );
}
