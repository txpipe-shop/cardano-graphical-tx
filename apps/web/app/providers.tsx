import { HeroUIProvider } from "@heroui/react";
import { ConfigsProvider, GraphicalProvider, UIProvider } from "./_contexts";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConfigsProvider>
      <GraphicalProvider>
        <UIProvider>
          <HeroUIProvider>{children}</HeroUIProvider>
        </UIProvider>
      </GraphicalProvider>
    </ConfigsProvider>
  );
}
