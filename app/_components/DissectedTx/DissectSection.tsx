import type { IGraphicalTransaction } from "~/app/_interfaces";
import { EmptyBlock, P, PropBlock } from "../Constructors";
import TOPICS from "./topics";

export function DissectSection({ tx }: { tx: IGraphicalTransaction }) {
  const {
    txHash,
    fee,
    validityStart,
    ttl,
    inputs,
    outputs,
    // mints,
    // scriptsSuccessful,
    // blockHash,
    // blockTxIndex,
    // blockHeight,
    // blockAbsoluteSlot,
    // withdrawals,
    // redeemers,
    metadata,
    // size,
  } = tx;
  return (
    <div className="flex h-screen flex-col gap-0 overflow-auto p-10 pt-32">
      <h4 className="text-3xl">Valid CBOR data</h4>
      <P>Your HEX bytes were successfully decoded using the CBOR standard.</P>
      <PropBlock title="Tx Hash" value={txHash} description={TOPICS.hash} />
      <PropBlock title="Fee" value={fee.toString()} description={TOPICS.fee} />
      <PropBlock title="Start" value={validityStart?.toString()} />
      <PropBlock
        title="Time to live"
        value={ttl?.toString()}
        description={TOPICS.ttl}
      />
      <blockquote className="mt-6 border-dashed py-4 md:border-l-4 md:px-7">
        <h4 className="text-3xl">Transaction Inputs</h4>
        <P>{TOPICS.inputs}</P>
        {inputs
          .filter((i) => !i.isReferenceInput)
          .map(({ txHash, index }, i) => (
            <blockquote
              className="mt-6 border-dashed py-4 md:border-l-4 md:px-7"
              key={i}
            >
              <h4 className="text-3xl">Input</h4>
              <PropBlock
                title="UtxoRef Hash"
                description={i == 0 ? TOPICS.inputs_hash : ""}
                value={txHash}
              />
              <PropBlock
                title="UtxoRef Index"
                description={i == 0 ? TOPICS.inputs_index : ""}
                value={index.toString()}
              />
            </blockquote>
          ))}
      </blockquote>
      <blockquote className="mt-6 border-dashed py-4 md:border-l-4 md:px-7">
        <h4 className="text-3xl">Transaction Outputs</h4>
        <P>{TOPICS.outputs}</P>
        {outputs.map(({ txHash, index, address }, i) => (
          // TODO: Add assets, datum and reedemers
          <blockquote
            className="mt-6 border-dashed py-4 md:border-l-4 md:px-7"
            key={i}
          >
            <h4 className="text-3xl">Output</h4>
            <PropBlock title="Tx Hash" value={txHash} />
            <PropBlock title="Output Index" value={index.toString()} />
            <blockquote className="mt-6 border-dashed py-4 md:border-l-4 md:px-7">
              <h4 className="text-3xl">Address</h4>
              <PropBlock title="Header Type" value={address?.headerType} />
              <PropBlock title="Kind" value={address?.kind} />
              <PropBlock title="Network Type" value={address?.netType} />
              <PropBlock title="Bech32" value={address?.bech32} />
              <PropBlock title="Payment" value={address?.payment} />
            </blockquote>
          </blockquote>
        ))}
      </blockquote>
      <blockquote className="mt-6 border-dashed py-4 md:border-l-4 md:px-7">
        <h4 className="text-3xl">Reference Inputs</h4>
        <P>{TOPICS.reference_inputs}</P>
        {inputs
          .filter((i) => i.isReferenceInput)
          .map(({ txHash, index }, i) => (
            <blockquote
              className="mt-6 border-dashed py-4 md:border-l-4 md:px-7"
              key={i}
            >
              <h4 className="text-3xl">Input</h4>
              <PropBlock
                title="UtxoRef Hash"
                description={i == 0 ? TOPICS.inputs_hash : ""}
                value={txHash}
              />
              <PropBlock
                title="UtxoRef Index"
                description={i == 0 ? TOPICS.inputs_index : ""}
                value={index.toString()}
              />
            </blockquote>
          ))}
        {inputs.filter((i) => i.isReferenceInput).length === 0 && (
          <EmptyBlock />
        )}
      </blockquote>
      <blockquote className="mt-6 border-dashed py-4 md:border-l-4 md:px-7">
        <h4 className="text-3xl">Transaction Mints</h4>
        <P>{TOPICS.mints}</P>
        {/* TODO: Complete when assets interface is done */}
      </blockquote>
      <blockquote className="mt-6 border-dashed py-4 md:border-l-4 md:px-7">
        <h4 className="text-3xl">Transaction Metadata</h4>
        <P>{TOPICS.metadata}</P>
        {metadata?.map(({ label, jsonMetadata }, i) => (
          <blockquote
            className="mt-6 border-dashed py-4 md:border-l-4 md:px-7"
            key={i}
          >
            <h4 className="text-3xl">Metadatum</h4>
            <PropBlock
              title="Metadata Label"
              description={i == 0 ? TOPICS.inputs_hash : ""}
              value={label.toString()}
            />
            {/* <PropBlock
              title="Metadatum Value"
              description={i == 0 ? TOPICS.inputs_index : ""}
              value={jsonMetadata}
            /> */}
          </blockquote>
        ))}
      </blockquote>
    </div>
  );
}
