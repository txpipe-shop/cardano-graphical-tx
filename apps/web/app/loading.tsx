import Image from "next/image";
import TxPipeIcon from "~/public/txpipe.png";

export default function Loading() {
  return (
    <div className="absolute inset-0 -z-30 overflow-hidden">
      <div className="flex h-screen flex-col items-center justify-center gap-14 text-center text-2xl">
        <div className="animate-ping">
          <Image
            src={TxPipeIcon}
            alt="TxPipe Shop Logo"
            width={110}
            className="m-auto"
          />
        </div>
        <div className="animate-ping">Loading</div>
      </div>
    </div>
  );
}
