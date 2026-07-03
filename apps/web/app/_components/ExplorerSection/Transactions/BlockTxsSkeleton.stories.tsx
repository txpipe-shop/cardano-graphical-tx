import type { Meta, StoryObj } from "@storybook/react";
import { BlockTxsSkeleton } from "./BlockTxsSkeleton";

const meta = {
  title: "Components/Skeletons/BlockTxsSkeleton",
  component: BlockTxsSkeleton,
  tags: ["autodocs"],
  argTypes: {
    rows: { control: { type: "number", min: 1, max: 20 } },
  },
} satisfies Meta<typeof BlockTxsSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { rows: 5 },
};

export const SingleRow: Story = {
  args: { rows: 1 },
};

export const ManyRows: Story = {
  args: { rows: 10 },
};
