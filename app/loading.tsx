import Image from "next/image";
import TxPipeIcon from "~/public/txpipe.png";

export default function Loading() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="animate-ping text-center text-2xl">
        <Image
          src={TxPipeIcon}
          alt="TxPipe Shop Logo"
          width={110}
          className="m-auto"
        />
        Loading ...
      </div>
    </div>
  );
}
