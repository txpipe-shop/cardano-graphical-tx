import { Card, CardHeader, Tooltip } from "@nextui-org/react";
import Image from "next/image";
import { ICborAsset } from "~/app/_interfaces";
import { getAssetName, handleCopy } from "~/app/_utils";
import CopyIcon from "~/public/copy.svg";

interface AssetCardProps {
  asset: ICborAsset;
  isMintBurn?: boolean;
}

export const AssetCard = ({ asset, isMintBurn = false }: AssetCardProps) => {
  const { policyId, assetName, amount } = asset;

  const colorVar = isMintBurn
    ? asset.amount > 0
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
            {amount.toString()}
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
