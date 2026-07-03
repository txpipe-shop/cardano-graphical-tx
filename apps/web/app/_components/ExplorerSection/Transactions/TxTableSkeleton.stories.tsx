import type { Meta, StoryObj } from "@storybook/react";
import { TxTableSkeleton } from "./TxTableSkeleton";

const meta = {
  title: "Components/Skeletons/TxTableSkeleton",
  component: TxTableSkeleton,
  tags: ["autodocs"],
  argTypes: {
    rows: { control: { type: "number", min: 1, max: 20 } },
  },
} satisfies Meta<typeof TxTableSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { rows: 3 },
};

export const SingleRow: Story = {
  args: { rows: 1 },
};

export const ManyRows: Story = {
  args: { rows: 10 },
};
