"use client";
import { Accordion, AccordionItem, useDisclosure } from "@heroui/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { type ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button, Input } from "~/app/_components";
import { useGraphical } from "~/app/_contexts";
import {
  JSONBIG,
  TX_URL_PARAM,
  getTransaction,
  handleCopy,
  trimString,
} from "~/app/_utils";
import CopyIcon from "~/public/copy.svg";
import FullScreen from "~/public/fullscreen.svg";
import { AssetCard } from "./AssetCard";
import { InfoPanelRow } from "./InfoPanelRow";
import { JSONModal } from "./JSONModal";

export const TxInfo = () => {
  const [name, setName] = useState("");
  const { transactions, setTransactionBox } = useGraphical()!;
  const searchParams = useSearchParams();
  const selectedTxHash = searchParams.get(TX_URL_PARAM);
  const selectedTx = getTransaction(transactions)(selectedTxHash || "");
  const {
    isOpen: isOpenCertificate,
    onOpen: onOpenCertificate,
    onOpenChange: onOpenCertificateChange,
  } = useDisclosure();

  useEffect(() => {
    const selectedTx = getTransaction(transactions)(selectedTxHash || "");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setName(selectedTx?.alias || "");
  }, [selectedTxHash, transactions]);

  if (!selectedTx) return null;
  const {
    txHash,
    fee,
    inputs,
    outputs,
    mints,
    scriptsSuccessful,
    blockHash,
    blockTxIndex,
    blockHeight,
    blockAbsoluteSlot,
    validityStart,
    ttl,
    withdrawals,
    metadata,
    certificates,
    size,
  } = selectedTx;

  const totalOutput: bigint = outputs.reduce((acc, output) => {
    const lovelace = output.lovelace;

    return acc + BigInt(lovelace);
  }, BigInt(0));

  const msg = (() => {
    const item = metadata?.find(
      (entry: { label: string }) => entry.label === "674",
    );
    if (item && item.jsonMetadata) {
      return item.jsonMetadata["msg"];
    }
  })();

  const txTrim = trimString(txHash || "", 12);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSave = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name.length > 30) {
      toast.error("Alias name must be less than 30 characters");
      return;
    }
    setTransactionBox((prev) => {
      const newTransactions = prev.transactions.map((tx) =>
        tx.txHash === txHash ? { ...tx, alias: name } : tx,
      );

      return { ...prev, transactions: newTransactions };
    });
    toast.success("Transaction alias saved");
  };

  const disabledKeys = [
    !withdrawals?.length ? "10" : "",
    !msg ? "11" : "",
    !certificates?.length ? "12" : "",
    !mints.length ? "13" : "",
  ].filter(Boolean);

  return (
    <Accordion selectionMode="multiple" disabledKeys={disabledKeys}>
      <AccordionItem key="1" title="TxHash">
        <InfoPanelRow justify="between">
          {txTrim}
          <Image
            src={CopyIcon}
            alt="Copy"
            onClick={handleCopy(txHash)}
            className="cursor-pointer"
          />
        </InfoPanelRow>
      </AccordionItem>
      <AccordionItem key="2" title="Fee">
        <div className="flex flex-col gap-2">
          <AssetCard
            asset={{ assetName: "lovelace", amount: fee }}
            policyId=""
          />
        </div>
      </AccordionItem>
      <AccordionItem key="3" title="Block">
        <InfoPanelRow className="m-1">
          <b>Slot:</b>&nbsp;
          <p>{blockAbsoluteSlot ?? "Unknown"}</p>
        </InfoPanelRow>
        <InfoPanelRow className="m-1">
          <b>Height:</b>&nbsp;
          <p>{blockHeight ?? "Unknown"}</p>
        </InfoPanelRow>
        {blockHash && (
          <InfoPanelRow className="m-1" justify="between">
            <div className="flex">
              <b>Hash:</b>&nbsp;
              <p>{trimString(blockHash, 14)}</p>
            </div>
            <Image
              src={CopyIcon}
              alt="Copy"
              onClick={handleCopy(blockHash)}
              className="cursor-pointer"
            />
          </InfoPanelRow>
        )}
        <InfoPanelRow className="m-1">
          <b>Index:</b>&nbsp;
          <p>{blockTxIndex ?? "Unknown"}</p>
        </InfoPanelRow>
      </AccordionItem>
      <AccordionItem key="4" title="Size">
        <InfoPanelRow justify="between">{size ?? "Unknown"}</InfoPanelRow>
      </AccordionItem>
      <AccordionItem key="5" title="Invalid Before (Start)">
        <InfoPanelRow justify="between">
          {validityStart ?? "Unknown"}
        </InfoPanelRow>
      </AccordionItem>
      <AccordionItem key="6" title="Invalid Hereafter (TTL)">
        <InfoPanelRow justify="between">{ttl ?? "Unknown"}</InfoPanelRow>
      </AccordionItem>
      <AccordionItem key="7" title="Outputs Count">
        <InfoPanelRow justify="between">{outputs.length}</InfoPanelRow>
      </AccordionItem>
      <AccordionItem key="8" title="Total Output Sum">
        <div className="flex flex-col gap-2">
          <AssetCard
            asset={{ assetName: "lovelace", amount: Number(totalOutput) }}
            policyId=""
          />
        </div>
      </AccordionItem>
      <AccordionItem key="9" title="Inputs Count">
        <InfoPanelRow justify="between">{inputs.length}</InfoPanelRow>
      </AccordionItem>
      <AccordionItem key="10" title="Withdrawals">
        <div className="flex flex-col gap-2">
          {withdrawals?.map((withdrawal, index) => (
            <InfoPanelRow key={index} direction="col">
              <div className="mb-2 flex items-center justify-between">
                <b>Reward Account:</b>&nbsp;
                <div className="flex">
                  <span className="ml-1 mr-auto">
                    {trimString(withdrawal.rewardAccount, 12)}
                  </span>
                  <Image
                    src={CopyIcon}
                    alt="Copy"
                    onClick={handleCopy(withdrawal.rewardAccount)}
                    className="ml-2 cursor-pointer"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pr-2">
                <b>Amount:</b>&nbsp;
                <span>{withdrawal.amount}</span>
              </div>
            </InfoPanelRow>
          ))}
        </div>
      </AccordionItem>
      <AccordionItem key="11" title="Metadata">
        <InfoPanelRow justify="between">{msg}</InfoPanelRow>
      </AccordionItem>
      <AccordionItem key="12" title="Certificates">
        <JSONModal
          isOpen={isOpenCertificate}
          onOpenChange={onOpenCertificateChange}
          title="Certificates"
        >
          <pre className="font-code bg-surface">
            {JSONBIG.stringify(certificates, null, 2)
              .replace(/"json":/g, "")
              .replace(/\\/g, "")}
          </pre>
        </JSONModal>
        {certificates && (
          <InfoPanelRow gap className="overflow-x-hidden">
            <div className="absolute right-4">
              <Image
                src={FullScreen}
                alt="See Modal"
                onClick={onOpenCertificate}
                className="cursor-pointer"
              />
            </div>
            <pre className="font-code overflow-x-auto">
              {JSONBIG.stringify(certificates, null, 2)
                .replace(/"json":/g, "")
                .replace(/\\/g, "")}
            </pre>
          </InfoPanelRow>
        )}
      </AccordionItem>
      <AccordionItem key="13" title="Minting & Burning">
        <div className="flex flex-col gap-2">
          {mints.map(({ policyId, assetsPolicy }, index) =>
            assetsPolicy.map((asset) => (
              <AssetCard
                key={index}
                asset={asset}
                policyId={policyId}
                isMintBurn
              />
            )),
          )}
        </div>
      </AccordionItem>
      <AccordionItem key="14" title="Scripts Successful">
        <div className="flex flex-col gap-2">
          <InfoPanelRow justify="between">
            {scriptsSuccessful ? "True" : "False"}
          </InfoPanelRow>
        </div>
      </AccordionItem>
      <AccordionItem key="15" title="Alias" className="m-0">
        <form onSubmit={handleSave} className="flex justify-around">
          <Input
            inputSize="small"
            name="Name your transaction"
            onChange={handleChange}
            value={name}
          />
          <Button type="submit" className="h-10 text-sm">
            Save
          </Button>
        </form>
      </AccordionItem>
    </Accordion>
  );
};
