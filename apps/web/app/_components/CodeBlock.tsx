import type { PropsWithChildren } from "react";

export interface CodeBlockProps {
  size?: "sm" | "xs";
  maxHeight?: "60" | "96";
  className?: string;
}

export function CodeBlock({
  size = "sm",
  maxHeight = "96",
  className = "",
  children,
}: PropsWithChildren<CodeBlockProps>) {
  const sizeClass = size === "xs" ? "text-xs p-3" : "text-sm p-4";
  const maxHeightClass = `max-h-${maxHeight}`;

  return (
    <pre
      className={`${sizeClass} font-mono text-p-primary whitespace-pre-wrap break-all overflow-x-auto ${maxHeightClass} overflow-y-auto border border-border bg-explorer-row/30 rounded ${className}`}
    >
      {children}
    </pre>
  );
}
