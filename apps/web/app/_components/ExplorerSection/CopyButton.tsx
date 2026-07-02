"use client";
import { Tooltip } from "@heroui/react";
import { memo } from "react";
import toast from "react-hot-toast";
import CopyIcon from "./Icons/CopyIcon";

export interface CopyButtonProps {
  text: string;
  size: number;
}
export default memo(function CopyButton({ text, size }: CopyButtonProps) {
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
        className="relative ml-1 text-p-secondary transition-colors hover:text-p-primary text-wrap"
        aria-label={`Copy ${text}`}
      >
        <span className="absolute inset-0 -m-3" aria-hidden />
        <CopyIcon size={size} />
      </button>
    </Tooltip>
  );
});
