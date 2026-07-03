import type { PropsWithChildren } from "react";

export interface MonoTextProps {
  size?: "sm" | "xs" | "base";
  className?: string;
}

export function MonoText({
  size = "sm",
  className = "",
  children,
}: PropsWithChildren<MonoTextProps>) {
  const sizeClass =
    size === "base" ? "text-base" : size === "sm" ? "text-sm" : "text-xs";
  return (
    <span className={`font-mono ${sizeClass} break-all ${className}`}>
      {children}
    </span>
  );
}
