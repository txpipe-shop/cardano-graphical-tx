import type { Meta, StoryObj } from "@storybook/react";
import ColoredAddress from "./ColoredAddress";

const meta = {
  title: "Components/ColoredAddress",
  component: ColoredAddress,
  tags: ["autodocs"],
  argTypes: {
    full: { control: "boolean" },
    chain: {
      control: "select",
      options: ["mainnet", "preprod", "preview", "devnet"],
    },
  },
} satisfies Meta<typeof ColoredAddress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Truncated: Story = {
  args: {
    address:
      "addr1qxy2fwd5v7x2nhfty8mhz40w49n0jqpz0wqj4x6q0wqj4x6q0wqj4x6q0wqj4x6q0wqj4x6q0wqj4x6q0wqj4x6q0wqj4",
    full: false,
  },
};

export const Full: Story = {
  args: {
    address:
      "addr1qxy2fwd5v7x2nhfty8mhz40w49n0jqpz0wqj4x6q0wqj4x6q0wqj4x6q0wqj4x6q0wqj4x6q0wqj4x6q0wqj4x6q0wqj4",
    full: true,
  },
};

export const WithChainLink: Story = {
  args: {
    address:
      "addr1qxy2fwd5v7x2nhfty8mhz40w49n0jqpz0wqj4x6q0wqj4x6q0wqj4x6q0wqj4x6q0wqj4x6q0wqj4x6q0wqj4x6q0wqj4",
    chain: "mainnet",
    full: false,
  },
};
