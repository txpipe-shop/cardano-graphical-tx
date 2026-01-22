"use client";
import { Tooltip } from "@heroui/react";
import CopyIcon from "./Icons/CopyIcon";

export interface CopyButtonProps {
  text: string;
  size: number;
}
export default function CopyButton({ text, size }: CopyButtonProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Tooltip content="Copy to clipboard">
      <button
        onClick={handleCopy}
        className="ml-1 text-gray-400 transition-colors hover:text-gray-600"
      >
        <CopyIcon size={size} />
      </button>
    </Tooltip>
  );
}
