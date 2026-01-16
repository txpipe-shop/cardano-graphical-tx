"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AddressInput,
  ByronSection,
  Error,
  Examples,
  Header,
  ShelleySection,
  StakeSection,
} from "~/app/_components";
import { useConfigs, useUI } from "~/app/_contexts";
import { getAddressInfo, isEmpty } from "~/app/_utils";
import Loading from "~/app/loading";
import type { AddressDiagnostic } from "@laceanatomy/napi-pallas";

export default function Index() {
  const { error, loading, setError } = useUI();
  const { configs } = useConfigs();
  const [addressInfo, setAddressInfo] = useState<AddressDiagnostic>();
  const searchParams = useSearchParams();
  const useExample = searchParams.get("example");

  useEffect(() => {
    const parseExample = async () => {
      if (useExample) {
        const res = await getAddressInfo(useExample, setError);
        setAddressInfo(res.address);
      }
    };

    parseExample();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useExample]);

  if (loading) return <Loading />;
  return (
    <div>
      <Header />
      <AddressInput setAddressInfo={setAddressInfo} />
      {isEmpty(error) ? (
        addressInfo ? (
          <>
            {addressInfo?.kind == "Shelley" && (
              <ShelleySection data={addressInfo} />
            )}
            {addressInfo?.kind == "Stake" && (
              <StakeSection data={addressInfo} />
            )}
            {addressInfo?.kind == "Byron" && (
              <ByronSection data={addressInfo} />
            )}
          </>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center">
            <div className="w-2/3 text-center">
              <Examples showAddressesExamples />
            </div>
          </div>
        )
      ) : (
        <Error action="dissecting" goal="address" option={configs.option} />
      )}
    </div>
  );
}
