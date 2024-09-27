"use client";

import { Header } from "./_components";

export default function Index() {
  return (
    <div className="flex w-full justify-center">
      <Header />
      <div className="mt-6 flex h-screen w-2/3 flex-col items-start justify-start gap-3 p-10 pt-32 text-center">
        <div className="text-5xl">About Us</div>
        <div className="mt-6 justify-center text-justify text-xl text-gray-500">
          Lace Anatomy renders transactions from CBOR and transaction hashes,
          providing a graphical representation of blockchain data for developers
          and analysts. It also includes a dissect functionality that breaks
          down CBOR structures, showing detailed information about each
          component. This tool is particularly useful for debugging purposes,
          allowing developers to inspect and troubleshoot low-level Cardano
          transactions effectively.
        </div>
        <div className="mt-6 text-3xl">See more about us</div>
        <div className="mx-auto mt-6 flex w-full items-center justify-between rounded-xl bg-slate-100 md:grid-cols-3 lg:p-12 xl:p-16">
          <div className="flex flex-col items-center text-center">
            <p className="text-lg font-extrabold">Open Source</p>
            <p className="text-gray-700">
              This is an fun, open-source
              <br />
              utility maintained by TxPipe
            </p>
            <a className="text-blue-400" href="https://txpipe.io">
              https://txpipe.io
            </a>
          </div>
          <div className="flex flex-col items-center text-center">
            <p className="text-lg font-extrabold">Building a dApp?</p>
            <p className="text-gray-700">
              We can help!
              <br />
              Schedule an intro call
            </p>
            <a className="text-blue-400" href="https://txpipe.shop">
              https://txpipe.shop
            </a>
          </div>
          <div className="flex flex-col items-center text-center">
            <p className="text-lg font-extrabold">Hosted on Demeter.run</p>
            <p className="text-gray-700">
              Cardano infrastructure
              <br /> made simple
            </p>
            <a className="text-blue-400" href="https://demeter.run">
              https://demeter.run
            </a>
          </div>
        </div>

        <div className="mb-6 mt-10 text-3xl">Try one of these examples</div>
        <div className="flex w-full justify-between gap-3">
          {examples.map((example) => (
            <button
              type="submit"
              className="h-full w-[24%] cursor-pointer justify-evenly rounded-lg border-2 bg-gray-100 p-4 text-left shadow"
              onClick={example.onclick}
            >
              <h3 className="text-xl">{example.title}</h3>

              <code className="mt-4 block w-full break-words text-gray-400">
                {example.code.substring(0, 30)}...
              </code>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
