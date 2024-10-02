"use client";

import { Header } from "./_components";

export default function Index() {
  return (
    <>
      <Header />
      <div className="flex h-screen flex-col gap-3 p-10 pt-32 text-center">
        <div className="text-5xl">Main Page</div>
        <div className="px-10 text-xl">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip
        </div>
        <div className="mt-10 text-3xl">Examples</div>
      </div>
    </>
  );
}
