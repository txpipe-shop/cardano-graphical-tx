import Image from "next/image";
import { useGraphical } from "~/app/_contexts";
import Error500Icon from "~/public/error.svg";
import NotFoundIcon from "~/public/not-found.svg";

export const PlaygroundError = () => {
  const { error } = useGraphical();
  const getError = () =>
    error === "Internal server error" ? Error500Icon : NotFoundIcon;

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center text-center text-2xl font-black text-red-400">
      <Image src={getError()} alt="" />
      There was an error fetching the transaction <br />
      {error}
    </div>
  );
};
