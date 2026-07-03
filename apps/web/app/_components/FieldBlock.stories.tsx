import type { Meta, StoryObj } from "@storybook/react";
import { FieldBlock } from "./FieldBlock";

const meta = {
  title: "Components/FieldBlock",
  component: FieldBlock,
  tags: ["autodocs"],
} satisfies Meta<typeof FieldBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <span className="font-mono text-sm">txHash#index</span>,
  },
};

export const WithCopyButton: Story = {
  args: {
    children: (
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm">
          60e2ea8e0f6da5db2e8a8e1a3f04a8e5b0b3d9f2b1c3d4e5f6#0
        </span>
      </div>
    ),
  },
};

export const CustomClass: Story = {
  args: {
    children: <span>Custom styled block</span>,
    className: "bg-surface border-border",
  },
};
