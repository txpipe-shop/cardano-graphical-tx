export interface SkeletonBarProps {
  className?: string;
}

export function SkeletonBar({ className = "" }: SkeletonBarProps) {
  return <div className={`rounded bg-explorer-row ${className}`} aria-hidden />;
}
