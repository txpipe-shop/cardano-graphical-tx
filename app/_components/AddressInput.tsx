"use client";

import { Dispatch, SetStateAction, Suspense, useContext } from "react";
import { Button, PropBlock, EmptyBlock } from "~/app/_components";
import Loading from "~/app/loading";
import { parseAddress } from "~/napi-pallas";

import { ExamplesAddress } from "./Examples";
import { isEmpty } from "~/app/_utils";
import { useUI } from "~/app/_contexts";

// export async function action({ request }: ActionFunctionArgs) {
//   const formData = await request.formData();
//   let raw = formData.get("raw");

//   if (!!raw) {
//     const res = parseAddress(raw.toString());
//     return json({ ...res, raw });
//   } else {
//     return json({ error: "an empty value? seriously?" });
//   }
// }

export const AddressInput = ({
  setAddressInfo,
}: {
  setAddressInfo: Dispatch<SetStateAction<any>>;
}) => {
  const { error } = useUI();
  const data: any = [];

  return (
    <div>
      <Suspense fallback={<Loading />}>
        {!isEmpty(error) && (
          <div className="mb-4 text-lg text-red-500">{error}</div>
        )}

        <main className="mt-10 px-4">
          <h1 className="text-5xl text-black lg:text-7xl">Cardano Address</h1>
          <p className="text-xl text-gray-600">
            Lets dissect a Cardano address. Enter any valid address to inspect
            its contents.
          </p>
          <div className="mt-8 block">
            <form method="POST">
              <input
                type="text"
                autoComplete="off"
                defaultValue={data?.raw}
                name="raw"
                className="mt-4 block h-16 w-full appearance-none rounded-lg rounded-b-xl border-2 border-b-8 border-black bg-white px-4 py-2 text-2xl text-black placeholder-gray-400 shadow shadow-black outline-none"
                placeholder="Enter any Cardano address in Bech32, Base58 or Hex encoding"
              />
              <div className="mt-4 flex flex-row justify-end">
                <Button type="submit">Dissect</Button>
              </div>
            </form>
          </div>
        </main>
      </Suspense>
    </div>
  );
};
