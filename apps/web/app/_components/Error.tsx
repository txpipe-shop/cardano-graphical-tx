import Image from "next/image";
import { useUI } from "~/app/_contexts";
import { OPTIONS } from "~/app/_utils";
import Error500Icon from "~/public/error.svg";
import NotFoundIcon from "~/public/not-found.svg";

export const Error = ({
  action,
  goal,
  option,
}: {
  action: string;
  goal: string;
  option: OPTIONS;
}) => {
  const { error } = useUI();
  const getError = () =>
    error === "Internal server error" ? Error500Icon : NotFoundIcon;

  return (
    <div className="absolute inset-0 -z-30 flex justify-center overflow-hidden">
      <div className="flex h-screen w-2/3 flex-col items-center justify-center text-center text-2xl font-black text-red-400">
        <Image src={getError()} alt="ERROR" />
        There was an error {action} the {goal}: <br />
        {error} <br /> <br />
        Try using another network, or check your&nbsp;
        {option == OPTIONS.CBOR ? "CBOR" : "hash"}.
      </div>
    </div>
  );
};
