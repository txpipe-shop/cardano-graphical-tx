"use client";

import { Button } from "@heroui/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const ThemeButton = () => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // This solution avoid 2 hydration errors
  // TODO: find a better solution
  if (!mounted) {
    return (
      <Button
        variant="flat"
        className="p-5 font-mono text-lg shadow-md"
        isIconOnly
        isDisabled
      >
        ◯
      </Button>
    );
  }

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