import { Unit } from "@laceanatomy/types";
import { type Network } from "@laceanatomy/types/cardano";
import TransactionsTab from "~/app/_components/ExplorerSection/Tokens/TransactionsTab";
import { loadTokenTxs } from "../_utils";

interface AssetTxListProps {
  chain: Network;
  unit: string;
  page: number;
}

export async function AssetTxList({
  chain,
  unit,
  page,
}: Readonly<AssetTxListProps>) {
  const { transactions, hasMoreTransactions } = await loadTokenTxs(
    chain,
    unit,
    page,
  );

  return (
    <TransactionsTab
      transactions={transactions}
      chain={chain}
      unit={Unit(unit)}
      hasMoreTransactions={hasMoreTransactions}
    />
  );
}
