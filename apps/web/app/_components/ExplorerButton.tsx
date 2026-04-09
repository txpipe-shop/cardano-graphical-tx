"use client";

import { Button, Link as NextLink } from "@heroui/react";
import { useConfigs } from "~/app/_contexts";
import { ROUTES } from "~/app/_utils";

export const ExplorerButton = () => {
  const { configs } = useConfigs();
  const network = configs.net;

  return (
    <Button
      variant="flat"
      className="p-5 font-mono text-lg shadow-md"
      as={NextLink}
      href={ROUTES.EXPLORER_TXS(network)}
    >
      <span className="bg-gradient-to-r from-purple-500 to-orange-500 bg-clip-text font-mono text-lg font-bold text-transparent">
        Explorer
      </span>
      <span className="ml-1 rounded-full bg-orange-400/20 px-1.5 py-0.5 text-xs font-semibold text-orange-500">
        beta
      </span>
    </Button>
  );
};
