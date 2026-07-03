export interface DevnetErrorProps {
  title: string;
  error?: string | null;
  className?: string;
}

export function DevnetError({ title, error, className = "" }: DevnetErrorProps) {
  return (
    <div
      className={`rounded-lg border-2 border-dashed border-red-3 bg-red-50 p-8 text-center text-red-2 ${className}`}
    >
      <p className="font-semibold">{title}</p>
      {error ? <p className="mt-2 text-sm">{error}</p> : null}
    </div>
  );
}
