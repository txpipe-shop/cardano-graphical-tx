"use client";
import {
  Accordion,
  AccordionItem,
  Chip,
  useDisclosure,
} from "@heroui/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useGraphical } from "~/app/_contexts";
import {
  JSONBIG,
  UTXO_URL_PARAM,
  getUtxo,
  getUtxoIndex,
  handleCopy,
  trimString,
} from "~/app/_utils";
import CopyIcon from "~/public/copy.svg";
import FullScreen from "~/public/fullscreen.svg";
import { AssetCard } from "./AssetCard";
import { InfoPanelRow } from "./InfoPanelRow";
import { JSONModal } from "./JSONModal";

export const UtxoInfo = () => {
  const { transactions } = useGraphical();
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

  const { scriptRef, txHash, assets, address, datum } = selectedUtxo;

  const txTrim = trimString(txHash, 12);
  const addrTrim = trimString(address?.bech32 || "", 20);
  const txWichInputIsSelectedUtxo = transactions.transactions.find((tx) =>
    tx.inputs.some(
      (input) =>
        input.txHash === selectedUtxo.txHash &&
        input.index === selectedUtxo.index,
    ),
  );

  const index = getUtxoIndex(transactions.transactions)(selectedUtxoHash!);
  const redeemerInfo = txWichInputIsSelectedUtxo?.witnesses?.redeemers?.find(
    (redeemer) => redeemer.tag === "Spend" && redeemer.index === index,
  );

  const disabledKeys = [
    !address ? "1" : "",
    !assets.length && selectedUtxo.lovelace <= 0 ? "2" : "",
    !datum ? "4" : "",
    !scriptRef ? "5" : "",
    !redeemerInfo ? "6" : "",
  ].filter(Boolean);
  return (
    <>
      {!address && (
        <p>
          <b className="text-red-2">Warning:</b> The following UTxO seems to be
          incomplete. This may have occurred because you searched for a CBOR on
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
          <InfoPanelRow justify="between">
            <p>{address ? addrTrim : "No address found"}</p>
            <Image
              src={CopyIcon}
              alt="Copy"
              onClick={handleCopy(address?.bech32 || "")}
              className="cursor-pointer"
            />
          </InfoPanelRow>
          <Accordion selectionMode="multiple">
            <AccordionItem key="1" title="More info">
              <InfoPanelRow className="m-1">
                <b>Header type:</b>&nbsp;
                <p>{address?.headerType}</p>
              </InfoPanelRow>
              <InfoPanelRow className="m-1">
                <b>Network type:</b>&nbsp;
                <p>{address?.netType}</p>
              </InfoPanelRow>
              <InfoPanelRow className="m-1" justify="between">
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
              </InfoPanelRow>
            </AccordionItem>
          </Accordion>
        </AccordionItem>

        <AccordionItem key="2" title="Assets">
          <div className="flex flex-col gap-2">
            <AssetCard
              asset={{
                assetName: "lovelace",
                amount: selectedUtxo.lovelace,
              }}
              policyId={""}
            />
            {assets.map(({ policyId, assetsPolicy }, index) =>
              assetsPolicy.map((asset) => (
                <AssetCard key={index} asset={asset} policyId={policyId} />
              )),
            )}
          </div>
        </AccordionItem>

        <AccordionItem key="3" title="TxHash & index">
          <InfoPanelRow justify="between">
            <p>{txTrim}</p>
            <Image
              src={CopyIcon}
              alt="Copy"
              onClick={handleCopy(txHash)}
              className="cursor-pointer"
            />
          </InfoPanelRow>
        </AccordionItem>

        <AccordionItem key="4" title="Datum">
          <JSONModal
            isOpen={isOpenDatum}
            onOpenChange={onOpenDatumChange}
            title="Datum"
          >
            <pre className="font-code bg-surface">
              {JSONBIG.stringify(datum, null, 2)}
            </pre>
          </JSONModal>
          {datum && (
            <InfoPanelRow gap className="overflow-x-hidden">
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
            </InfoPanelRow>
          )}
        </AccordionItem>

        <AccordionItem key="5" title="Script Reference">
          <InfoPanelRow className="h-16 w-full" justify="between">
            <p className="overflow-hidden text-ellipsis whitespace-normal break-words">
              {scriptRef || ""}
            </p>
            <Image
              src={CopyIcon}
              alt="Copy"
              onClick={handleCopy(scriptRef ?? "")}
              className="ml-2 cursor-pointer"
            />
          </InfoPanelRow>
        </AccordionItem>

        <AccordionItem key="6" title="Redeemer">
          {redeemerInfo && (
            <>
              <JSONModal
                isOpen={isOpenRedeemer}
                onOpenChange={onOpenRedeemerChange}
                title="Redeemer"
              >
                <pre className="font-code bg-surface">
                  {JSONBIG.stringify(
                    JSON.parse(redeemerInfo?.dataJson),
                    null,
                    2,
                  )}
                </pre>
              </JSONModal>
              <InfoPanelRow gap className="overflow-x-hidden">
                <div className="absolute right-4">
                  <Image
                    src={FullScreen}
                    alt="See Modal"
                    onClick={onOpenRedeemer}
                    className="cursor-pointer"
                  />
                </div>
                <pre className="font-code overflow-x-auto">
                  {JSONBIG.stringify(
                    JSON.parse(redeemerInfo?.dataJson),
                    null,
                    2,
                  )}
                </pre>
              </InfoPanelRow>
              <InfoPanelRow gap className="mt-1 overflow-x-hidden">
                <b>Memory:</b>
                <p>{redeemerInfo.exUnits.mem}</p>
              </InfoPanelRow>
              <InfoPanelRow gap className="mt-1 overflow-x-hidden">
                <b>Steps:</b>
                <p>{redeemerInfo.exUnits.steps}</p>
              </InfoPanelRow>
            </>
          )}
        </AccordionItem>
      </Accordion>
    </>
  );
};
