import { Button, Link as NextLink } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "~/app/_utils";
import TxPipeIcon from "~/public/txpipe_shop.svg";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 box-border flex h-24 w-full flex-row items-center justify-between border-b-2 border-dashed border-b-gray-300 bg-white px-4 pb-4 pt-6 align-middle">
      <div className="flex flex-row items-center gap-4">
        <h3 className="flex items-center text-4xl text-gray-400">
          <Link href={ROUTES.HOME}>
            <span>Lace Anatomy</span>
          </Link>
        </h3>

        <Link
          href="https://txpipe.shop/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src={TxPipeIcon}
            alt="TxPipe Shop Logo"
            width={110}
            className="m-auto"
          />
        </Link>
      </div>
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
          href={ROUTES.DSL}
        >
          DSL
        </Button>
        <Button
          variant="flat"
          className="p-5 font-mono text-lg shadow-md"
          as={NextLink}
          href={ROUTES.ADDRESS}
        >
          Address
        </Button>
      </div>
    </header>
  );
};
