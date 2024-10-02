import { NextUIProvider } from "@nextui-org/react";
import { TRPCReactProvider } from "~/trpc/react";
import { ConfigsProvider, GraphicalProvider, UIProvider } from "./_contexts";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TRPCReactProvider>
      <ConfigsProvider>
        <GraphicalProvider>
          <UIProvider>
            <NextUIProvider>{children}</NextUIProvider>
          </UIProvider>
        </GraphicalProvider>
      </ConfigsProvider>
    </TRPCReactProvider>
  );
}
