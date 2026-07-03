export interface EmptyStateProps {
  message: string;
  className?: string;
}

export function EmptyState({ message, className = "" }: EmptyStateProps) {
  return (
    <div
      className={`rounded-lg border-2 border-dashed border-border bg-surface p-8 text-center text-sm text-p-secondary shadow-md ${className}`}
    >
      {message}
    </div>
  );
}
