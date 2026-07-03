import type { Meta, StoryObj } from "@storybook/react";
import { EmptyState } from "./EmptyState";

const meta = {
  title: "Components/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  argTypes: {
    message: { control: "text" },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: "No transactions found",
  },
};

export const Holders: Story = {
  args: {
    message: "No holders found for this token",
  },
};

export const CustomMessage: Story = {
  args: {
    message: "This address has not received any tokens yet",
  },
};
