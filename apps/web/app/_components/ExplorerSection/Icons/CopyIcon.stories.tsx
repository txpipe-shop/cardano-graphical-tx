import type { Meta, StoryObj } from "@storybook/react";
import CopyIcon from "./CopyIcon";

const meta = {
  title: "Components/Icons/CopyIcon",
  component: CopyIcon,
  tags: ["autodocs"],
  argTypes: {
    size: { control: { type: "number", min: 8, max: 48 } },
  },
} satisfies Meta<typeof CopyIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Small: Story = {
  args: { size: 12 },
};

export const Medium: Story = {
  args: { size: 20 },
};

export const Large: Story = {
  args: { size: 32 },
};
