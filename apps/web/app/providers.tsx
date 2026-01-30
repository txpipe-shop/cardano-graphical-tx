import { HeroUIProvider } from "@heroui/react";
import { ThemeSync } from "./_components/ThemeSync";
import { ConfigsProvider, GraphicalProvider, UIProvider } from "./_contexts";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConfigsProvider>
      <GraphicalProvider>
        <UIProvider>
          <HeroUIProvider>
            <ThemeSync />
            {children}
          </HeroUIProvider>
        </UIProvider>
      </GraphicalProvider>
    </ConfigsProvider>
  );
}
