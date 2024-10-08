import Image from "next/image";
import { useUI } from "~/app/_contexts";
import Error500Icon from "~/public/error.svg";
import NotFoundIcon from "~/public/not-found.svg";

export const Error = ({ action }: { action: string }) => {
  const { error } = useUI();
  const getError = () =>
    error === "Internal server error" ? Error500Icon : NotFoundIcon;

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center text-center text-2xl font-black text-red-400">
      <Image src={getError()} alt="ERROR" />
      There was an error {action} the transaction: <br />
      {error} <br /> <br />
      Try using another network, or check your hash/CBOR.
    </div>
  );
};
