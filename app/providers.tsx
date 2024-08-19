import { NextUIProvider } from "@nextui-org/react";
import { TRPCReactProvider } from "~/trpc/react";
import { ConfigsProvider, GraphicalProvider } from "./_contexts";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TRPCReactProvider>
      <ConfigsProvider>
        <GraphicalProvider>
          <NextUIProvider>{children}</NextUIProvider>
        </GraphicalProvider>
      </ConfigsProvider>
    </TRPCReactProvider>
  );
}
