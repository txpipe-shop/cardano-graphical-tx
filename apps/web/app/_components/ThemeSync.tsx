"use client";
import { useEffect } from "react";
import { useConfigs } from "~/app/_contexts";

export const ThemeSync = () => {
  const { configs } = useConfigs();

  useEffect(() => {
    const root = document.documentElement;
    if (configs.theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [configs.theme]);

  return null;
};