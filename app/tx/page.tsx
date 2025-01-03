"use client";

import { Examples, Header, TxInput } from "~/app/_components";

export default function Index() {
  return (
    <div>
      <Header />
      <TxInput />
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="w-2/3 text-center">
          <Examples />
        </div>
      </div>
    </div>
  );
}
