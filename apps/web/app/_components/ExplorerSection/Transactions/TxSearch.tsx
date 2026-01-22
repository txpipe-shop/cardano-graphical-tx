"use client";

import { Button, Input } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ROUTES } from "~/app/_utils";
import { type ChainNetwork } from "../ChainSelector";

interface TxSearchProps {
  chain: ChainNetwork;
}

export function TxSearch({ chain }: TxSearchProps) {
  const [txHash, setTxHash] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    const trimmedHash = txHash.trim();
    if (trimmedHash.length === 0) return;

    router.push(ROUTES.EXPLORER_TX(chain, txHash));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex w-full gap-2">
      <Input
        placeholder="Search by transaction hash..."
        value={txHash}
        onChange={(e) => setTxHash(e.target.value)}
        onKeyDown={handleKeyDown}
        variant="bordered"
        classNames={{
          inputWrapper: "border-2 border-dashed border-gray-300 shadow-md ",
        }}
      />
      <Button
        variant="flat"
        className="font-mono shadow-md"
        onPress={handleSearch}
      >
        Search
      </Button>
    </div>
  );
}
