import {
  Button,
  Input,
  Navbar,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import SearchIcon from "~/public/search.svg";
import TxPipeIcon from "~/public/txpipe.png";
import { useConfigs, useGraphical } from "../_contexts";
import { ROUTES, setCBOR } from "../_utils";
import { NetSelector } from "./NetSelector";

export const Header = () => {
  const searchParams = useSearchParams();
  const [raw, setRaw] = useState<string>("");
  const { transactions, setTransactionBox, setError } = useGraphical();
  const { configs } = useConfigs();

  useEffect(() => {
    const rawValue = searchParams.get("raw");
    if (rawValue) setRaw(rawValue);
  }, [searchParams, transactions]);

  const changeRaw = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRaw(e.target.value);
  };

  async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!raw) return;

    await setCBOR(configs, raw, transactions, setTransactionBox, setError);
  }

  return (
    <Navbar className="fixed left-0 top-0 box-border w-full">
      <NavbarContent className="w-inherit flex gap-20">
        <Link href={ROUTES.HOME}>
          <div className="flex flex-col justify-center font-bold">
            <Image
              src={TxPipeIcon}
              alt="TxPipe"
              width={30}
              className="m-auto"
            />
            TxPipe
          </div>
        </Link>
        <NavbarItem className="flex w-3/4 items-center p-2">
          <form
            onSubmit={handleSubmit}
            className="flex w-full items-center gap-4"
          >
            <Input
              type="text"
              size="md"
              placeholder="Search for a transaction by CBOR"
              onChange={changeRaw}
              value={raw}
              endContent={
                <Button type="submit" className="bg-transparent" isIconOnly>
                  <Image src={SearchIcon} alt="Search" />
                </Button>
              }
            />
          </form>
        </NavbarItem>
        <NavbarItem>
          <NetSelector network={configs.net} />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};
