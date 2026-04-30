import { Card, CardBody } from "@heroui/react";

function SkeletonBar({ className = "" }: { className?: string }) {
  return <div className={`rounded bg-explorer-row ${className}`} aria-hidden />;
}

function UTxOsColumnSkeleton({ title }: { title: string }) {
  return (
    <div>
      <h4 className="semibold mb-2 text-sm text-p-secondary">{title}</h4>
      <div className="space-y-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div className="rounded-lg bg-explorer-row p-2" key={i}>
            <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center md:justify-between">
              <SkeletonBar className="h-4 w-20" />
              <SkeletonBar className="h-4 w-40" />
              <SkeletonBar className="h-4 w-32" />
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <SkeletonBar className="h-5 w-16" />
              <SkeletonBar className="h-5 w-12" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TxRowSkeleton() {
  return (
    <Card className="mb-4 border-2 border-dashed border-border shadow-md bg-background">
      <CardBody className="p-0">
        <div className="flex flex-col gap-3 bg-explorer-row p-4 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-4">
          <SkeletonBar className="h-5 w-72 max-w-full" />
          <SkeletonBar className="h-4 w-28" />
          <SkeletonBar className="h-4 w-32" />
          <div className="flex gap-2">
            <SkeletonBar className="h-8 w-16" />
            <SkeletonBar className="h-8 w-16" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
          <UTxOsColumnSkeleton title="Inputs" />
          <UTxOsColumnSkeleton title="Outputs" />
        </div>
      </CardBody>
    </Card>
  );
}

export function TxTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse space-y-4" aria-busy aria-live="polite">
      {Array.from({ length: rows }).map((_, i) => (
        <TxRowSkeleton key={i} />
      ))}
    </div>
  );
}
