import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Chip } from "@nextui-org/react";
import { useUI } from "~/app/_contexts";
import type { IGraphicalTransaction } from "~/app/_interfaces";
import { JSONBIG } from "~/app/_utils";
import Loading from "~/app/loading";
import { EmptyBlock, PropBlock } from "./Constructors";
import {
  accordionItemProps,
  accordionProps,
  defaultStyle,
} from "./dissect.herlpers";
import TOPICS from "./topics";

export function DissectSection({ tx }: { tx: IGraphicalTransaction }) {
  const { loading } = useUI();
  const {
    era,
    txHash,
    fee,
    validityStart,
    ttl,
    inputs,
    outputs,
    certificates,
    withdrawals,
    mints,
    metadata,
    blockHash,
    blockTxIndex,
    blockHeight,
    blockAbsoluteSlot,
    witnesses,
    collateral,
    size,
  } = tx;

  const propsBlocks = [
    { title: "Era", value: era, description: TOPICS.era },
    { title: "Tx Hash", value: txHash, description: TOPICS.hash },
    { title: "Block Hash", value: blockHash },
    { title: "Block Index", value: blockTxIndex },
    { title: "Block Height", value: blockHeight },
    { title: "Block Absolute Slot", value: blockAbsoluteSlot },
    { title: "Size", value: size },
    { title: "Fee", value: fee, description: TOPICS.fee },
    { title: "Start", value: validityStart },
    { title: "Time to Live", value: ttl, description: TOPICS.ttl },
  ];
  const normalInputs = inputs.filter((i) => !i.isReferenceInput);
  const referenceInputs = inputs.filter((i) => i.isReferenceInput);

  if (loading) return <Loading />;

  return (
    <div className="flex flex-grow flex-col gap-0 p-5">
      <Accordion
        selectionMode="multiple"
        showDivider={false}
        defaultExpandedKeys={[
          "Valid CBOR data",
          "Transaction Inputs",
          "Transaction Outputs",
          "Reference Inputs",
          "Certificates",
          "Withdrawals",
          "Transaction Mints",
          "Transaction Metadata",
          "Collateral",
          "Transaction Witnesses",
        ]}
      >
        <AccordionItem
          key="Valid CBOR data"
          {...accordionItemProps(
            "Valid CBOR data",
            defaultStyle(),
            "Your HEX bytes were successfully decoded using the CBOR standard.",
          )}
        >
          {propsBlocks.map(({ title, value, description }, i) => (
            <PropBlock
              title={title}
              value={value}
              description={i == 0 ? TOPICS.tx : description}
              key={i}
            />
          ))}
        </AccordionItem>
        <AccordionItem
          key="Transaction Inputs"
          {...accordionItemProps(
            "Transaction Inputs",
            defaultStyle(
              "font-bold text-blue-500 underline decoration-solid underline-offset-2",
            ),
            TOPICS.inputs,
          )}
        >
          {normalInputs.length > 0 ? (
            <Accordion {...accordionProps(normalInputs)}>
              {normalInputs.map(({ txHash, index }, i) => (
                <AccordionItem
                  key={i}
                  {...accordionItemProps(
                    "Input " + (i + 1).toString(),
                    defaultStyle("text-2xl text-blue-500", "px-7"),
                  )}
                  startContent={
                    witnesses?.redeemers.find(
                      (r) => r.index === i && r.tag === "Spend",
                    ) && (
                      <div
                        onPointerDown={(e) => {
                          e.stopPropagation();
                          document
                            .getElementById(`Spend-${i}`)
                            ?.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                        }}
                      >
                        <Chip color="primary" radius="sm" size="sm">
                          Redeemer
                        </Chip>
                      </div>
                    )
                  }
                >
                  <PropBlock
                    title="UtxoRef Hash"
                    description={i == 0 ? TOPICS.inputs_hash : ""}
                    value={txHash}
                  />
                  <PropBlock
                    title="UtxoRef Index"
                    description={i == 0 ? TOPICS.inputs_index : ""}
                    value={index}
                  />
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <EmptyBlock />
          )}
        </AccordionItem>
        <AccordionItem
          key="Transaction Outputs"
          {...accordionItemProps(
            "Transaction Outputs",
            defaultStyle(
              "font-bold text-red-500 underline decoration-solid underline-offset-2",
            ),
            TOPICS.outputs,
          )}
        >
          {outputs.length > 0 ? (
            <Accordion {...accordionProps(outputs)}>
              {outputs.map(
                ({ txHash, index, address, lovelace, assets }, i) => (
                  <AccordionItem
                    key={i}
                    {...accordionItemProps(
                      "Output " + (i + 1).toString(),
                      defaultStyle("text-2xl text-red-500", "px-7"),
                    )}
                  >
                    <PropBlock title="Tx Hash" value={txHash} />
                    <PropBlock title="Output Index" value={index} />
                    <PropBlock
                      title="Bech32"
                      value={address?.bech32}
                      description={TOPICS.outputs_address}
                    />
                    <PropBlock
                      title="Header Type"
                      value={address?.headerType}
                    />
                    <PropBlock title="Kind" value={address?.kind} />
                    <PropBlock title="Network Type" value={address?.netType} />
                    <PropBlock title="Payment" value={address?.payment} />
                    <PropBlock
                      title="Lovelace"
                      value={lovelace}
                      description={TOPICS.outputs_lovelace}
                    />
                    <Accordion {...accordionProps(assets)}>
                      {assets.map(({ policyId, assetsPolicy }, j) => (
                        <AccordionItem
                          key={j}
                          {...accordionItemProps(
                            "Policy Assets",
                            defaultStyle("text-2xl", "px-6"),
                          )}
                        >
                          <PropBlock title="Policy Id" value={policyId} />
                          <Accordion {...accordionProps(assetsPolicy)}>
                            <AccordionItem
                              key={policyId + i}
                              {...accordionItemProps(
                                `Assets (${assetsPolicy.length})`,
                                defaultStyle("text-xl", "px-5"),
                              )}
                            >
                              {assetsPolicy.map((a, k) => (
                                <div key={k}>
                                  <h4 className="text-lg">Asset {k + 1}</h4>
                                  <PropBlock
                                    title="Asset Name"
                                    value={a.assetName}
                                  />
                                  <PropBlock
                                    title="Asset Name (ASCII)"
                                    value={a.assetNameAscii}
                                  />
                                  <PropBlock title="Amount" value={a.amount} />
                                </div>
                              ))}
                            </AccordionItem>
                          </Accordion>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </AccordionItem>
                ),
              )}
            </Accordion>
          ) : (
            <EmptyBlock />
          )}
        </AccordionItem>
        <AccordionItem
          key="Reference Inputs"
          {...accordionItemProps(
            "Reference Inputs",
            defaultStyle(
              "font-bold text-blue-500 underline decoration-dashed underline-offset-2",
            ),
            TOPICS.reference_inputs,
          )}
        >
          {referenceInputs.length > 0 ? (
            <Accordion {...accordionProps(referenceInputs)}>
              {referenceInputs.map(({ txHash, index }, i) => (
                <AccordionItem
                  key={i}
                  {...accordionItemProps(
                    "Reference Input " + (i + 1).toString(),
                    defaultStyle(
                      "text-2xl text-blue-500 underline decoration-dashed underline-offset-2",
                      "px-7",
                    ),
                  )}
                >
                  <PropBlock
                    title="UtxoRef Hash"
                    value={txHash}
                    description={i == 0 ? TOPICS.inputs_hash : ""}
                  />
                  <PropBlock
                    title="UtxoRef Index"
                    value={index}
                    description={i == 0 ? TOPICS.inputs_index : ""}
                  />
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <EmptyBlock />
          )}
        </AccordionItem>
        <AccordionItem
          key="Certificates"
          {...accordionItemProps("Certificates", defaultStyle())}
        >
          {(certificates ?? [])?.length > 0 ? (
            <Accordion
              selectionMode="multiple"
              defaultExpandedKeys={[
                ...Array((certificates ?? []).length + 1).keys(),
              ].map(String)}
            >
              {(certificates ?? []).map(({ json }, i) => (
                <AccordionItem
                  key={i}
                  {...accordionItemProps(
                    `Certificate ${i + 1}`,
                    defaultStyle("text-2xl", "px-7"),
                  )}
                >
                  <PropBlock title="JSON" value={JSON.parse(json)} />
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <EmptyBlock />
          )}
        </AccordionItem>
        <AccordionItem
          key="Withdrawals"
          {...accordionItemProps("Withdrawals", defaultStyle())}
        >
          {(withdrawals ?? []).length > 0 ? (
            <Accordion {...accordionProps(withdrawals ?? [])}>
              {(withdrawals ?? []).map(({ rawAddress, amount }, i) => (
                <AccordionItem
                  key={i}
                  {...accordionItemProps(
                    `Withdrawal ${i + 1}`,
                    defaultStyle("text-2xl", "px-7"),
                  )}
                >
                  <PropBlock title="Raw Address" value={rawAddress} />
                  <PropBlock title="Amount" value={amount} />
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <EmptyBlock />
          )}
        </AccordionItem>
        <AccordionItem
          key="Transaction Mints"
          {...accordionItemProps(
            "Transaction Mints",
            defaultStyle(),
            TOPICS.mints,
          )}
        >
          {mints.length > 0 ? (
            <Accordion {...accordionProps(mints)}>
              {mints.map(({ policyId, assetsPolicy }, i) => {
                const mint = assetsPolicy.find((a) => a.amount && a.amount > 0);
                return (
                  <AccordionItem
                    key={i}
                    {...accordionItemProps(
                      `${mint ? "Minted" : "Burned"} token ${i + 1}`,
                      defaultStyle("text-2xl", "px-7"),
                    )}
                  >
                    <PropBlock
                      title="Policy Id"
                      value={policyId}
                      color={mint ? "green" : "red"}
                    />
                    {assetsPolicy.map(
                      ({ assetName, assetNameAscii, amount }, j) => (
                        <div key={j}>
                          <PropBlock title="Asset Name" value={assetName} />
                          <PropBlock
                            title="Asset Name (ASCII)"
                            value={assetNameAscii}
                          />
                          <PropBlock title="Amount" value={amount} />
                        </div>
                      ),
                    )}
                  </AccordionItem>
                );
              })}
            </Accordion>
          ) : (
            <PropBlock value="No minting or burning" />
          )}
        </AccordionItem>
        <AccordionItem
          key="Transaction Metadata"
          {...accordionItemProps(
            "Transaction Metadata",
            defaultStyle(),
            TOPICS.metadata,
          )}
        >
          {metadata?.map(({ label, jsonMetadata }, i) => (
            <div key={i}>
              <PropBlock
                title="Metadata Label"
                value={label}
                description={i == 0 ? TOPICS.inputs_hash : ""}
              />
              <PropBlock
                title="Metadatum Value"
                value={JSONBIG.stringify(jsonMetadata, null, 2)}
                description={i == 0 ? TOPICS.inputs_index : ""}
              />
            </div>
          ))}
          {metadata?.length === 0 && <EmptyBlock />}
        </AccordionItem>
        <AccordionItem
          key="Collateral"
          {...accordionItemProps("Collateral", defaultStyle("", "px-7"))}
        >
          {collateral?.collateralReturn.map(({ txHash, index }, i) => (
            <div key={i}>
              <h4 className="text-2xl">Collateral Return</h4>
              <PropBlock
                title="UtxoRef Hash"
                value={txHash}
                description={i == 0 ? TOPICS.inputs_hash : ""}
              />
              <PropBlock
                title="UtxoRef Index"
                value={index}
                description={i == 0 ? TOPICS.inputs_index : ""}
              />
            </div>
          ))}
          <PropBlock title="Total" value={collateral?.total} />
        </AccordionItem>
        <AccordionItem
          key="Transaction Witnesses"
          {...accordionItemProps(
            "Transaction Witnesses",
            defaultStyle("", "px-7"),
            TOPICS.witnesses,
          )}
        >
          {(witnesses?.vkeyWitnesses ?? []).length > 0 ? (
            <Accordion {...accordionProps(witnesses?.vkeyWitnesses ?? [])}>
              {(witnesses?.vkeyWitnesses ?? []).map(
                ({ hash, key, signature }, i) => (
                  <AccordionItem
                    key={i}
                    {...accordionItemProps(
                      `Verification Key Witness ${i + 1}`,
                      defaultStyle("text-2xl", "px-5"),
                    )}
                  >
                    <PropBlock
                      title="Key"
                      value={key}
                      description={i == 0 ? TOPICS.vkey_witness : ""}
                    />
                    <PropBlock title="Hash" value={hash} />
                    <PropBlock title="Signature" value={signature} />
                  </AccordionItem>
                ),
              )}
            </Accordion>
          ) : (
            <EmptyBlock title="Verification Key Witness" />
          )}
          {(witnesses?.redeemers ?? []).length > 0 ? (
            <Accordion {...accordionProps(witnesses?.redeemers ?? [])}>
              {(witnesses?.redeemers ?? []).map(
                ({ tag, index, dataJson, exUnits }, i) => (
                  <AccordionItem
                    key={i}
                    id={tag + "-" + index}
                    {...accordionItemProps(
                      `Redeemer ${i + 1}`,
                      defaultStyle("text-2xl", "px-5"),
                    )}
                  >
                    <PropBlock title="Tag" value={tag} />
                    <PropBlock title="Index" value={index} />
                    <PropBlock
                      title="Data"
                      value={JSONBIG.stringify(JSON.parse(dataJson), null, 2)}
                    />
                    <PropBlock title="Ex Mem Units" value={exUnits.mem} />
                    <PropBlock title="Ex Steps Units" value={exUnits.steps} />
                  </AccordionItem>
                ),
              )}
            </Accordion>
          ) : (
            <EmptyBlock title="Reedemers" />
          )}
          {(witnesses?.plutusData ?? []).length > 0 ? (
            <Accordion {...accordionProps(witnesses?.plutusData ?? [])}>
              {(witnesses?.plutusData ?? []).map(({ hash, bytes, json }, i) => (
                <AccordionItem
                  key={i}
                  {...accordionItemProps(
                    `Plutus Data Witness ${i + 1}`,
                    defaultStyle("text-2xl", "px-5"),
                    TOPICS.datum,
                  )}
                >
                  <PropBlock
                    title="Hash"
                    value={hash}
                    description={i === 0 ? TOPICS.datum_hash : ""}
                  />
                  <PropBlock title="Bytes" value={bytes} />
                  <PropBlock
                    title="JSON"
                    value={json}
                    description={i === 0 ? TOPICS.datum_json : ""}
                  />
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <EmptyBlock title="Plutus Data" />
          )}
        </AccordionItem>
      </Accordion>
    </div>
  );
}
