import type { Meta, StoryObj } from "@storybook/react";
import CopyButton from "./CopyButton";

const meta = {
  title: "Components/CopyButton",
  component: CopyButton,
  tags: ["autodocs"],
  argTypes: {
    text: {
      control: "text",
    },
    size: {
      control: { type: "number", min: 8, max: 32 },
    },
  },
} satisfies Meta<typeof CopyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: "addr1qxy2...example",
    size: 14,
  },
};

export const Large: Story = {
  args: {
    text: "Copy this long text to clipboard",
    size: 24,
  },
};
