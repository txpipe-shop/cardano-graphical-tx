import { Button, Link as NextLink } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "~/app/_utils";
import TxPipeIcon from "~/public/txpipe_shop.png";
import { ExplorerButton } from "./ExplorerButton";
import { ThemeButton } from "./Theme";

export const Header = () => {
  return (
    <header className="sticky top-0 z-40 box-border w-full border-b-2 border-dashed border-border bg-background px-4 py-3 md:h-24 md:pb-4 md:pt-6">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="https://txpipe.io/"
          target="_blank"
          rel="noopener noreferrer"
          className="z-40 shrink-0"
        >
          <Image
            src={TxPipeIcon}
            alt="TxPipe Shop Logo"
            width={50}
            height={50}
            className="h-10 w-10 md:h-[50px] md:w-[50px]"
          />
        </Link>
        <h3 className="hidden flex-1 text-center text-4xl text-p-primary md:block">
          <Link href={ROUTES.HOME}>
            <span>Lace Anatomy</span>
          </Link>
        </h3>
        <div className="flex flex-wrap items-center justify-end gap-2 md:gap-4">
          <Button
            variant="flat"
            className="px-2 py-2 font-mono text-sm shadow-md md:p-5 md:text-lg"
            as={NextLink}
            href={ROUTES.TX}
          >
            Transaction
          </Button>
          <Button
            variant="flat"
            className="px-2 py-2 font-mono text-sm shadow-md md:p-5 md:text-lg"
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
