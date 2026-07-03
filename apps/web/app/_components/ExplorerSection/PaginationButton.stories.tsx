import type { Meta, StoryObj } from "@storybook/react";
import { PaginationButton } from "./PaginationButton";

const meta = {
  title: "Components/PaginationButton",
  component: PaginationButton,
  tags: ["autodocs"],
  argTypes: {
    isLoading: { control: "boolean" },
    disabled: { control: "boolean" },
    children: { control: "text" },
  },
} satisfies Meta<typeof PaginationButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Load More",
  },
};

export const Loading: Story = {
  args: {
    children: "Loading...",
    isLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: "No more data",
    disabled: true,
  },
};

export const DisabledLoading: Story = {
  args: {
    children: "Please wait",
    isLoading: true,
    disabled: true,
  },
};
