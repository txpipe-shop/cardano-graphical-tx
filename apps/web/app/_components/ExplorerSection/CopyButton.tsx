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
      toast(`Copied ${text}`, {
        style: {
          fontSize: "1rem",
          maxWidth: "700px",
          wordBreak: "break-all",
        },
      }),
    );
  };

  return (
    <Tooltip content="Copy to clipboard">
      <button
        onClick={handleCopy}
        className="relative ml-1 text-gray-400 transition-colors hover:text-gray-600 text-wrap"
      >
        <span className="absolute inset-0 -m-3" aria-hidden />
        <CopyIcon size={size} />
      </button>
    </Tooltip>
  );
}
