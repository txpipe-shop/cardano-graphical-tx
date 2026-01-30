"use client"
import { Button } from "@heroui/react";
import { useConfigs } from "~/app/_contexts";

export const ThemeButton = () => {
  const { configs, updateConfigs } = useConfigs();

  const toggleTheme = () => {
    console.log("Click")
    updateConfigs("theme", configs.theme === "light" ? "dark" : "light");
  };

  return (
    <Button
      variant="flat"
      className="p-5 font-mono text-lg shadow-md"
      isIconOnly
      onPress={toggleTheme}
    >
      {configs.theme === "dark" ? "☀️" : "🌙"}
    </Button>
  );
};