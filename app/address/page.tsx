"use client";

import { Suspense, useState } from "react";
import {
  Header,
  AddressInput,
  ShelleySection,
  StakeSection,
  ByronSection,
  Error,
} from "~/app/_components";
import Loading from "~/app/loading";

import { ExamplesAddress } from "../_components/Examples";
import { useUI } from "../_contexts";
import { isEmpty } from "~/app/_utils";
import type { Output } from "~/napi-pallas";

export default function Index() {
  const { error } = useUI();
  const [addressInfo, setAddressInfo] = useState<Output>({});

  return (
    <div>
      <Header />
      <AddressInput setAddressInfo={setAddressInfo} />
      <Suspense fallback={<Loading />}>
        {Object.keys(addressInfo).length > 0 ? (
          !isEmpty(error) ? (
            <Error action="dissecting" />
          ) : (
            <>
              {addressInfo?.address?.kind == "Shelley" && (
                <ShelleySection data={addressInfo} />
              )}
              {addressInfo?.address?.kind == "Stake" && (
                <StakeSection data={addressInfo} />
              )}
              {addressInfo?.address?.kind == "Byron" && (
                <ByronSection data={addressInfo} />
              )}
            </>
          )
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center">
            <div className="w-2/3 text-center">
              <ExamplesAddress setAddressInfo={setAddressInfo} />
            </div>
          </div>
        )}
      </Suspense>
    </div>
  );
}
