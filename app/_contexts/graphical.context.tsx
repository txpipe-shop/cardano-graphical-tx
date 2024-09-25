"use client";
import type { Dispatch, SetStateAction } from "react";
import { createContext, useContext, useState } from "react";
import type { TransactionsBox } from "../_interfaces";

export interface IGraphicalContext {
  transactions: TransactionsBox;
  setTransactionBox: Dispatch<SetStateAction<TransactionsBox>>;
}

export const GraphicalContext = createContext<IGraphicalContext>({
  transactions: {
    transactions: [],
    utxos: {},
  },
  setTransactionBox: () => {},
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
  return (
    <GraphicalContext.Provider
      value={{
        transactions: transactionBox,
        setTransactionBox,
      }}
    >
      {children}
    </GraphicalContext.Provider>
  );
};
