"use client";

import { useEffect, type Dispatch, type SetStateAction } from "react";
import { Button, Input } from "~/app/_components";

import type {
  AddressDiagnostic,
  SafeAddressResponse,
} from "@laceanatomy/napi-pallas";
import { useConfigs, useUI } from "~/app/_contexts";
import { getAddressInfo, USER_CONFIGS } from "~/app/_utils";

export const AddressInput = ({
  setAddressInfo,
}: {
  setAddressInfo: Dispatch<SetStateAction<AddressDiagnostic | undefined>>;
}) => {
  const { setError } = useUI();
  const { configs, updateConfigs } = useConfigs();

  const changeRaw = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateConfigs(USER_CONFIGS.QUERY, e.target.value);
  };

  useEffect(() => {
    updateConfigs(USER_CONFIGS.QUERY, configs.query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      setError("");
      if (!configs.query) return;

      const res: SafeAddressResponse = await getAddressInfo(
        configs.query,
        setError,
      );

      if (res.address) {
        setAddressInfo(res.address);
      } else {
        throw new Error("Error getting address info");
      }

      updateConfigs(USER_CONFIGS.QUERY, configs.query);
    } catch (error: unknown) {
      if (error instanceof Response) {
        return; // already handled by getAddressInfo
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
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
