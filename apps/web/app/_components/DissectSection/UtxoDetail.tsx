import type { Assets } from "@laceanatomy/napi-pallas";
import { Address } from "@laceanatomy/types";
import { type Network } from "@laceanatomy/types/cardano";
import { CodeBlock } from "~/app/_components/CodeBlock";
import { DetailLabel } from "~/app/_components/DetailLabel";
import CopyButton from "~/app/_components/ExplorerSection/CopyButton";
import { FieldBlock } from "~/app/_components/FieldBlock";
import { MonoText } from "~/app/_components/MonoText";
import { SubField } from "~/app/_components/SubField";
import type { IGraphicalUtxo } from "~/app/_interfaces";
import ColoredAddress from "../ExplorerSection/ColoredAddress";

export function UtxoDetail({
  utxo,
  chain,
}: {
  utxo: IGraphicalUtxo;
  chain?: Network;
}) {
  return (
    <div className="space-y-4">
      <div>
        <DetailLabel>Transaction Output Reference</DetailLabel>
        <div className="flex items-center gap-2">
          <MonoText className="font-bold text-p-primary">
            {utxo.txHash}#{utxo.index}
          </MonoText>
          <CopyButton text={`${utxo.txHash}#${utxo.index}`} size={14} />
        </div>
      </div>

      {utxo.address && (
        <div>
          <DetailLabel>Address</DetailLabel>
          <div className="flex items-center gap-2 mb-2">
            <ColoredAddress
              address={Address(utxo.address.bech32)}
              chain={chain}
              full
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <SubField label="Header Type" value={utxo.address.headerType} />
            <SubField label="Network" value={utxo.address.netType} />
            <SubField label="Kind" value={utxo.address.kind} />
            <SubField label="Payment" value={utxo.address.payment} mono />
            {utxo.address.delegation && (
              <SubField
                label="Delegation"
                value={utxo.address.delegation}
                mono
              />
            )}
          </div>
        </div>
      )}

      <div>
        <DetailLabel>Lovelace</DetailLabel>
        <MonoText className="font-medium tabular-nums">
          {utxo.lovelace}
        </MonoText>
      </div>

      {utxo.datum && (
        <div>
          <DetailLabel>Datum</DetailLabel>
          <MonoText className="text-p-primary">{utxo.datum.hash}</MonoText>
          {utxo.datum.bytes && (
            <CodeBlock size="xs" maxHeight="60" className="mt-2">
              {utxo.datum.bytes}
            </CodeBlock>
          )}
        </div>
      )}

      {utxo.scriptRef && (
        <div>
          <DetailLabel>Script Reference</DetailLabel>
          <MonoText>{utxo.scriptRef}</MonoText>
        </div>
      )}

      <AssetsList assets={utxo.assets} />
    </div>
  );
}

function AssetsList({ assets }: { assets: Assets[] }) {
  if (!assets || assets.length === 0) return null;
  return (
    <div>
      <DetailLabel>
        Assets ({assets.reduce((s, a) => s + a.assetsPolicy.length, 0)})
      </DetailLabel>
      <div className="space-y-2 mt-1">
        {assets.map(({ policyId, assetsPolicy }, j) => (
          <FieldBlock key={j}>
            <div className="flex items-center gap-2 mb-2">
              <DetailLabel>Policy</DetailLabel>
              <MonoText size="xs" className="break-all">
                {policyId}
              </MonoText>
            </div>
            <div className="space-y-px">
              {assetsPolicy.map((a, k) => (
                <div
                  key={k}
                  className="flex items-center gap-3 text-sm w-full justify-between"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <DetailLabel>Hex name</DetailLabel>
                    <MonoText className="flex-1 min-w-0 truncate">
                      {a.assetName}
                    </MonoText>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <DetailLabel>Ascii name</DetailLabel>
                    {a.assetNameAscii ? (
                      <span className="text-p-secondary flex-shrink-0 max-w-[160px] truncate">
                        {a.assetNameAscii}
                      </span>
                    ) : (
                      <span className="text-p-secondary flex-shrink-0 max-w-[160px] truncate">
                        —
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <DetailLabel>Amount</DetailLabel>
                    <MonoText
                      size="xs"
                      className="font-bold flex-shrink-0 w-36 text-right"
                    >
                      {a.amount?.toFixed(0) ?? 0}
                    </MonoText>
                  </div>
                </div>
              ))}
            </div>
          </FieldBlock>
        ))}
      </div>
    </div>
  );
}
