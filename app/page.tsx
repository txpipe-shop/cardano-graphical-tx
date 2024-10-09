"use client";

import { useRouter } from "next/navigation";
import { Header } from "./_components";
import { setCBOR } from "./_components/Header/header.helper";
import { useConfigs, useGraphical, useUI } from "./_contexts";
import { getCborFromHash, KONVA_COLORS, ROUTES, USER_CONFIGS } from "./_utils";
import toast from "react-hot-toast";

export default function Index() {
  const router = useRouter();
  const { setError } = useUI();
  const { updateConfigs } = useConfigs();
  const { transactions, setTransactionBox } = useGraphical();
  const cbor1 =
    "84a70081825820f17477b3879320a18e72c6a6af1158be2a3decb8dc1b78a19d132248d6da7e150201828258390036e2bc9dc949639b9a2a1ebb1e7177fc2aaa925c945a38a1d3c3450f3d8e7565a718dee1e5f90977a7bb19df19f8b26a8ae38f2052df346e1a001e848082583900cc25b7bd71fa51376b407ce2fbf651c8bd0fc01c247852a68b33b6aea4f93ef1d4968d3be5c65289730cbfa8a81eefd4eac5f781cbe0ed3b821b000000025291ad4ca2581c2b424eb51d04e39cfe7483ffe60eda9c5388d622d2bbb10443631818aa4443424c501b0000082f79cd41e0444d454c441b0000082f79cd41e0474d696e737761701b0000082f79cd41e04c466c61632046496e616e63651b0000082f79cd41e04f4c656e66692044414f20746f6b656e1b0000082f79cd41e04f4f736d69756d44414f20546f6b656e1b0000082f79cd41e050496e6469676f2044414f20546f6b656e1b0000082f79cd41e05247656e697573205969656c6420546f6b656e1b0000082f79cd41e052576f726c64204d6f62696c6520546f6b656e1b0000082f79cd41e0581b57696e6752696465727320476f7665726e616e636520546f6b656e1b0000082f79cd41e0581c77211b30313564b8b11db9c9de94addc5fa305f5d47fd278140eef63a146534f444954411b00005af3107a4000021a00030949031a0264e3be075820b4433ddcd8c3e5d7372766de6b251fc4061e17b25ae33cf1a83b8261320472b809a1581c77211b30313564b8b11db9c9de94addc5fa305f5d47fd278140eef63a146534f444954411b00005af3107a40000e81581ccc25b7bd71fa51376b407ce2fbf651c8bd0fc01c247852a68b33b6aea20082825820e67b8e6b83eebbaa4e3a4e711ce71233a8781caa15d46e671e020f95885c0b035840a7307802e39a3800cdb9166ee443cbdccdb1b5e097488b2e2a6672fda63976131657bba26ec1c5d640610a3ef91ceb8110c0d64f028de89ae39a81af5c0c7102825820143108f515fa7636dd003d39c50b326ac4e9511e95cf9bbd406b35693bdb61d958402899071a05954127244dfea5f3d0be60541059a8b8e3eeb9d4789ff149a0d68fb3cf1b788883280bb9549b4d7732e49cba12ffbfdf58f5b605307db229838b0301818201818200581ccc25b7bd71fa51376b407ce2fbf651c8bd0fc01c247852a68b33b6aef5a11902d1a178383737323131623330333133353634623862313164623963396465393461646463356661333035663564343766643237383134306565663633a166534f44495441a265696d616765782368747470733a2f2f692e6962622e636f2f526a58585370372f736f646974612e706e67646e616d6566534f44495441";
  const hash1 =
    "64403900eb882a71f9aae0569b422c0c31a1787092a877ead54afd1b1f713b13";
  const hash2 =
    "d1ef2bf292694fbbdcc5855c040e5081e0a738701d1c3cb92410901f39504976";
  const examples = [
    {
      title: "Draw CBOR",
      code: cbor1,
      onclick: async () => {
        await setCBOR(
          "preprod",
          cbor1,
          transactions,
          setTransactionBox,
          setError,
          true,
        );
        router.push(ROUTES.GRAPHER);
        updateConfigs(USER_CONFIGS.QUERY, cbor1);
        updateConfigs(USER_CONFIGS.NET, "preprod");
        updateConfigs(USER_CONFIGS.OPTION, "cbor");
      },
    },
    {
      title: "Draw Tx Hash",
      code: hash1,
      onclick: async () => {
        const { cbor, warning } = await getCborFromHash(
          hash1,
          "preprod",
          setError,
        );
        if (warning) {
          toast.error(warning, {
            style: {
              fontWeight: "bold",
              color: KONVA_COLORS.RED_WARNING,
            },
            duration: 5000,
          });
          return;
        }
        await setCBOR(
          "preprod",
          cbor,
          transactions,
          setTransactionBox,
          setError,
          true,
        );
        router.push(ROUTES.GRAPHER);
        updateConfigs(USER_CONFIGS.QUERY, hash1);
        updateConfigs(USER_CONFIGS.NET, "preprod");
        updateConfigs(USER_CONFIGS.OPTION, "hash");
      },
    },
    {
      title: "Dissect CBOR",
      code: cbor1,
      onclick: async () => {
        await setCBOR(
          "preprod",
          cbor1,
          transactions,
          setTransactionBox,
          setError,
          true,
        );
        router.push(ROUTES.DISSECT);
        updateConfigs(USER_CONFIGS.QUERY, cbor1);
        updateConfigs(USER_CONFIGS.NET, "preprod");
        updateConfigs(USER_CONFIGS.OPTION, "cbor");
      },
    },
    {
      title: "Dissect Tx Hash",
      code: hash2,
      onclick: async () => {
        const { cbor } = await getCborFromHash(hash2, "preprod", setError);
        await setCBOR(
          "preprod",
          cbor,
          transactions,
          setTransactionBox,
          setError,
          true,
        );
        router.push(ROUTES.DISSECT);
        updateConfigs(USER_CONFIGS.QUERY, hash2);
        updateConfigs(USER_CONFIGS.NET, "preprod");
        updateConfigs(USER_CONFIGS.OPTION, "hash");
      },
    },
  ];
  return (
    <div className="flex h-full w-full justify-center">
      <Header />
      <div className="flex h-full w-2/3 flex-col items-start justify-start gap-3 p-10 py-32 text-center">
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
        <div className="mx-auto mt-6 flex w-full items-center justify-between rounded-xl bg-slate-100 md:grid-cols-3 lg:p-12 xl:p-16">
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
              https://github.com/txpipe-
              <br />
              shop/cardano-graphical-tx/
            </a>
          </div>
        </div>

        <div className="mb-6 mt-10 text-3xl">Try one of these examples</div>
        <div className="flex w-full basis-1/4 flex-wrap justify-between gap-3">
          {examples.map((example, index) => (
            <button
              key={index}
              type="submit"
              className="w-[24%] cursor-pointer justify-evenly rounded-lg border-2 bg-gray-100 p-4 text-left shadow"
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
