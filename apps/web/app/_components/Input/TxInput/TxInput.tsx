"use client";

import {
  Button as HeroButton,
  Select,
  SelectItem,
  useDisclosure
} from "@heroui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button, Input } from "~/app/_components";
import { useConfigs, useUI } from "~/app/_contexts";
import { isEmpty, OPTIONS, ROUTES, USER_CONFIGS } from "~/app/_utils";
import MultipleTxIcon from "~/public/multiple-txs.svg";
import { MultipleInputModal } from "../MultipleInputModal/MultipleInputModal";
import { NetSelector } from "../NetSelector";

const FUNCTIONS = {
  DRAW: "draw",
  DISSECT: "dissect",
} as const;
type Functions = (typeof FUNCTIONS)[keyof typeof FUNCTIONS];

export const TxInput = () => {
  const router = useRouter();

  const { configs, updateConfigs } = useConfigs();
  const { error } = useUI();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const disabledButton = !isEmpty(error) || !configs.query;

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>, fn: Functions) => {
    e.preventDefault();
    if (!configs.query) return;

    const multiplesInputs = configs.query.split(",").map((tx) => tx.trim());
    const uniqueInputs = Array.from(new Set(multiplesInputs));

    if (configs.option === OPTIONS.HASH && fn === FUNCTIONS.DISSECT) {
      const hash = uniqueInputs[0];
      router.push(ROUTES.DISSECT(configs.net, hash));
    } else if (configs.option === OPTIONS.HASH && fn === FUNCTIONS.DRAW) {
      console.log("TODO")
    } else if (configs.option === OPTIONS.CBOR && fn === FUNCTIONS.DRAW) {
      console.log("TODO")
    } else if (configs.option === OPTIONS.CBOR && fn === FUNCTIONS.DISSECT) {
      // Para CBOR, navegar sin hash en query params
      // La página de dissect verificará config.query y config.option
      router.push(ROUTES.DISSECT(configs.net));
    }
  }

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    updateConfigs(USER_CONFIGS.QUERY, e.target.value);
  }

  const handleChangeSelectedOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateConfigs(USER_CONFIGS.OPTION, e.target.value as OPTIONS);
  }

  return (
    <div className="z-40 flex items-center justify-end pt-2">
      <form
        className="mr-3 flex w-full items-center justify-center gap-4"
      >
        <NetSelector network={configs.net} />
        <Input
          name="tx-input"
          value={configs.query}
          onChange={handleChangeInput}
          placeholder="Enter CBOR or hash for any Cardano Tx"
          startContent={
            <Select
              aria-label="Close"
              selectedKeys={[configs.option]}
              size="sm"
              className="w-1/6"
              onChange={handleChangeSelectedOption}
              color="primary"
              labelPlacement="outside"
            >
              <SelectItem key={OPTIONS.HASH}>TxHash</SelectItem>
              <SelectItem key={OPTIONS.CBOR}>CBOR</SelectItem>
            </Select>
          }
        />
        <abbr title="Add multiple transactions">
          <HeroButton
            isIconOnly
            size="md"
            variant="flat"
            radius="sm"
            onPress={onOpen}
          >
            <Image src={MultipleTxIcon} alt="Search" />
          </HeroButton>
        </abbr>
        <MultipleInputModal isOpen={isOpen} onOpenChange={onOpenChange} />
        <Button onClick={(e) => handleSubmit(e, FUNCTIONS.DRAW)} disabled={disabledButton}>
          Draw
        </Button>
        <Button onClick={(e) => handleSubmit(e, FUNCTIONS.DISSECT)} disabled={disabledButton} >
          Dissect
        </Button>
      </form>
    </div>
  );
}
