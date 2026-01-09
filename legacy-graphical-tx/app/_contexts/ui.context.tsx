"use client";
import type { Dispatch, SetStateAction } from "react";
import { createContext, useContext, useState } from "react";

interface IUIContext {
  error: string;
  setError: Dispatch<SetStateAction<string>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

const UIContext = createContext<IUIContext>({
  error: "",
  setError: () => {},
  loading: false,
  setLoading: () => {},
});

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error("useUI must be used within a UIProvider");
  return context;
};

export const UIProvider = ({ children }: { children: React.ReactNode }) => {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <UIContext.Provider value={{ error, setError, loading, setLoading }}>
      {children}
    </UIContext.Provider>
  );
};
