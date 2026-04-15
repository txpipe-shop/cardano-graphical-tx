"use client";
import { Tooltip } from "@heroui/react";
import toast from "react-hot-toast";
import CopyIcon from "./Icons/CopyIcon";

export interface CopyButtonProps {
  text: string;
  size: number;
}
export default function CopyButton({ text, size }: CopyButtonProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() =>
      toast(`Copied ${text}`, { style: { fontSize: "1rem", maxWidth: "700px", wordBreak: "break-all" } }),
    );
  };

  return (
    <Tooltip content="Copy to clipboard">
      <button
        onClick={handleCopy}
        className="ml-1 text-gray-400 transition-colors hover:text-gray-600 text-wrap"
      >
        <CopyIcon size={size} />
      </button>
    </Tooltip>
  );
}
