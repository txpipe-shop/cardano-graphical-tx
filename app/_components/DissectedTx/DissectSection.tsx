import { Accordion, AccordionItem } from "@nextui-org/accordion";
import type { IGraphicalTransaction } from "~/app/_interfaces";
import { JSONBIG } from "~/app/_utils";
import { EmptyBlock, P, PropBlock, Section } from "./Constructors";
import TOPICS from "./topics";

export function DissectSection({ tx }: { tx: IGraphicalTransaction }) {
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

  const vKeyWitnesses = witnesses?.vkeyWitnesses ?? [];
  const plutusDataWitnesses = witnesses?.plutusData ?? [];

  return (
    <div className="flex h-screen flex-col gap-0 overflow-auto p-10 pt-32">
      <Accordion
        selectionMode="multiple"
        variant="splitted"
        defaultExpandedKeys={[
          "valid-cbor",
          "inputs",
          "outputs",
          "reference-inputs",
          "certificates",
          "withdrawals",
          "mints",
          "metadata",
          "collateral",
          "witnesses",
        ]}
      >
        <AccordionItem
          key="valid-cbor"
          title={<h4 className="text-3xl">Valid CBOR data</h4>}
          subtitle={
            <P>
              Your HEX bytes were successfully decoded using the CBOR standard.
            </P>
          }
          textValue="Transaction Details"
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
          key="inputs"
          title={
            <h4 className="text-3xl font-bold text-blue-500 underline decoration-solid underline-offset-2">
              Transaction Inputs
            </h4>
          }
          subtitle={<P>{TOPICS.inputs}</P>}
          textValue="Transaction Inputs"
        >
          {inputs.filter((i) => !i.isReferenceInput).length > 0 ? (
            <Accordion selectionMode="multiple">
              {inputs
                .filter((i) => !i.isReferenceInput)
                .map(({ txHash, index }, i) => (
                  <AccordionItem
                    key={i}
                    title={
                      <h4 className="text-2xl text-blue-500">Input {i + 1}</h4>
                    }
                    textValue={`Input ${i + 1}`}
                  >
                    <Section title="">
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
                    </Section>
                  </AccordionItem>
                ))}
            </Accordion>
          ) : (
            <EmptyBlock />
          )}
        </AccordionItem>
        <AccordionItem
          key="outputs"
          title={
            <h4 className="text-3xl font-bold text-red-500 underline decoration-solid underline-offset-2">
              Transaction Outputs
            </h4>
          }
          subtitle={<P>{TOPICS.outputs}</P>}
          textValue="Transaction Outputs"
        >
          {outputs.length > 0 ? (
            <Accordion selectionMode="multiple">
              {outputs.map(
                ({ txHash, index, address, lovelace, assets }, i) => (
                  <AccordionItem
                    key={i}
                    title={
                      <h4 className="text-2xl text-red-500">Output {i + 1}</h4>
                    }
                    textValue={`Output ${i + 1}`}
                  >
                    <Section title="">
                      <PropBlock title="Tx Hash" value={txHash} />
                      <PropBlock title="Output Index" value={index} />
                      <Section title="Address">
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
                        <PropBlock
                          title="Network Type"
                          value={address?.netType}
                        />
                        <PropBlock title="Payment" value={address?.payment} />
                      </Section>
                      <Section title="Assets">
                        <PropBlock
                          title="Lovelace"
                          value={lovelace}
                          description={TOPICS.outputs_lovelace}
                        />
                        {assets.map(({ policyId, assetsPolicy }, j) => (
                          <Section key={j} title="Assets">
                            <PropBlock title="Policy Id" value={policyId} />
                            {assetsPolicy.map(
                              ({ assetName, assetNameAscii, amount }, k) => (
                                <Section title="Asset" key={k}>
                                  <PropBlock
                                    title="Asset Name"
                                    value={assetName}
                                  />
                                  <PropBlock
                                    title="Asset Name (ASCII)"
                                    value={assetNameAscii}
                                  />
                                  <PropBlock title="Amount" value={amount} />
                                </Section>
                              ),
                            )}
                          </Section>
                        ))}
                      </Section>
                    </Section>
                  </AccordionItem>
                ),
              )}
            </Accordion>
          ) : (
            <EmptyBlock />
          )}
        </AccordionItem>
        <AccordionItem
          key="reference-inputs"
          title={
            <h4 className="text-3xl font-bold text-blue-500 underline decoration-dashed underline-offset-2">
              Reference Inputs
            </h4>
          }
          subtitle={<P>{TOPICS.reference_inputs}</P>}
          textValue="Reference Inputs"
        >
          {inputs.filter((i) => i.isReferenceInput).length > 0 ? (
            <Accordion selectionMode="multiple">
              {inputs
                .filter((i) => i.isReferenceInput)
                .map(({ txHash, index }, i) => (
                  <AccordionItem
                    key={i}
                    title={
                      <h4 className="text-2xl text-blue-500 underline decoration-dashed underline-offset-2">
                        Reference Input {i + 1}
                      </h4>
                    }
                    textValue={`Reference Input ${i + 1}`}
                  >
                    <Section title="">
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
                    </Section>
                  </AccordionItem>
                ))}
            </Accordion>
          ) : (
            <EmptyBlock />
          )}
        </AccordionItem>
        <AccordionItem
          key="certificates"
          title={<h4 className="f text-3xl">Certificates</h4>}
          textValue="Certificates"
        >
          {certificates?.map(({ json }, i) => (
            <Section title="Certificate" titleClass="text-blue-500" key={i}>
              <PropBlock title="JSON" value={json} />
            </Section>
          ))}
          {certificates?.length === 0 && <EmptyBlock />}
        </AccordionItem>
        <AccordionItem
          key="withdrawals"
          title={<h4 className="text-3xl">Withdrawals</h4>}
          textValue="Withdrawals"
        >
          {withdrawals?.map(({ rawAddress, amount }, i) => (
            <Section title="Withdrawal" key={i}>
              <PropBlock title="Raw Address" value={rawAddress} />
              <PropBlock title="Amount" value={amount} />
            </Section>
          ))}
          {withdrawals?.length === 0 && <EmptyBlock />}
        </AccordionItem>
        <AccordionItem
          key="mints"
          title={<h4 className="text-3xl">Transaction Mints</h4>}
          textValue="Transaction Mints"
          subtitle={<P>{TOPICS.mints}</P>}
        >
          {mints.map(({ policyId, assetsPolicy }, i) => {
            const mint = assetsPolicy.find((a) => a.amount && a.amount > 0);
            return (
              <Section title="Policy ID" key={i}>
                <PropBlock
                  title="Policy Id"
                  value={policyId}
                  color={mint ? "green" : "red"}
                />
                {assetsPolicy.map(
                  ({ assetName, assetNameAscii, amount }, i) => (
                    <Section title="Asset" key={i}>
                      <PropBlock title="Asset Name" value={assetName} />
                      <PropBlock title="Asset Name" value={assetNameAscii} />
                      <PropBlock title="Amount" value={amount} />
                    </Section>
                  ),
                )}
              </Section>
            );
          })}
          {mints.length === 0 && <PropBlock value="No minting or burning" />}
        </AccordionItem>
        <AccordionItem
          key="metadata"
          title={<h4 className="text-3xl">Transaction Metadata</h4>}
          textValue="Transaction Metadata"
          subtitle={<P>{TOPICS.metadata}</P>}
        >
          {metadata?.map(({ label, jsonMetadata }, i) => (
            <Section title="Metadatum" key={i}>
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
            </Section>
          ))}
          {metadata?.length === 0 && <EmptyBlock />}
        </AccordionItem>
        <AccordionItem
          key="collateral"
          title={<h4 className="text-3xl">Collateral</h4>}
          textValue="Collateral"
        >
          <blockquote className="">
            {collateral?.collateralReturn.map(({ txHash, index }, i) => (
              <blockquote className="" key={i}>
                <h4 className="text-3xl">Collateral Return</h4>
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
              </blockquote>
            ))}
            <PropBlock title="Total" value={collateral?.total} />
          </blockquote>
        </AccordionItem>
        <AccordionItem
          key="witnesses"
          title={<h4 className="text-3xl">Witnesses</h4>}
          textValue="Witnesses"
          subtitle={<P>{TOPICS.witnesses}</P>}
        >
          {vKeyWitnesses.length > 0 ? (
            <Accordion selectionMode="multiple">
              {vKeyWitnesses.map(({ hash, key, signature }, i) => (
                <AccordionItem
                  key={i}
                  title={
                    <h4 className="text-2xl">
                      Verification Key Witness {i + 1}
                    </h4>
                  }
                  textValue={`Verification Key Witness ${i + 1}`}
                >
                  <Section title="">
                    <PropBlock
                      title="Key"
                      value={key}
                      description={i == 0 ? TOPICS.vkey_witness : ""}
                    />
                    <PropBlock title="Hash" value={hash} />
                    <PropBlock title="Signature" value={signature} />
                  </Section>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <EmptyBlock title="Verification Key Witness" />
          )}
          {plutusDataWitnesses.length > 0 ? (
            <Accordion selectionMode="multiple">
              {plutusDataWitnesses.map(({ hash, bytes, json }, i) => (
                <AccordionItem
                  key={i}
                  title={
                    <h4 className="text-2xl">Transaction Datum {i + 1}</h4>
                  }
                  textValue={`Transaction Datum ${i + 1}`}
                >
                  <Section title="">
                    <P>{TOPICS.datum}</P>
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
                  </Section>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <EmptyBlock title="Transaction Datum" />
          )}
        </AccordionItem>
      </Accordion>
    </div>
  );
}
