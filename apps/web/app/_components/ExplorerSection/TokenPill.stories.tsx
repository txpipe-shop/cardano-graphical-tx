import { Unit } from "@laceanatomy/types";
import type { Meta, StoryObj } from "@storybook/react";
import TokenPill from "./TokenPill";

const meta = {
  title: "Components/TokenPill",
  component: TokenPill,
  tags: ["autodocs"],
} satisfies Meta<typeof TokenPill>;

export default meta;
type Story = StoryObj<typeof meta>;

const nativeTokenUnit = Unit(
  "279f62325dcc62b5957639832c97c51f478659a28eb91e6a83485747474741f04d79546f6b656e",
);

export const Default: Story = {
  args: {
    unit: Unit("lovelace"),
    amount: 1500000n,
    chain: "mainnet",
  },
};

export const NativeToken: Story = {
  args: {
    unit: nativeTokenUnit,
    amount: 100n,
    chain: "mainnet",
  },
};

export const Minted: Story = {
  args: {
    unit: nativeTokenUnit,
    amount: 50n,
    chain: "mainnet",
    mint: {
      [nativeTokenUnit]: 50n,
    },
  },
};

export const Burned: Story = {
  args: {
    unit: nativeTokenUnit,
    amount: -10n,
    chain: "mainnet",
    mint: {
      [nativeTokenUnit]: -10n,
    },
  },
};
