import type { Address } from "@laceanatomy/types";
import { type Network } from "@laceanatomy/types/cardano";
import Link from "next/link";
import DateViewer from "~/app/_components/ExplorerSection/DateViewer";
import { ROUTES } from "~/app/_utils/constants";
import { formatTxCount, loadAddressActivity, type SeenAt } from "../_utils";
import { OverviewStat } from "./OverviewStat";

function SeenAtView({
  chain,
  seen,
}: Readonly<{ chain: Network; seen?: SeenAt }>) {
  if (!seen) return <span className="text-p-secondary">—</span>;

  return (
    <div className="space-y-2">
      <div className="font-mono text-xs">
        Block{" "}
        <Link
          href={ROUTES.EXPLORER_BLOCK(chain, seen.blockHeight.toString())}
          className="hover:underline"
        >
          {seen.blockHeight.toString()}
        </Link>
      </div>
      <div className="font-mono text-xs">Slot {seen.slot.toString()}</div>
      {seen.timestamp !== undefined && (
        <DateViewer
          timestamp={seen.timestamp}
          className="text-xs text-p-secondary"
        />
      )}
    </div>
  );
}

export async function AddressActivityStats({
  chain,
  address,
}: Readonly<{ chain: Network; address: Address }>) {
  const activity = await loadAddressActivity(chain, address);

  return (
    <>
      <OverviewStat label="Transaction Count">
        {activity.error ? (
          <span className="text-p-secondary">{activity.error}</span>
        ) : (
          formatTxCount(activity)
        )}
      </OverviewStat>
      <OverviewStat label="First Seen">
        <SeenAtView chain={chain} seen={activity.firstSeen} />
      </OverviewStat>
      <OverviewStat label="Last Seen">
        <SeenAtView chain={chain} seen={activity.lastSeen} />
      </OverviewStat>
    </>
  );
}

export function AddressActivityStatsSkeleton() {
  return (
    <>
      {["Transaction Count", "First Seen", "Last Seen"].map((label) => (
        <OverviewStat key={label} label={label}>
          <span className="text-p-secondary">Loading...</span>
        </OverviewStat>
      ))}
    </>
  );
}
