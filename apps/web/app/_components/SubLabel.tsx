import type { PropsWithChildren } from "react";

export interface SubLabelProps {
  size?: "sm" | "xs";
  className?: string;
}

export function SubLabel({
  size = "xs",
  className = "",
  children,
}: PropsWithChildren<SubLabelProps>) {
  const sizeClass = size === "sm" ? "text-sm" : "text-xs";
  return (
    <span className={`${sizeClass} text-p-secondary ${className}`}>
      {children}
    </span>
  );
}
