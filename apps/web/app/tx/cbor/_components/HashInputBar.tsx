"use client";

import { Button, Input } from "@heroui/react";
import { NetworkSelector } from "./NetworkSelector";

interface HashInputBarProps {
  hashInput: string;
  onHashInputChange: (value: string) => void;
  onFetch: () => void;
  isFetching: boolean;
}

export function HashInputBar({
  hashInput,
  onHashInputChange,
  onFetch,
  isFetching,
}: HashInputBarProps) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <NetworkSelector />
      <Input
        value={hashInput}
        onValueChange={onHashInputChange}
        placeholder="Transaction hash..."
        variant="bordered"
        className="flex-1"
        size="sm"
      />
      <Button
        variant="flat"
        className="shrink-0 font-mono shadow-md"
        size="sm"
        onPress={onFetch}
        isLoading={isFetching}
      >
        Fetch
      </Button>
    </div>
  );
}
