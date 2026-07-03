import type { PropsWithChildren } from "react";

export interface FieldBlockProps {
  className?: string;
}

export function FieldBlock({
  className = "",
  children,
}: PropsWithChildren<FieldBlockProps>) {
  return (
    <div
      className={`rounded border border-border/50 bg-explorer-row/30 px-field py-field ${className}`}
    >
      {children}
    </div>
  );
}
