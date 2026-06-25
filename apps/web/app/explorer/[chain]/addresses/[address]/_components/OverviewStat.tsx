export function OverviewStat({
  label,
  children,
}: Readonly<{ label: string; children?: React.ReactNode }>) {
  return (
    <div className="rounded-lg border-2 border-dashed border-border bg-background p-4 shadow-md">
      <div className="text-xs font-medium text-p-secondary">{label}</div>
      <div className="mt-2 text-sm leading-relaxed text-p-primary">
        {children}
      </div>
    </div>
  );
}
