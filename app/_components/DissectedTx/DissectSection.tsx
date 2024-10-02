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

  return (
    <div className="flex h-screen flex-col gap-0 overflow-auto p-10 pt-32">
      <h4 className="text-3xl">Valid CBOR data</h4>
      <P>Your HEX bytes were successfully decoded using the CBOR standard.</P>
      {propsBlocks.map(({ title, value, description }, i) => (
        <PropBlock
          title={title}
          value={value}
          description={i == 0 ? TOPICS.tx : description}
          key={i}
        />
      ))}

      <h4 className="text-3xl font-bold text-blue-500 underline decoration-solid underline-offset-2">
        Transaction Inputs
      </h4>
      <P>{TOPICS.inputs}</P>
      {inputs
        .filter((i) => !i.isReferenceInput)
        .map(({ txHash, index }, i) => (
          <Section key={i} title="Input" titleClass="text-blue-500">
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
        ))}
      {inputs.filter((i) => !i.isReferenceInput).length === 0 && <EmptyBlock />}

      <h4 className="text-3xl font-bold text-red-500 underline decoration-solid underline-offset-2">
        Transaction Outputs
      </h4>
      <P>{TOPICS.outputs}</P>
      {outputs.map(({ txHash, index, address, lovelace, assets }, i) => (
        <Section title="Output" titleClass="text-red-500" key={i}>
          <PropBlock title="Tx Hash" value={txHash} />
          <PropBlock title="Output Index" value={index} />
          <Section title="Address">
            <PropBlock
              title="Bech32"
              value={address?.bech32}
              description={TOPICS.outputs_address}
            />
            <PropBlock title="Header Type" value={address?.headerType} />
            <PropBlock title="Kind" value={address?.kind} />
            <PropBlock title="Network Type" value={address?.netType} />
            <PropBlock title="Payment" value={address?.payment} />
          </Section>
          <Section title="Assets">
            <PropBlock
              title="Lovelace"
              value={lovelace}
              description={TOPICS.outputs_lovelace}
            />
            {assets.map(({ policyId, assetsPolicy }, i) => (
              <Section key={i} title="Assets">
                <PropBlock title="Policy Id" value={policyId} />
                {assetsPolicy.map(
                  ({ assetName, assetNameAscii, amount }, i) => (
                    <Section title="Asset" key={i}>
                      <PropBlock title="Asset Name" value={assetName} />
                      <PropBlock
                        title="Asset Name (ASCII)"
                        value={assetNameAscii}
                      />
                      <PropBlock title="amount" value={amount} />
                    </Section>
                  ),
                )}
              </Section>
            ))}
          </Section>
        </Section>
      ))}
      {outputs.length === 0 && <EmptyBlock />}

      <h4 className="text-3xl font-bold text-blue-500 underline decoration-dashed underline-offset-2">
        Reference Inputs
      </h4>
      <P>{TOPICS.reference_inputs}</P>
      {inputs
        .filter((i) => i.isReferenceInput)
        .map(({ txHash, index }, i) => (
          <Section title="Input" titleClass="text-blue-500" key={i}>
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
        ))}
      {inputs.filter((i) => i.isReferenceInput).length === 0 && <EmptyBlock />}

      <h4 className="text-3xl">Certificates</h4>
      {certificates?.map(({ json }, i) => (
        <Section title="Certificate" titleClass="text-blue-500" key={i}>
          <PropBlock title="JSON" value={json} />
        </Section>
      ))}
      {certificates?.length === 0 && <EmptyBlock />}

      <h4 className="text-3xl">Withdrawals</h4>
      {withdrawals?.map(({ rawAddress, amount }, i) => (
        <Section title="Withdrawal" key={i}>
          <PropBlock title="Raw Address" value={rawAddress} />
          <PropBlock title="Amount" value={amount} />
        </Section>
      ))}
      {withdrawals?.length === 0 && <EmptyBlock />}

      <h4 className="text-3xl">Transaction Mints</h4>
      <P>{TOPICS.mints}</P>
      {mints.map(({ policyId, assetsPolicy }, i) => {
        const mint = assetsPolicy.find((a) => a.amount && a.amount > 0);
        return (
          <Section title="Policy ID" key={i}>
            <PropBlock
              title="Policy Id"
              value={policyId}
              color={mint ? "green" : "red"}
            />
            {assetsPolicy.map(({ assetName, assetNameAscii, amount }, i) => (
              <Section title="Asset" key={i}>
                <PropBlock title="Asset Name" value={assetName} />
                <PropBlock title="Asset Name" value={assetNameAscii} />
                <PropBlock title="Amount" value={amount} />
              </Section>
            ))}
          </Section>
        );
      })}
      {mints.length === 0 && <PropBlock value="No minting or burning" />}

      <h4 className="text-3xl">Transaction Metadata</h4>
      <P>{TOPICS.metadata}</P>
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

      <blockquote className="">
        <h4 className="text-3xl">Collateral</h4>
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

      <h4 className="text-3xl">Witnesses</h4>
      <P>{TOPICS.witnesses}</P>

      {witnesses?.vkeyWitnesses.map(({ hash, key, signature }, i) => (
        <Section title="Verification Key Witness" key={i}>
          <PropBlock
            title="Key"
            value={key}
            description={i == 0 ? TOPICS.vkey_witness : ""}
          />
          <PropBlock title="Hash" value={hash} />
          <PropBlock title="Signature" value={signature} />
        </Section>
      ))}
      {witnesses?.vkeyWitnesses.length === 0 && (
        <EmptyBlock title="Verification Key Witness" />
      )}

      {witnesses?.plutusData.map(({ hash, bytes, json }, i) => (
        <Section title="Transaction datum" key={i}>
          <P>{TOPICS.datum}</P>
          <PropBlock
            title="Hash"
            value={hash}
            description={i == 0 ? TOPICS.datum_hash : ""}
          />
          <PropBlock title="Bytes" value={bytes} />
          <PropBlock
            title="JSON"
            value={json}
            description={i == 0 ? TOPICS.datum_json : ""}
          />
        </Section>
      ))}
      {witnesses?.plutusData.length === 0 && (
        <EmptyBlock title="Transaction Datum" />
      )}
    </div>
  );
}
