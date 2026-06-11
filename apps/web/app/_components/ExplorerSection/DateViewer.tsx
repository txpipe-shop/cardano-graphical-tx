type DateViewerProps = Readonly<{
  timestamp?: number;
  unit?: "seconds" | "milliseconds";
  className?: string;
}>;

function toDate(timestamp: number, unit: "seconds" | "milliseconds") {
  return new Date(unit === "seconds" ? timestamp * 1000 : timestamp);
}

function formatAge(date: Date): string {
  const now = new Date();

  let months = (now.getFullYear() - date.getFullYear()) * 12;
  months += now.getMonth() - date.getMonth();

  let days = now.getDate() - date.getDate();
  if (days < 0) {
    months -= 1;
    const previousMonthDays = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
    ).getDate();
    days += previousMonthDays;
  }

  const safeMonths = Math.max(months, 0);
  const safeDays = Math.max(days, 0);

  return `${safeMonths}mo ${safeDays}d ago`;
}

export default function DateViewer({
  timestamp,
  unit = "seconds",
  className,
}: DateViewerProps) {
  if (timestamp === undefined) {
    return <span className={className}>-</span>;
  }

  const date = toDate(timestamp, unit);

  return (
    <span className={className} title={formatAge(date)}>
      {date.toLocaleString(undefined, { hour12: false })}
    </span>
  );
}
