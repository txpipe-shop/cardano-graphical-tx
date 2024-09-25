"use client";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { createContext, useContext } from "react";
import { useLocalStorage } from "../_hooks/useLocalStorage";
import { NETWORK, OPTIONS } from "../_utils";

export interface IUserConfigs {
  net: NETWORK;
  option: OPTIONS;
  query: string;
}

const LOCAL_STORAGE_KEYS = {
  USER_CONFIGS: "userConfigs",
} as const;

export const ConfigsContext = createContext({
  configs: {} as IUserConfigs,
  updateConfigs: <T extends keyof IUserConfigs>(
    _configKey: T,
    _value: IUserConfigs[T],
  ) => {},
});

export const useConfigs = () => {
  const context = useContext(ConfigsContext);
  if (!context)
    throw new Error("useConfigs must be used within a ConfigsProvider");
  return context;
};

export const ConfigsProvider = ({ children }: { children: ReactNode }) => {
  const initialState: IUserConfigs = {
    net: NETWORK.MAINNET,
    option: OPTIONS.CBOR,
    query: "",
  };
  const [configs, setConfigs] = useLocalStorage({
    key: LOCAL_STORAGE_KEYS.USER_CONFIGS,
    initialState,
  }) as [IUserConfigs, Dispatch<SetStateAction<IUserConfigs>>];

  const updateConfigs = <T extends keyof IUserConfigs>(
    configKey: T,
    value: IUserConfigs[T],
  ) => {
    setConfigs({ ...configs, [configKey]: value });
  };

  return (
    <ConfigsContext.Provider value={{ configs, updateConfigs }}>
      {children}
    </ConfigsContext.Provider>
  );
};
