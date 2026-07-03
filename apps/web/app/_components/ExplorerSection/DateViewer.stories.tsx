import type { Meta, StoryObj } from "@storybook/react";
import DateViewer from "./DateViewer";

const meta = {
  title: "Components/DateViewer",
  component: DateViewer,
  tags: ["autodocs"],
  argTypes: {
    timestamp: {
      control: { type: "number" },
    },
    unit: {
      control: "select",
      options: ["seconds", "milliseconds"],
    },
  },
} satisfies Meta<typeof DateViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const UnixTimestamp: Story = {
  args: {
    timestamp: 1700000000,
    unit: "seconds",
  },
};

export const Milliseconds: Story = {
  args: {
    timestamp: 1700000000000,
    unit: "milliseconds",
  },
};

export const Undefined: Story = {
  args: {
    timestamp: undefined,
  },
};
