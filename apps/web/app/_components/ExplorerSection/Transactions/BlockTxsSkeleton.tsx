import { Card, CardBody } from "@heroui/react";

function SkeletonBar({ className = "" }: { className?: string }) {
  return <div className={`rounded bg-explorer-row ${className}`} aria-hidden />;
}

function BlockHeaderSkeleton() {
  return (
    <Card className="border-2 border-dashed border-border shadow-md bg-background">
      <CardBody className="p-4">
        <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-4">
          <SkeletonBar className="h-5 w-20" />
          <SkeletonBar className="h-4 w-36" />
          <SkeletonBar className="h-4 w-24" />
          <SkeletonBar className="h-4 w-28" />
        </div>
      </CardBody>
    </Card>
  );
}

export function BlockTxsSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse space-y-4" aria-busy aria-live="polite">
      {Array.from({ length: rows }).map((_, i) => (
        <BlockHeaderSkeleton key={i} />
      ))}
    </div>
  );
}
