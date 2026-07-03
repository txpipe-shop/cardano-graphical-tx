import type { Meta, StoryObj } from "@storybook/react";
import { CodeBlock } from "./CodeBlock";

const meta = {
  title: "Components/CodeBlock",
  component: CodeBlock,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "xs"] },
    maxHeight: { control: "select", options: ["60", "96"] },
  },
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleCbor =
  "83a4008282582060e2ea8e0f6da5db2e8a8e1a3f04a8e5b0b3d9f2b1c3d4e5f6a7b8c9d0e1f28258201234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef01828258390058a0b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f41a001828258390058a0b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f41a0028273682582060e2ea8e0f6da5db2e8a8e1a3f04a8e5b0b3d9f2b1c3d4e5f6a7b8c9d0e1f2a182a10a21a000f4240";

export const Default: Story = {
  args: {
    children: sampleCbor,
  },
};

export const ExtraSmall: Story = {
  args: {
    children: sampleCbor,
    size: "xs",
  },
};

export const ShortMaxHeight: Story = {
  args: {
    children: sampleCbor,
    maxHeight: "60",
  },
};

export const CustomContent: Story = {
  args: {
    children: `{\n  "policyId": "a1b2c3...",\n  "assetName": "MyToken",\n  "amount": 1000\n}`,
  },
};
