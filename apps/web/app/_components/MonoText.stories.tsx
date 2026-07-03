import type { Meta, StoryObj } from "@storybook/react";
import { MonoText } from "./MonoText";

const meta = {
  title: "Components/MonoText",
  component: MonoText,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "xs", "base"] },
  },
} satisfies Meta<typeof MonoText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "abc123def456",
  },
};

export const ExtraSmall: Story = {
  args: {
    children: "0x60e2ea8e0f6da5db2e8a8e1a3f04a8e5b0b3d9f2b1c3d4e5f6",
    size: "xs",
  },
};

export const Base: Story = {
  args: {
    children: "addr1qxy2f...example",
    size: "base",
  },
};

export const WithClassName: Story = {
  args: {
    children: "Styled monospace text",
    className: "font-bold text-p-primary",
  },
};
