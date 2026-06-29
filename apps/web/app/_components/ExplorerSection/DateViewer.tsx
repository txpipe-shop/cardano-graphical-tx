import { format, formatDistanceToNow, fromUnixTime } from "date-fns";

type DateViewerProps = Readonly<{
  timestamp?: number;
  unit?: "seconds" | "milliseconds";
  className?: string;
}>;

export default function DateViewer({
  timestamp,
  unit = "seconds",
  className,
}: DateViewerProps) {
  if (timestamp === undefined) {
    return <span className={className}>-</span>;
  }

  const date =
    unit === "seconds" ? fromUnixTime(timestamp) : new Date(timestamp);

  return (
    <span
      className={className}
      title={formatDistanceToNow(date, { addSuffix: true })}
    >
      {format(date, "PPpp")}
    </span>
  );
}
