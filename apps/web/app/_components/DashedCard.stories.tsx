import type { Meta, StoryObj } from "@storybook/react";
import { DashedCard } from "./DashedCard";

const meta = {
  title: "Components/DashedCard",
  component: DashedCard,
  tags: ["autodocs"],
  argTypes: {
    shadow: { control: "boolean" },
    bg: { control: "select", options: ["surface", "background"] },
  },
} satisfies Meta<typeof DashedCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Dashed card content",
  },
};

export const NoShadow: Story = {
  args: {
    children: "No shadow dashed card",
    shadow: false,
  },
};

export const Background: Story = {
  args: {
    children: "Background colored card",
    bg: "background",
  },
};

export const WithClassName: Story = {
  args: {
    children: "Extra padding card",
    className: "p-8",
  },
};
