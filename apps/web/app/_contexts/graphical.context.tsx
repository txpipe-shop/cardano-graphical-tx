"use client";
import type { Dispatch, SetStateAction } from "react";
import { createContext, useContext, useMemo, useState } from "react";
import type { TransactionsBox } from "~/app/_interfaces";

interface IGraphicalContext {
  transactions: TransactionsBox;
  setTransactionBox: Dispatch<SetStateAction<TransactionsBox>>;
  dimensions: { width: number; height: number };
  setDimensions: Dispatch<SetStateAction<{ width: number; height: number }>>;
}

const GraphicalContext = createContext<IGraphicalContext>({
  transactions: {
    transactions: [],
    utxos: {},
  },
  setTransactionBox: () => { },
  dimensions: { width: 0, height: 0 },
  setDimensions: () => { },
});

export const useGraphical = () => {
  const context = useContext(GraphicalContext);
  if (!context)
    throw new Error("useGraphical must be used within a GraphicalProvider");
  return context;
};

export const GraphicalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [transactionBox, setTransactionBox] = useState<TransactionsBox>({
    transactions: [],
    utxos: {},
  });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const value = useMemo(
    () => ({
      transactions: transactionBox,
      setTransactionBox,
      dimensions,
      setDimensions,
    }),
    [transactionBox, dimensions],
  );

  return (
    <GraphicalContext.Provider value={value}>
      {children}
    </GraphicalContext.Provider>
  );
};
