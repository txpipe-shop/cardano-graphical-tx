import type { PropsWithChildren } from "react";

export interface MonoValueProps {
  size?: "sm" | "xs";
  className?: string;
}

export function MonoValue({
  size = "sm",
  className = "",
  children,
}: PropsWithChildren<MonoValueProps>) {
  const sizeClass = size === "sm" ? "text-sm" : "text-xs";
  return (
    <span className={`font-mono ${sizeClass} ${className}`}>{children}</span>
  );
}
