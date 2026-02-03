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
      Explorer
    </Button>
  );
};
