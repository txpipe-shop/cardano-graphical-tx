"use client";

import { useEffect } from "react";
import { Examples } from "~/app/_components";
import { useConfigs } from "~/app/_contexts";

export default function Index() {
  const { updateConfigs } = useConfigs()

  useEffect(() => {
    updateConfigs("query", "");
  }, []);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="w-2/3 text-center">
        <Examples showTxExamples />
      </div>
    </div>
  );
}

