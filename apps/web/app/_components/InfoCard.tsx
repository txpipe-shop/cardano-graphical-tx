import { Card, CardBody, CardHeader } from "@heroui/react";
import type { PropsWithChildren } from "react";

export interface InfoCardProps {
  header?: React.ReactNode;
  border?: "solid" | "dashed";
  shadow?: boolean;
  bg?: "surface" | "background";
  className?: string;
}

export function InfoCard({
  header,
  border = "dashed",
  shadow = true,
  bg = "surface",
  className = "",
  children,
}: PropsWithChildren<InfoCardProps>) {
  const borderClass = border === "dashed" ? "border-2 border-dashed" : "border";
  const shadowClass = shadow ? "shadow-md" : "shadow-none";
  const bgClass = bg === "surface" ? "bg-surface" : "bg-background";

  return (
    <Card
      className={`${borderClass} border-border ${shadowClass} ${bgClass} ${className}`}
    >
      {header && (
        <CardHeader className="pb-2 font-semibold text-p-primary">
          {header}
        </CardHeader>
      )}
      <CardBody className={header ? "pt-0" : ""}>{children}</CardBody>
    </Card>
  );
}
