import type { Meta, StoryObj } from "@storybook/react";
import { DevnetLoadingCard } from "./DevnetLoadingCard";

const meta = {
  title: "Components/DevnetLoadingCard",
  component: DevnetLoadingCard,
  tags: ["autodocs"],
  argTypes: {
    message: { control: "text" },
  },
} satisfies Meta<typeof DevnetLoadingCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: "Loading block data...",
  },
};

export const Transaction: Story = {
  args: {
    message: "Fetching transaction details...",
  },
};

export const CustomMessage: Story = {
  args: {
    message: "Connecting to devnet node...",
  },
};
