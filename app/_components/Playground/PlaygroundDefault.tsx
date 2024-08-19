import Image from "next/image";
import TransactionIcon from "~/public/transaction.svg";

export const PlaygroundDefault = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center text-center text-2xl font-black text-gray-500">
      <Image src={TransactionIcon} alt="search" priority />
      <p className="dark:text-slate-500">Search for a transaction</p>
    </div>
  );
};
