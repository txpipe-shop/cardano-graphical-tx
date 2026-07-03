"use client";

import CopyButton from "~/app/_components/ExplorerSection/CopyButton";

export interface HashDisplayProps {
  hash: string;
  length?: number;
  copySize?: number;
}

export function HashDisplay({
  hash,
  length = 8,
  copySize = 14,
}: HashDisplayProps) {
  const truncated =
    hash.length > length * 2
      ? `${hash.slice(0, length)}…${hash.slice(-length)}`
      : hash;

  return (
    <div className="flex items-center gap-1">
      <span className="font-mono text-sm">{truncated}</span>
      <CopyButton text={hash} size={copySize} />
    </div>
  );
}
