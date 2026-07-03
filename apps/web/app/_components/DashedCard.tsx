import type { PropsWithChildren } from "react";

export interface DashedCardProps {
  shadow?: boolean;
  bg?: "surface" | "background";
  className?: string;
}

export function DashedCard({
  shadow = true,
  bg = "surface",
  className = "",
  children,
}: PropsWithChildren<DashedCardProps>) {
  const shadowClass = shadow ? "shadow-md" : "shadow-none";
  const bgClass = bg === "surface" ? "bg-surface" : "bg-background";

  return (
    <div
      className={`rounded-lg border-2 border-dashed border-border ${shadowClass} ${bgClass} p-card ${className}`}
    >
      {children}
    </div>
  );
}
