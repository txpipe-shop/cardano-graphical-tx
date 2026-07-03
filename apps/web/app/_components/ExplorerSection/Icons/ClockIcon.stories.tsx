import type { Meta, StoryObj } from "@storybook/react";
import ClockIcon from "./ClockIcon";

const meta = {
  title: "Components/Icons/ClockIcon",
  component: ClockIcon,
  tags: ["autodocs"],
  argTypes: {
    size: { control: { type: "number", min: 8, max: 48 } },
  },
} satisfies Meta<typeof ClockIcon>;

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
