import type { Meta, StoryObj } from "@storybook/react";
import { HashDisplay } from "./HashDisplay";

const meta = {
  title: "Components/HashDisplay",
  component: HashDisplay,
  tags: ["autodocs"],
  argTypes: {
    hash: { control: "text" },
    length: { control: { type: "number", min: 2, max: 20 } },
    copySize: { control: { type: "number", min: 8, max: 24 } },
  },
} satisfies Meta<typeof HashDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ShortHash: Story = {
  args: {
    hash: "abc123def456",
  },
};

export const LongHash: Story = {
  args: {
    hash: "60e2ea8e0f6da5db2e8a8e1a3f04a8e5b0b3d9f2b1c3d4e5f6a7b8c9d0e1f2",
    length: 8,
  },
};

export const CustomLength: Story = {
  args: {
    hash: "60e2ea8e0f6da5db2e8a8e1a3f04a8e5b0b3d9f2b1c3d4e5f6a7b8c9d0e1f2",
    length: 12,
  },
};
