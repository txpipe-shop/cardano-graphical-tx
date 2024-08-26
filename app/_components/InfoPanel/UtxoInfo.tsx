"use client";
import {
  Accordion,
  AccordionItem,
  Card,
  Chip,
  useDisclosure,
} from "@nextui-org/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useContext } from "react";
import { GraphicalContext } from "~/app/_contexts";
import {
  JSONBIG,
  UTXO_URL_PARAM,
  getUtxo,
  handleCopy,
  trimString,
} from "~/app/_utils";
import { AssetCard } from "./AssetCard";
import { JSONModal } from "./JSONModal";
import CopyIcon from "/public/copy.svg";
import FullScreen from "/public/fullscreen.svg";

export const UtxoInfo = () => {
  const { transactions } = useContext(GraphicalContext);
  const searchParams = useSearchParams();
  const {
    isOpen: isOpenDatum,
    onOpen: onOpenDatum,
    onOpenChange: onOpenDatumChange,
  } = useDisclosure();
  const {
    isOpen: isOpenRedeemer,
    onOpen: onOpenRedeemer,
    onOpenChange: onOpenRedeemerChange,
  } = useDisclosure();

  const selectedUtxoHash = searchParams.get(UTXO_URL_PARAM);
  const selectedUtxo = getUtxo(transactions)(selectedUtxoHash!);
  if (!selectedUtxo) return null;

  const { utxoHash, assets, address, datum, redeemers } = selectedUtxo;

  const txTrim = trimString(utxoHash, 12);
  const addrTrim = trimString(address?.bech32 || "", 20);

  const disabledKeys = [
    !address ? "1" : "",
    !assets.length ? "2" : "",
    !datum ? "4" : "",
    !redeemers ? "5" : "",
  ].filter(Boolean);

  return (
    <>
      {!address && (
        <p>
          <b className="text-danger-500">Warning:</b> The following UTxO seems
          to be incomplete. This may occurs because you search for a CBOR into
          the wrong network or the transaction does not exist.
        </p>
      )}
      <Accordion
        selectionMode="multiple"
        defaultExpandedKeys={["1"]}
        disabledKeys={disabledKeys}
      >
        <AccordionItem
          key="1"
          title="Address"
          startContent={
            address?.kind && (
              <Chip
                color={address?.kind === "key" ? "primary" : "danger"}
                radius="sm"
                size="sm"
              >
                {address?.kind === "key" ? "Wallet" : "Script"}
              </Chip>
            )
          }
        >
          <Card className="flex flex-row justify-between bg-content2 px-5 py-2 shadow-none">
            <p>{address ? addrTrim : "No address found"}</p>
            <Image
              src={CopyIcon}
              alt="Copy"
              onClick={handleCopy(address?.bech32 || "")}
              className="cursor-pointer"
            />
          </Card>
          <Accordion selectionMode="multiple">
            <AccordionItem key="1" title="More info">
              <Card className="m-1 flex flex-row bg-content2 px-5 py-2 shadow-none">
                <b>Header type:</b>&nbsp;
                <p>{address?.headerType}</p>
              </Card>
              <Card className="m-1 flex flex-row bg-content2 px-5 py-2 shadow-none">
                <b>Network type:</b>&nbsp;
                <p>{address?.netType}</p>
              </Card>
              <Card className="m-1 flex flex-row justify-between bg-content2 px-5 py-2 shadow-none">
                <div className="flex">
                  <b>Payment:</b>&nbsp;
                  <p>{trimString(address?.payment ?? "", 14)}</p>
                </div>
                <Image
                  src={CopyIcon}
                  alt="Copy"
                  onClick={handleCopy(address?.payment || "")}
                  className="cursor-pointer"
                />
              </Card>
            </AccordionItem>
          </Accordion>
        </AccordionItem>

        <AccordionItem key="2" title="Assets">
          <div className="flex flex-col gap-2">
            {assets.map((asset, index) => (
              <AssetCard key={index} asset={asset} />
            ))}
          </div>
        </AccordionItem>

        <AccordionItem key="3" title="TxHash & index">
          <Card className="flex flex-row justify-between bg-content2 px-5 py-2 shadow-none">
            <p>{txTrim}</p>
            <Image
              src={CopyIcon}
              alt="Copy"
              onClick={handleCopy(utxoHash)}
              className="cursor-pointer"
            />
          </Card>
        </AccordionItem>

        <AccordionItem key="4" title="Datum">
          <JSONModal
            isOpen={isOpenDatum}
            onOpenChange={onOpenDatumChange}
            title="Datum"
          >
            <pre className="font-code bg-content2">
              {JSONBIG.stringify(datum, null, 2)}
            </pre>
          </JSONModal>
          {datum && (
            <Card className="gap-2 overflow-x-hidden bg-content2 px-5 py-2 shadow-none">
              <div className="absolute right-4">
                <Image
                  src={FullScreen}
                  alt="See Modal"
                  onClick={onOpenDatum}
                  className="cursor-pointer"
                />
              </div>
              <pre className="font-code overflow-x-auto">
                {JSONBIG.stringify(datum, null, 2)}
              </pre>
            </Card>
          )}
        </AccordionItem>

        <AccordionItem key="5" title="Redeemers">
          <JSONModal
            isOpen={isOpenRedeemer}
            onOpenChange={onOpenRedeemerChange}
            title="Redeemer"
          >
            <pre className="font-code bg-content2">
              {JSONBIG.stringify(redeemers?.data, null, 2)}
            </pre>
          </JSONModal>
          {redeemers && (
            <>
              <Card className="gap-2 overflow-x-hidden bg-content2 px-5 py-2 shadow-none">
                <div className="absolute right-4">
                  <Image
                    src={FullScreen}
                    alt="See Modal"
                    onClick={onOpenRedeemer}
                    className="cursor-pointer"
                  />
                </div>
                <pre className="font-code overflow-x-auto">
                  {JSONBIG.stringify(redeemers?.data, null, 2)}
                </pre>
              </Card>
              <Card className="mt-1 flex flex-row gap-2 overflow-x-hidden bg-content2 px-5 py-2 shadow-none">
                <b>Memory:</b>
                <p>{redeemers?.ex_units[0]}</p>
              </Card>
              <Card className="mt-1 flex flex-row gap-2 overflow-x-hidden bg-content2 px-5 py-2 shadow-none">
                <b>Steps:</b>
                <p>{redeemers?.ex_units[1]}</p>
              </Card>
            </>
          )}
        </AccordionItem>
      </Accordion>
    </>
  );
};