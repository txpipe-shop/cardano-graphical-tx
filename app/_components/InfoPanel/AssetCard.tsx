import { Card, CardHeader, Tooltip } from "@nextui-org/react";
import Image from "next/image";
import { getAssetName, handleCopy } from "~/app/_utils";
import type { Asset } from "~/napi-pallas";
import CopyIcon from "~/public/copy.svg";

interface AssetCardProps {
  asset: Asset;
  policyId: string;
  isMintBurn?: boolean;
}

export const AssetCard = ({
  asset,
  policyId,
  isMintBurn = false,
}: AssetCardProps) => {
  const { assetName, coint } = asset;

  const colorVar =
    isMintBurn && asset.coint
      ? asset.coint > 0
        ? "text-green-500"
        : "text-red-500"
      : "dark:text-white text-black";

  const tooltipContent =
    assetName !== "lovelace" ? "Policy " + policyId : "Lovelace";
  const name = getAssetName(assetName);

  return (
    <Card className="bg-content2 shadow-none">
      <Tooltip
        content={tooltipContent}
        classNames={{ base: "text-base p-4" }}
        delay={750}
      >
        <CardHeader className="flex justify-between">
          <div>
            <b className={colorVar}>{name}</b>
            &nbsp;
            {coint?.toString()}
          </div>
          <div>
            {assetName !== "lovelace" && (
              <Image
                src={CopyIcon}
                alt="Copy"
                onClick={handleCopy(policyId + " " + assetName)}
                className="cursor-pointer"
              />
            )}
          </div>
        </CardHeader>
      </Tooltip>
    </Card>
  );
};
