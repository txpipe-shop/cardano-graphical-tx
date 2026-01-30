import { Button, Link as NextLink } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "~/app/_utils";
import TxPipeIcon from "~/public/txpipe_shop.png";
import { ExplorerButton } from "./ExplorerButton";
import { ThemeButton } from "./Theme";

export const Header = () => {
  return (
    <header className="sticky top-0 z-40 box-border h-24 w-full flex-row border-b-2 border-dashed border-b-color-dashed-border bg-background px-4 pb-4 pt-6">
      <div className="relative flex items-end justify-between align-middle">
        <h3 className="absolute flex w-full items-center justify-center text-4xl text-p-main">
          <Link href={ROUTES.HOME}>
            <span>Lace Anatomy</span>
          </Link>
        </h3>
        <Link
          href="https://txpipe.io/"
          target="_blank"
          rel="noopener noreferrer"
          className="z-40"
        >
          <Image
            src={TxPipeIcon}
            alt="TxPipe Shop Logo"
            width={50}
            className="m-auto"
          />
        </Link>
        <div className="flex gap-4">
          <Button
            variant="flat"
            className="p-5 font-mono text-lg shadow-md"
            as={NextLink}
            href={ROUTES.TX}
          >
            Transaction
          </Button>
          <Button
            variant="flat"
            className="p-5 font-mono text-lg shadow-md"
            as={NextLink}
            href={ROUTES.ADDRESS}
          >
            Address
          </Button>
          <ExplorerButton />
          <ThemeButton />
        </div>
      </div>
    </header>
  );
};
