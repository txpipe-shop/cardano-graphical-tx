import type { Meta, StoryObj } from "@storybook/react";
import { CustomInput } from "./Input";

const meta = {
  title: "Components/CustomInput",
  component: CustomInput,
  tags: ["autodocs"],
  argTypes: {
    inputSize: { control: "select", options: ["small", "medium"] },
    isCheckbox: { control: "boolean" },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
    label: { control: "text" },
  },
} satisfies Meta<typeof CustomInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextInput: Story = {
  args: {
    name: "address",
    value: "",
    placeholder: "Enter a Cardano address",
    label: "Address",
    inputSize: "medium",
  },
};

export const SmallTextInput: Story = {
  args: {
    name: "hash",
    value: "abc123",
    placeholder: "Enter hash",
    label: "Hash",
    inputSize: "small",
  },
};

export const Checkbox: Story = {
  args: {
    name: "toggle",
    value: "",
    isCheckbox: true,
    checked: false,
    label: "Enable advanced mode",
  },
};

export const CheckboxChecked: Story = {
  args: {
    name: "toggle",
    value: "",
    isCheckbox: true,
    checked: true,
    label: "Enable advanced mode",
  },
};

export const Disabled: Story = {
  args: {
    name: "readonly",
    value: "Cannot edit this",
    label: "Read Only",
    disabled: true,
  },
};
