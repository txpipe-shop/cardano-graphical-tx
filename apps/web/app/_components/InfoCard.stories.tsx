import type { Meta, StoryObj } from "@storybook/react";
import { InfoCard } from "./InfoCard";

const meta = {
  title: "Components/InfoCard",
  component: InfoCard,
  tags: ["autodocs"],
  argTypes: {
    border: { control: "select", options: ["solid", "dashed"] },
    shadow: { control: "boolean" },
    bg: { control: "select", options: ["surface", "background"] },
  },
} satisfies Meta<typeof InfoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dashed: Story = {
  args: {
    children: "Dashed border card content",
    border: "dashed",
  },
};

export const Solid: Story = {
  args: {
    children: "Solid border card content",
    border: "solid",
  },
};

export const WithHeader: Story = {
  args: {
    header: "Card Title",
    children: "Card content goes here with a header above it.",
  },
};

export const NoShadow: Story = {
  args: {
    children: "Card without shadow",
    shadow: false,
  },
};

export const Background: Story = {
  args: {
    children: "Card with background color",
    bg: "background",
  },
};
