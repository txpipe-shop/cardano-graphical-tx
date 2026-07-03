import { Card } from "@heroui/react";
import type { PropsWithChildren } from "react";

export interface InfoPanelRowProps {
  direction?: "row" | "col";
  justify?: "between" | "start" | "center" | "end" | "around";
  gap?: boolean;
  className?: string;
}

export function InfoPanelRow({
  direction = "row",
  justify = "start",
  gap = false,
  className = "",
  children,
}: PropsWithChildren<InfoPanelRowProps>) {
  const directionClass = direction === "col" ? "flex-col" : "flex-row";
  const justifyClass = `justify-${justify}`;
  const gapClass = gap ? "gap-2" : "";

  return (
    <Card
      className={`flex ${directionClass} ${justifyClass} ${gapClass} bg-surface px-5 py-2 shadow-none ${className}`}
    >
      {children}
    </Card>
  );
}
