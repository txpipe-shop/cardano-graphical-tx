import type { Meta, StoryObj } from "@storybook/react";
import { DevnetError } from "./DevnetError";

const meta = {
  title: "Components/DevnetError",
  component: DevnetError,
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    error: { control: "text" },
  },
} satisfies Meta<typeof DevnetError>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Connection Failed",
    error: "Could not connect to devnet node at localhost:8080",
  },
};

export const TitleOnly: Story = {
  args: {
    title: "Network Error",
  },
};

export const DetailedError: Story = {
  args: {
    title: "Transaction Rejected",
    error:
      "The transaction was rejected due to insufficient funds. Required: 2,000,000 lovelace, Available: 1,500,000 lovelace",
  },
};
