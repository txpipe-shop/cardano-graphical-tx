import type { Meta, StoryObj } from "@storybook/react";
import { DetailLabel } from "./DetailLabel";

const meta = {
  title: "Components/DetailLabel",
  component: DetailLabel,
  tags: ["autodocs"],
} satisfies Meta<typeof DetailLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Policy ID",
  },
};

export const CustomClass: Story = {
  args: {
    children: "Transaction Hash",
    className: "w-24 flex-shrink-0",
  },
};
