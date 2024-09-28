import type { IGraphicalTransaction } from "~/app/_interfaces";
import { JSONBIG } from "~/app/_utils";
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
    mints,
    scriptsSuccessful,
    metadata,
    // blockHash,
    // blockTxIndex,
    // blockHeight,
    // blockAbsoluteSlot,
    // withdrawals,
    // redeemers,
    // size,
  } = tx;
  return (
    <div className="flex h-screen flex-col gap-0 overflow-auto p-10 pt-32">
      <h4 className="text-3xl">Valid CBOR data</h4>
      <P>Your HEX bytes were successfully decoded using the CBOR standard.</P>
      {scriptsSuccessful && (
        <PropBlock title="Tx Hash" value={txHash} description={TOPICS.hash} />
      )}
      <PropBlock title="Fee" value={fee.toString()} description={TOPICS.fee} />
      <PropBlock title="Start" value={validityStart?.toString()} />
      <PropBlock
        title="Time to live"
        value={ttl?.toString()}
        description={TOPICS.ttl}
      />
      <blockquote className="mt-6 border-dashed py-4 md:border-l-4 md:px-7">
        <h4 className="text-3xl font-bold text-blue-500 underline decoration-solid underline-offset-2">
          Transaction Inputs
        </h4>
        <P>{TOPICS.inputs}</P>
        {inputs
          .filter((i) => !i.isReferenceInput)
          .map(({ txHash, index }, i) => (
            <blockquote
              className="mt-6 border-dashed py-4 md:border-l-4 md:px-7"
              key={i}
            >
              <h4 className="text-3xl text-blue-500">Input</h4>
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
        <h4 className="text-3xl font-bold text-red-500 underline decoration-solid underline-offset-2">
          Transaction Outputs
        </h4>
        <P>{TOPICS.outputs}</P>
        {outputs.map(({ txHash, index, address, lovelace, assets }, i) => (
          <blockquote
            className="mt-6 border-dashed py-4 md:border-l-4 md:px-7"
            key={i}
          >
            <h4 className="text-3xl text-red-500">Output</h4>
            <PropBlock title="Tx Hash" value={txHash} />
            <PropBlock title="Output Index" value={index.toString()} />
            <blockquote className="mt-6 border-dashed py-4 md:border-l-4 md:px-7">
              <h4 className="text-3xl">Address</h4>
              <PropBlock
                title="Bech32"
                value={address?.bech32}
                description={TOPICS.outputs_address}
              />
              <PropBlock title="Header Type" value={address?.headerType} />
              <PropBlock title="Kind" value={address?.kind} />
              <PropBlock title="Network Type" value={address?.netType} />
              <PropBlock title="Payment" value={address?.payment} />
            </blockquote>
            <blockquote className="mt-6 border-dashed py-4 md:border-l-4 md:px-7">
              <h4 className="text-3xl">Assets</h4>
              <PropBlock
                title="Lovelace"
                value={lovelace.toString()}
                description={TOPICS.outputs_lovelace}
              />
              {assets.map(({ policyId, assetsPolicy }, i) => (
                <blockquote
                  className="mt-6 border-dashed py-4 md:border-l-4 md:px-7"
                  key={i}
                >
                  <h4 className="text-3xl">Policy Id</h4>
                  <PropBlock title="Policy Id" value={policyId} />
                  {assetsPolicy.map(
                    ({ assetName, assetNameAscii, coint }, i) => (
                      <blockquote
                        className="mt-6 border-dashed py-4 md:border-l-4 md:px-7"
                        key={i}
                      >
                        <h4 className="text-2xl">Asset</h4>
                        <PropBlock title="Asset Name" value={assetName} />
                        {assetNameAscii && (
                          <PropBlock title="Asset Name" value={assetName} />
                        )}
                        {coint && (
                          <PropBlock title="Coint" value={coint.toString()} />
                        )}
                      </blockquote>
                    ),
                  )}
                </blockquote>
              ))}
            </blockquote>
          </blockquote>
        ))}
      </blockquote>
      <blockquote className="mt-6 border-dashed py-4 md:border-l-4 md:px-7">
        <h4 className="text-3xl font-bold text-blue-500 underline decoration-dashed underline-offset-2">
          Reference Inputs
        </h4>
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
        {mints.map(({ policyId, assetsPolicy }, i) => {
          const mint = assetsPolicy.find((a) => a.coint && a.coint > 0);
          return (
            <blockquote
              className="mt-6 border-dashed py-4 md:border-l-4 md:px-7"
              key={i}
            >
              <h4 className="text-3xl">Policy Id</h4>
              <PropBlock
                title="Policy Id"
                value={policyId}
                color={
                  mint
                    ? "bg-green-200 border-green-700"
                    : "bg-red-200 border-red-700"
                }
              />
              {assetsPolicy.map(({ assetName, assetNameAscii, coint }, i) => (
                <blockquote
                  className="mt-6 border-dashed py-4 md:border-l-4 md:px-7"
                  key={i}
                >
                  <h4 className="text-2xl">Asset</h4>
                  <PropBlock title="Asset Name" value={assetName} />
                  {assetNameAscii && (
                    <PropBlock title="Asset Name" value={assetName} />
                  )}
                  {coint && (
                    <PropBlock title="Coint" value={coint.toString()} />
                  )}
                </blockquote>
              ))}
            </blockquote>
          );
        })}
        {mints.length === 0 && (
          <PropBlock title="" value="No minting or burning" />
        )}
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
            <PropBlock
              title="Metadatum Value"
              description={i == 0 ? TOPICS.inputs_index : ""}
              value={JSONBIG.stringify(jsonMetadata, null, 2)}
            />
          </blockquote>
        ))}
        {metadata?.length === 0 && <EmptyBlock />}
      </blockquote>
    </div>
  );
}
