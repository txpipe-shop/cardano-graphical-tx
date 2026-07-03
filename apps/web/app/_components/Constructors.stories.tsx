import type { StoryObj } from "@storybook/react";
import { EmptyBlock, PropBlock, Section } from "./Constructors";

const meta = {
  title: "Components/Constructors",
  tags: ["autodocs"],
};

export default meta;

export const PropBlockDefault: StoryObj<typeof PropBlock> = {
  render: () => (
    <PropBlock
      title="Collateral Return"
      description="Excess collateral returned to sender"
      value="1,500,000 lovelace"
    />
  ),
};

export const PropBlockGreen: StoryObj<typeof PropBlock> = {
  render: () => (
    <PropBlock
      title="Mint"
      description="Tokens minted in this transaction"
      value="500"
      color="green"
    />
  ),
};

export const PropBlockRed: StoryObj<typeof PropBlock> = {
  render: () => (
    <PropBlock
      title="Burn"
      description="Tokens burned in this transaction"
      value="100"
      color="red"
    />
  ),
};

export const EmptyBlockDefault: StoryObj<typeof EmptyBlock> = {
  render: () => <EmptyBlock title="No Datum" />,
};

export const EmptyBlockWithDescription: StoryObj<typeof EmptyBlock> = {
  render: () => (
    <EmptyBlock title="No Scripts" description="No scripts were provided" />
  ),
};

export const SectionDefault: StoryObj<typeof Section> = {
  render: () => (
    <Section title="Certificate">
      <p className="text-p-secondary">
        Stake delegation certificate found in this transaction.
      </p>
    </Section>
  ),
};
