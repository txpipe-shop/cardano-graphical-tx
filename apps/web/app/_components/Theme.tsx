"use client";

import { Button } from "@heroui/react";
import { useTheme } from "next-themes";

export const ThemeButton = () => {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const currentTheme = resolvedTheme ?? theme ?? "light";
  const isDark = currentTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Button
      variant="flat"
      className="p-5 font-mono text-lg shadow-md"
      isIconOnly
      onPress={toggleTheme}
    >
      {isDark ? "☀️" : "🌙"}
    </Button>
  );
};