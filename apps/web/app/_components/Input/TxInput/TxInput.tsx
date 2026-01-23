"use client";

import {
  Button as NextButton,
  Select,
  SelectItem,
  useDisclosure,
} from "@heroui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { type ChangeEvent, useEffect, useState } from "react";
import { Button, Input } from "~/app/_components";
import { useConfigs, useGraphical, useUI } from "~/app/_contexts";
import { isEmpty, NETWORK, OPTIONS, ROUTES, USER_CONFIGS } from "~/app/_utils";
import MultipleTxIcon from "~/public/multiple-txs.svg";
import { MultipleInputModal } from "../MultipleInputModal/MultipleInputModal";
import { NetSelector } from "../NetSelector";
import { addCBORsToContext, addDevnetCBORsToContext } from "./txInput.helper";

export const TxInput = () => {
  const { transactions, setTransactionBox, dimensions } = useGraphical();
  const router = useRouter();
  const { error, setError, setLoading } = useUI();
  const { configs, updateConfigs } = useConfigs();
  const [toGo, setToGo] = useState<string>("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const changeRaw = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateConfigs(USER_CONFIGS.QUERY, e.target.value);
  };

  useEffect(() => {
    updateConfigs(USER_CONFIGS.QUERY, configs.query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!configs.query) return;

    router.push(toGo);
    setError("");

    const multiplesInputs = configs.query.split(",").map((tx) => tx.trim());
    const uniqueInputs = Array.from(new Set(multiplesInputs));

    const size = { x: dimensions.width, y: dimensions.height };
    if (configs.net === NETWORK.DEVNET) {
      addDevnetCBORsToContext(
        configs.option,
        Number(configs.port),
        uniqueInputs,
        setError,
        transactions,
        setTransactionBox,
        setLoading,
        size,
      );
    } else {
      addCBORsToContext(
        configs.option,
        uniqueInputs,
        configs.net,
        setError,
        transactions,
        setTransactionBox,
        setLoading,
        size,
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
              className="w-1/6"
              onChange={changeSelectedOption}
              color="primary"
              labelPlacement="outside"
            >
              <SelectItem key={OPTIONS.HASH}>TxHash</SelectItem>
              <SelectItem key={OPTIONS.CBOR}>CBOR</SelectItem>
            </Select>
          }
        />
        <abbr title="Add multiple transactions">
          <NextButton
            isIconOnly
            size="md"
            variant="flat"
            radius="sm"
            onPress={onOpen}
          >
            <Image src={MultipleTxIcon} alt="Search" />
          </NextButton>
        </abbr>
        <MultipleInputModal isOpen={isOpen} onOpenChange={onOpenChange} />
        <Button
          type="submit"
          onClick={changeGoTo(ROUTES.GRAPHER)}
          disabled={error !== ""}
        >
          Draw
        </Button>
        <Button
          type="submit"
          onClick={changeGoTo(ROUTES.DISSECT)}
          disabled={error !== ""}
        >
          Dissect
        </Button>
      </form>
    </div>
  );
};
