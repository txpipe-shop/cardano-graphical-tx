"use client";

import { Button } from "@heroui/react";
import { Header } from "~/app/_components";
import { DetailTabs } from "~/app/_components/DetailTabs";
import CborView from "~/app/_components/CborView";
import { DissectTab } from "./_components/DissectTab";
import { HashInputBar } from "./_components/HashInputBar";
import { ValidationTab } from "./_components/ValidationTab";
import { useCborPageState } from "./_hooks/useCborPageState";

export default function CborPage() {
  const s = useCborPageState();

  const tabs = [
    {
      key: "dissect",
      title: "Dissect",
      content: (
        <DissectTab
          tx={s.parsedTx}
          error={s.parseError}
          isLoading={s.isLoading}
        />
      ),
    },
    {
      key: "validation",
      title: "Validation",
      content: (
        <ValidationTab
          result={s.validationResult}
          error={s.validationError}
          isLoading={s.validationLoading}
          onRun={s.handleValidate}
          cbor={s.currentCbor}
        />
      ),
    },
    {
      key: "diagram",
      title: "Diagram",
      content: <div className="flex flex-1 items-center justify-center p-6" />,
    },
  ];

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-5 md:overflow-hidden">
        <HashInputBar
          hashInput={s.hashInput}
          onHashInputChange={s.setHashInput}
          onFetch={s.handleFetch}
          isFetching={s.isFetching}
        />

        <div className="flex flex-1 flex-col gap-4 overflow-hidden md:min-h-0 md:flex-row">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <CborView
              cbor={s.initialCbor ?? ""}
              onCborChange={s.setCurrentCbor}
            />
            <div className="flex shrink-0 justify-center pt-2">
              <Button
                size="sm"
                variant="flat"
                className="font-mono shadow-md"
                onPress={s.handleParseCbor}
                isDisabled={!s.currentCbor.trim()}
              >
                CBOR → Transaction
              </Button>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-border bg-surface p-4">
            <DetailTabs
              tabs={tabs}
              defaultTab="dissect"
              activeTab={s.activeTab}
              onTabChange={s.setActiveTab}
              ariaLabel="Transaction analysis"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
