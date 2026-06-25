import { format, formatDistanceToNow, fromUnixTime } from "date-fns";

type DateViewerProps = Readonly<{
  timestamp?: number;
  unit?: "seconds" | "milliseconds";
  className?: string;
}>;

function toDate(timestamp: number, unit: "seconds" | "milliseconds") {
  return unit === "seconds" ? fromUnixTime(timestamp) : new Date(timestamp);
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
    <span
      className={className}
      title={formatDistanceToNow(date, { addSuffix: true })}
    >
      {format(date, "PPpp")}
    </span>
  );
}
