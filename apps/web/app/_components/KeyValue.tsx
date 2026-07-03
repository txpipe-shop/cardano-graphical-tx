import type { PropsWithChildren } from "react";

export interface KeyValueProps {
  label: string;
  mono?: boolean;
  colon?: boolean;
}

export function KeyValue({
  label,
  mono = false,
  colon = true,
  children,
}: PropsWithChildren<KeyValueProps>) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <span className="shrink-0 text-sm font-bold text-p-secondary">
        {label}
        {colon ? ":" : ""}
      </span>
      <span className={`min-w-0 break-all text-sm ${mono ? "font-mono" : ""}`}>
        {children}
      </span>
    </div>
  );
}
