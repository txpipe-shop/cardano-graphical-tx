import { Badge, Button, Link as NextLink } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "~/app/_utils";
import TxPipeIcon from "~/public/txpipe_shop.png";

export const Header = () => {
  return (
    <header className="sticky top-0 z-40 box-border h-24 w-full flex-row border-b-2 border-dashed border-b-gray-300 bg-white px-4 pb-4 pt-6">
      <div className="relative flex items-end justify-between align-middle">
        <h3 className="absolute flex w-full items-center justify-center text-4xl text-gray-400">
          <Link href={ROUTES.HOME}>
            <span>Lace Anatomy</span>
          </Link>
        </h3>
        <Link
          href="https://txpipe.shop/"
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
          <Badge color="danger" content="Beta">
            <Button
              variant="flat"
              className="p-5 font-mono text-lg shadow-md"
              as={NextLink}
              href={ROUTES.DSL}
            >
              DSL
            </Button>
          </Badge>
          <Button
            variant="flat"
            className="p-5 font-mono text-lg shadow-md"
            as={NextLink}
            href={ROUTES.ADDRESS}
          >
            Address
          </Button>
        </div>
      </div>
    </header>
  );
};
