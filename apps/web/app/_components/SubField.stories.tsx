import type { Meta, StoryObj } from "@storybook/react";
import { SubField } from "./SubField";

const meta = {
  title: "Components/SubField",
  component: SubField,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    value: { control: "text" },
    mono: { control: "boolean" },
  },
} satisfies Meta<typeof SubField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Validity Start",
    value: "12345678",
  },
};

export const Mono: Story = {
  args: {
    label: "TTL",
    value: "99999999",
    mono: true,
  },
};

export const Empty: Story = {
  args: {
    label: "Empty Field",
    value: undefined,
  },
};

export const CustomValue: Story = {
  args: {
    label: "Lovelace",
    value: "2,000,000",
    mono: false,
  },
};
