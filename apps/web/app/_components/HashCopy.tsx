"use client";

import CopyButton from "./ExplorerSection/CopyButton";

export interface HashCopyProps {
  hash: string;
  length?: number;
  copySize?: number;
}

export function HashCopy({ hash, length = 8, copySize = 14 }: HashCopyProps) {
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
