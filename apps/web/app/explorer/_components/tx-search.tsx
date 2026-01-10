"use client";

import { Button, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface TxSearchProps {
  chain: string;
}

export function TxSearch({ chain }: TxSearchProps) {
  const [txHash, setTxHash] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    const trimmedHash = txHash.trim();
    if (trimmedHash.length === 0) return;

    router.push(`/tx/dissect?tx=${trimmedHash}&chain=${chain}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex w-full max-w-md gap-2">
      <Input
        placeholder="Search by transaction hash..."
        value={txHash}
        onChange={(e) => setTxHash(e.target.value)}
        onKeyDown={handleKeyDown}
        variant="bordered"
        classNames={{
          inputWrapper: "border-2 border-dashed border-gray-300 shadow-md",
        }}
      />
      <Button
        variant="flat"
        className="font-mono shadow-md"
        onClick={handleSearch}
      >
        Search
      </Button>
    </div>
  );
}
