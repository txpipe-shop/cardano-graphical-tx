"use client";
import {
  Accordion,
  AccordionItem,
  Card,
  useDisclosure,
} from "@nextui-org/react";
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
import { AssetCard } from "./AssetCard";
import { JSONModal } from "./JSONModal";
import FullScreen from "/public/fullscreen.svg";

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
        <Card className="flex flex-row justify-between bg-content2 px-5 py-2 shadow-none">
          {txTrim}
          <Image
            src={CopyIcon}
            alt="Copy"
            onClick={handleCopy(txHash)}
            className="cursor-pointer"
          />
        </Card>
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
        <Card className="m-1 flex flex-row bg-content2 px-5 py-2 shadow-none">
          <b>Slot:</b>&nbsp;
          <p>{blockAbsoluteSlot ?? "Unknown"}</p>
        </Card>
        <Card className="m-1 flex flex-row bg-content2 px-5 py-2 shadow-none">
          <b>Height:</b>&nbsp;
          <p>{blockHeight ?? "Unknown"}</p>
        </Card>
        {blockHash && (
          <Card className="m-1 flex flex-row justify-between bg-content2 px-5 py-2 shadow-none">
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
          </Card>
        )}
        <Card className="m-1 flex flex-row bg-content2 px-5 py-2 shadow-none">
          <b>Index:</b>&nbsp;
          <p>{blockTxIndex ?? "Unknown"}</p>
        </Card>
      </AccordionItem>
      <AccordionItem key="4" title="Size">
        <Card className="flex flex-row justify-between bg-content2 px-5 py-2 shadow-none">
          {size ?? "Unknown"}
        </Card>
      </AccordionItem>
      <AccordionItem key="5" title="Invalid Before (Start)">
        <Card className="flex flex-row justify-between bg-content2 px-5 py-2 shadow-none">
          {validityStart ?? "Unknown"}
        </Card>
      </AccordionItem>
      <AccordionItem key="6" title="Invalid Hereafter (TTL)">
        <Card className="flex flex-row justify-between bg-content2 px-5 py-2 shadow-none">
          {ttl ?? "Unknown"}
        </Card>
      </AccordionItem>
      <AccordionItem key="7" title="Outputs Count">
        <Card className="fl ex-row flex justify-between bg-content2 px-5 py-2 shadow-none">
          {outputs.length}
        </Card>
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
        <Card className="flex flex-row justify-between bg-content2 px-5 py-2 shadow-none">
          {inputs.length}
        </Card>
      </AccordionItem>
      <AccordionItem key="10" title="Withdrawals">
        <div className="flex flex-col gap-2">
          {withdrawals?.map((withdrawal, index) => (
            <Card
              key={index}
              className="flex flex-col bg-content2 px-5 py-2 shadow-none"
            >
              <div className="mb-2 flex items-center justify-between">
                <b>Raw Address:</b>&nbsp;
                <div className="flex">
                  <span className="ml-1 mr-auto">
                    {trimString(withdrawal.rawAddress, 12)}
                  </span>
                  <Image
                    src={CopyIcon}
                    alt="Copy"
                    onClick={handleCopy(withdrawal.rawAddress)}
                    className="ml-2 cursor-pointer"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pr-2">
                <b>Amount:</b>&nbsp;
                <span>{withdrawal.amount}</span>
              </div>
            </Card>
          ))}
        </div>
      </AccordionItem>
      <AccordionItem key="11" title="Metadata">
        <Card className="flex flex-row justify-between bg-content2 px-5 py-2 shadow-none">
          {msg}
        </Card>
      </AccordionItem>
      <AccordionItem key="12" title="Certificates">
        <JSONModal
          isOpen={isOpenCertificate}
          onOpenChange={onOpenCertificateChange}
          title="Certificates"
        >
          <pre className="font-code bg-content2">
            {JSONBIG.stringify(certificates, null, 2)
              .replace(/"json":/g, "")
              .replace(/\\/g, "")}
          </pre>
        </JSONModal>
        {certificates && (
          <Card className="gap-2 overflow-x-hidden bg-content2 px-5 py-2 shadow-none">
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
          </Card>
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
          <Card className="flex flex-row justify-between bg-content2 px-5 py-2 shadow-none">
            {scriptsSuccessful ? "True" : "False"}
          </Card>
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
