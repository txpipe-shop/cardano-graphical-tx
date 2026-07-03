import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["blue", "pink"],
    },
    disabled: {
      control: "boolean",
    },
    children: {
      control: "text",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Blue: Story = {
  args: {
    children: "Blue Button",
    color: "blue",
  },
};

export const Pink: Story = {
  args: {
    children: "Pink Button",
    color: "pink",
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
  },
};

export const Submit: Story = {
  args: {
    children: "Submit",
    type: "submit",
  },
};
