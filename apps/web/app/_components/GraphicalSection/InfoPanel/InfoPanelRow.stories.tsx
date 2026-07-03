import type { Meta, StoryObj } from "@storybook/react";
import { InfoPanelRow } from "./InfoPanelRow";

const meta = {
  title: "Components/InfoPanelRow",
  component: InfoPanelRow,
  tags: ["autodocs"],
  argTypes: {
    direction: { control: "select", options: ["row", "col"] },
    justify: {
      control: "select",
      options: ["between", "start", "center", "end", "around"],
    },
    gap: { control: "boolean" },
  },
} satisfies Meta<typeof InfoPanelRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <span>Item 1</span>
        <span>Item 2</span>
        <span>Item 3</span>
      </>
    ),
  },
};

export const Between: Story = {
  args: {
    justify: "between",
    children: (
      <>
        <span>Left</span>
        <span>Right</span>
      </>
    ),
  },
};

export const WithGap: Story = {
  args: {
    gap: true,
    justify: "between",
    children: (
      <>
        <span>A</span>
        <span>B</span>
        <span>C</span>
      </>
    ),
  },
};

export const Column: Story = {
  args: {
    direction: "col",
    gap: true,
    children: (
      <>
        <span>First</span>
        <span>Second</span>
        <span>Third</span>
      </>
    ),
  },
};

export const Centered: Story = {
  args: {
    justify: "center",
    children: <span>Centered content</span>,
  },
};
