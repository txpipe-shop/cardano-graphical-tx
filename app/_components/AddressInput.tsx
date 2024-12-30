"use client";

import { useEffect, type Dispatch, type SetStateAction } from "react";
import { Button, Input } from "~/app/_components";

import { getAddressInfo, USER_CONFIGS } from "~/app/_utils";
import { useConfigs, useUI } from "~/app/_contexts";
import type { Output } from "~/napi-pallas";

export const AddressInput = ({
  setAddressInfo,
}: {
  setAddressInfo: Dispatch<SetStateAction<Output>>;
}) => {
  const { setError } = useUI();
  const { configs, updateConfigs } = useConfigs();

  const changeRaw = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateConfigs(USER_CONFIGS.QUERY, e.target.value);
  };

  useEffect(() => {
    updateConfigs(USER_CONFIGS.QUERY, configs.query);
  }, []);

  async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!configs.query) return;

    const res = await getAddressInfo(configs.query, setError);

    if (res.error) {
      setError(res.error);
      return;
    }

    setAddressInfo(res);
    updateConfigs(USER_CONFIGS.QUERY, configs.query);
    setError("");
  }

  return (
    <div>
      <div className="z-40 flex items-center justify-end pt-2">
        <form
          onSubmit={handleSubmit}
          className="mr-3 flex w-full items-center justify-center gap-4"
        >
          <Input
            name="tx-input"
            value={configs.query}
            onChange={changeRaw}
            placeholder="Enter any Cardano address in Bech32, Base58 or Hex encoding."
          />
          <Button type="submit">Dissect</Button>
        </form>
      </div>
    </div>
  );
};
