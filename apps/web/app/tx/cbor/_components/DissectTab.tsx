"use client";

import { DissectSection } from "~/app/_components";
import type { IGraphicalTransaction } from "~/app/_interfaces";

interface DissectTabProps {
  tx: IGraphicalTransaction | null;
  error: string | null;
  isLoading: boolean;
}

export function DissectTab({ tx, error, isLoading }: DissectTabProps) {
  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center text-p-secondary">
        Loading...
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <p className="break-words whitespace-pre-wrap text-center text-red-2">
          {error}
        </p>
      </div>
    );
  }
  if (tx) {
    return (
      <div className="flex-1 min-h-0 overflow-auto">
        <DissectSection tx={tx} />
      </div>
    );
  }
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <p className="text-center text-p-secondary">
        Enter a transaction hash and click Fetch, or paste CBOR into the editor
      </p>
    </div>
  );
}
