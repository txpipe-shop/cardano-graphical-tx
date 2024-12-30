"use client";

import { Select, SelectItem } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { type ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button, Input } from "../_components";
import { setCBOR } from "../_components/Header/header.helper";
import { NetSelector } from "../_components/NetSelector";
import { useConfigs, useGraphical, useUI } from "../_contexts";
import {
  getCborFromHash,
  isEmpty,
  KONVA_COLORS,
  OPTIONS,
  ROUTES,
  USER_CONFIGS,
} from "../_utils";

export const TxInput = () => {
  const { transactions, setTransactionBox } = useGraphical();
  const router = useRouter();
  const { setError } = useUI();
  const { configs, updateConfigs } = useConfigs();
  const [toGo, setToGo] = useState<string>("");

  const changeRaw = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateConfigs(USER_CONFIGS.QUERY, e.target.value);
  };
  useEffect(() => {
    updateConfigs(USER_CONFIGS.QUERY, configs.query);
  }, []);
  async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!configs.query) return;
    router.push(toGo);
    setError("");
    if (configs.option === OPTIONS.HASH) {
      const { cbor, warning } = await getCborFromHash(
        configs.query,
        configs.net,
        setError,
      );
      if (warning) {
        toast.error(warning, {
          icon: "🚫",
          style: {
            fontWeight: "bold",
            color: KONVA_COLORS.RED_WARNING,
          },
          duration: 5000,
        });
        return;
      }
      await setCBOR(
        configs.net,
        cbor,
        transactions,
        setTransactionBox,
        setError,
        true,
      );
    } else {
      await setCBOR(
        configs.net,
        configs.query,
        transactions,
        setTransactionBox,
        setError,
        false,
      );
    }
    updateConfigs(USER_CONFIGS.QUERY, configs.query);
  }
  const changeSelectedOption = (e: ChangeEvent<HTMLSelectElement>) => {
    if (!isEmpty(e.target.value))
      updateConfigs(USER_CONFIGS.OPTION, e.target.value as OPTIONS);
  };

  const changeGoTo = (route: string) => () => {
    setToGo(route);
  };

  return (
    <div className="z-40 flex items-center justify-end pt-2">
      <form
        onSubmit={handleSubmit}
        className="mr-3 flex w-full items-center justify-center gap-4"
      >
        <NetSelector network={configs.net} />
        <Input
          name="tx-input"
          value={configs.query}
          onChange={changeRaw}
          placeholder="Enter CBOR or hash for any Cardano Tx"
          startContent={
            <Select
              aria-label="Close"
              selectedKeys={[configs.option]}
              size="sm"
              className="w-1/5"
              onChange={changeSelectedOption}
              color="primary"
              labelPlacement="outside"
            >
              <SelectItem key={OPTIONS.HASH} value={OPTIONS.HASH}>
                Search by Hash
              </SelectItem>
              <SelectItem key={OPTIONS.CBOR} value={OPTIONS.CBOR}>
                Search by CBOR
              </SelectItem>
            </Select>
          }
        />
        <Button type="submit" onClick={changeGoTo(ROUTES.GRAPHER)}>
          Draw
        </Button>
        <Button type="submit" onClick={changeGoTo(ROUTES.DISSECT)}>
          Dissect
        </Button>
      </form>
    </div>
  );
};
