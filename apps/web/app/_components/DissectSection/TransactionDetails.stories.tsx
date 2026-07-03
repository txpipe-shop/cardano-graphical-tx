import type { StoryObj } from "@storybook/react";
import { MintDetail, Stat } from "./TransactionDetails";

const meta = {
  title: "Components/DissectDetails",
  tags: ["autodocs"],
};

export default meta;

export const StatDefault: StoryObj<typeof Stat> = {
  name: "Stat",
  render: () => <Stat label="Size" value="1,234" suffix="bytes" />,
};

export const StatNoSuffix: StoryObj<typeof Stat> = {
  name: "Stat (no suffix)",
  render: () => <Stat label="Inputs" value="3" />,
};

export const MintDetailMint: StoryObj<typeof MintDetail> = {
  name: "MintDetail (mint)",
  render: () => (
    <MintDetail
      isMint={true}
      mint={{
        policyId: "279f62325dcc62b5957639832c97c51f478659a28eb91e6a8348574",
        assetsPolicy: [
          {
            assetName: "4d79546f6b656e",
            assetNameAscii: "MyToken",
            amount: 500,
          },
          {
            assetName: "5365636f6e64546f6b656e",
            assetNameAscii: "SecondToken",
            amount: 1000,
          },
        ],
      }}
    />
  ),
};

export const MintDetailBurn: StoryObj<typeof MintDetail> = {
  name: "MintDetail (burn)",
  render: () => (
    <MintDetail
      isMint={false}
      mint={{
        policyId: "279f62325dcc62b5957639832c97c51f478659a28eb91e6a8348574",
        assetsPolicy: [
          {
            assetName: "4d79546f6b656e",
            assetNameAscii: "MyToken",
            amount: -100,
          },
        ],
      }}
    />
  ),
};
