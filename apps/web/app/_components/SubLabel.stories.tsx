import type { Meta, StoryObj } from "@storybook/react";
import { SubLabel } from "./SubLabel";

const meta = {
  title: "Components/SubLabel",
  component: SubLabel,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "xs"] },
  },
} satisfies Meta<typeof SubLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Secondary label",
  },
};

export const Small: Story = {
  args: {
    children: "Slightly larger label",
    size: "sm",
  },
};

export const ExtraSmall: Story = {
  args: {
    children: "Tiny label",
    size: "xs",
  },
};
