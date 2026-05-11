export function formatAda(lovelace?: number): string {
  if (lovelace === undefined || lovelace === null) return "0.000000";
  return (lovelace / 1_000_000).toFixed(6);
}
