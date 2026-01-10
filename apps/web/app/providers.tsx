import { HeroUIProvider } from "@heroui/react";
import { TRPCReactProvider } from "~/trpc/react";
import { ConfigsProvider, GraphicalProvider, UIProvider } from "./_contexts";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TRPCReactProvider>
      <ConfigsProvider>
        <GraphicalProvider>
          <UIProvider>
            <HeroUIProvider>{children}</HeroUIProvider>
          </UIProvider>
        </GraphicalProvider>
      </ConfigsProvider>
    </TRPCReactProvider>
  );
}
