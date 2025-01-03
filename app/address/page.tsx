"use client";

import { useState } from "react";
import {
  AddressInput,
  ByronSection,
  Error,
  ExamplesAddress,
  Header,
  ShelleySection,
  StakeSection,
} from "~/app/_components";
import { useConfigs, useUI } from "~/app/_contexts";
import { isEmpty } from "~/app/_utils";
import Loading from "~/app/loading";
import type { SafeAddressResponse } from "~/napi-pallas";

export default function Index() {
  const { error, loading } = useUI();
  const { configs } = useConfigs();
  const [addressInfo, setAddressInfo] = useState<SafeAddressResponse>({});

  if (loading) return <Loading />;
  return (
    <div>
      <Header />
      <AddressInput setAddressInfo={setAddressInfo} />
      {Object.keys(addressInfo).length > 0 ? (
        !isEmpty(error) ? (
          <Error action="dissecting" option={configs.option} />
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
    </div>
  );
}
