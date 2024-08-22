import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import TxPipeIcon from "~/public/txpipe.png";
import { useConfigs, useGraphical } from "../_contexts";
import { ROUTES, setCBOR } from "../_utils";
import { NetSelector } from "./NetSelector";
import { Button } from "./Button";
import { Input } from "./Input";

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
    <header className="fixed left-0 top-0 box-border flex w-full flex-row items-center justify-between border-b-2 border-dashed border-b-gray-300 bg-white px-4 pb-4 pt-6 align-middle">
      <div className="flex flex-row items-center gap-4">
        <h3 className="flex items-center text-4xl text-gray-400">
          <Link href={ROUTES.HOME}>
            <span>Lace Anatomy</span>
          </Link>
        </h3>
        <Image src={TxPipeIcon} alt="TxPipe" width={30} className="m-auto" />
        <NetSelector network={configs.net} />
      </div>
      <form onSubmit={handleSubmit} className="flex w-2/3 items-center gap-4">
        <Input
          name="tx-input"
          value={raw}
          onChange={changeRaw}
          placeholder="Enter CBOR or hash for any Cardano Tx"
        />
        <Button type="submit">Draw</Button>
      </form>
    </header>
  );
};
