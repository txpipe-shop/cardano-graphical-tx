"use client";

import { Examples, Header } from "./_components";

export default function Index() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Header />
      <div className="flex h-full w-2/3 flex-col items-start justify-start gap-3 p-10 pb-32 text-center">
        <div className="text-5xl">About Us</div>
        <div className="mt-4 justify-center text-justify text-xl text-gray-500">
          Lace Anatomy renders transactions from CBOR and transaction hashes,
          providing a graphical representation of blockchain data for developers
          and analysts. It also includes a dissect functionality that breaks
          down CBOR structures, showing detailed information about each
          component. This tool is particularly useful for debugging purposes,
          allowing developers to inspect and troubleshoot low-level Cardano
          transactions effectively.
        </div>
        <div className="mt-6 text-3xl">See more about us</div>
        <div className="mx-auto mt-6 grid w-full items-center justify-between gap-6 rounded-xl bg-slate-100 p-6 md:grid-cols-2 lg:grid-cols-4">
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
            <p className="text-lg font-extrabold">Learn more</p>
            <p className="text-gray-700">See the code</p>
            <a
              className="text-blue-400"
              href="https://github.com/txpipe-shop/cardano-graphical-tx/"
            >
              https://github.com/txpipe-shop/cardano-graphical-tx/
            </a>
          </div>
        </div>
        <Examples showTxExamples showAddressesExamples />
      </div>
    </div>
  );
}
