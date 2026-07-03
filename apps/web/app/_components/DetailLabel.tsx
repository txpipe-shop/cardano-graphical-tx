export interface DetailLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function DetailLabel({ children, className }: DetailLabelProps) {
  return (
    <p
      className={`text-xs font-semibold uppercase tracking-wide text-p-secondary mb-1.5 ${className ?? ""}`}
    >
      {children}
    </p>
  );
}
