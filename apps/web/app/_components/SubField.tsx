export interface SubFieldProps {
  label: string;
  value?: string;
  mono?: boolean;
}

export function SubField({ label, value, mono }: SubFieldProps) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs text-p-secondary">{label}</p>
      <p className={`text-sm break-all ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}
