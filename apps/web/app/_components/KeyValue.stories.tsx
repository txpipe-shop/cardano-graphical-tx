import type { Meta, StoryObj } from "@storybook/react";
import { KeyValue } from "./KeyValue";

const meta = {
  title: "Components/KeyValue",
  component: KeyValue,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    mono: { control: "boolean" },
    colon: { control: "boolean" },
  },
} satisfies Meta<typeof KeyValue>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Block Hash",
    children: "abc123def456",
  },
};

export const Mono: Story = {
  args: {
    label: "Policy ID",
    mono: true,
    children: "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4",
  },
};

export const NoColon: Story = {
  args: {
    label: "Lovelace",
    colon: false,
    children: "1,500,000 ₳",
  },
};

export const LongValue: Story = {
  args: {
    label: "Transaction Hash",
    mono: true,
    children:
      "a]1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
  },
};
