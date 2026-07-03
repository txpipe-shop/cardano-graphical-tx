import type { Meta, StoryObj } from "@storybook/react";
import { AssetCard } from "./AssetCard";

const meta = {
  title: "Components/AssetCard",
  component: AssetCard,
  tags: ["autodocs"],
  argTypes: {
    isMintBurn: { control: "boolean" },
  },
} satisfies Meta<typeof AssetCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Lovelace: Story = {
  args: {
    asset: { assetName: "lovelace", assetNameAscii: null, amount: 1500000 },
    policyId: "",
  },
};

export const NativeToken: Story = {
  args: {
    asset: {
      assetName:
        "279f62325dcc62b5957639832c97c51f478659a28eb91e6a83485747474741f04d79546f6b656e",
      assetNameAscii: "MyToken",
      amount: 1000,
    },
    policyId: "279f62325dcc62b5957639832c97c51f478659a28eb91e6a8348574",
  },
};

export const Minted: Story = {
  args: {
    asset: {
      assetName:
        "279f62325dcc62b5957639832c97c51f478659a28eb91e6a83485747474741f04d79546f6b656e",
      assetNameAscii: "MintedToken",
      amount: 500,
    },
    policyId: "279f62325dcc62b5957639832c97c51f478659a28eb91e6a8348574",
    isMintBurn: true,
  },
};

export const Burned: Story = {
  args: {
    asset: {
      assetName:
        "279f62325dcc62b5957639832c97c51f478659a28eb91e6a83485747474741f04d79546f6b656e",
      assetNameAscii: "BurnedToken",
      amount: -100,
    },
    policyId: "279f62325dcc62b5957639832c97c51f478659a28eb91e6a8348574",
    isMintBurn: true,
  },
};
