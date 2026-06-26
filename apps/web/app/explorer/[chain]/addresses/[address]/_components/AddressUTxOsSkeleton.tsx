export function AddressUTxOsSkeleton() {
  return (
    <div className="animate-pulse space-y-3" aria-busy aria-live="polite">
      {Array.from({ length: 3 }, (_, i) => i + 1).map((id) => (
        <div
          key={`utxos-skeleton-${id}`}
          className="rounded-lg border-2 border-dashed border-border bg-surface p-4 shadow-md"
        >
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="h-4 w-56 rounded bg-explorer-row" />
            <div className="h-4 w-28 rounded bg-explorer-row" />
            <div className="h-4 w-20 rounded bg-explorer-row" />
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <div className="h-5 w-24 rounded bg-explorer-row" />
            <div className="h-5 w-20 rounded bg-explorer-row" />
          </div>
        </div>
      ))}
    </div>
  );
}
