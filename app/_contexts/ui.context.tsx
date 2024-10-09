"use client";
import type { Dispatch, SetStateAction } from "react";
import { createContext, useContext, useState } from "react";

interface IUIContext {
  error: string;
  setError: Dispatch<SetStateAction<string>>;
}

const UIContext = createContext<IUIContext>({ error: "", setError: () => {} });

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error("useUI must be used within a UIProvider");
  return context;
};

export const UIProvider = ({ children }: { children: React.ReactNode }) => {
  const [error, setError] = useState<string>("");
  return (
    <UIContext.Provider value={{ error, setError }}>
      {children}
    </UIContext.Provider>
  );
};
