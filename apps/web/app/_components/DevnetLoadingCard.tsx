import { Card, CardBody } from "@heroui/react";

export interface DevnetLoadingCardProps {
  message: string;
  className?: string;
}

export function DevnetLoadingCard({
  message,
  className = "",
}: DevnetLoadingCardProps) {
  return (
    <Card
      className={`w-full border-2 border-dashed border-border shadow-md bg-surface ${className}`}
    >
      <CardBody className="py-8 text-center text-p-secondary">
        {message}
      </CardBody>
    </Card>
  );
}
