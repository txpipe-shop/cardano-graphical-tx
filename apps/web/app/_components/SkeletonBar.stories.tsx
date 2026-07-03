import type { Meta, StoryObj } from "@storybook/react";
import { SkeletonBar } from "./SkeletonBar";

const meta = {
  title: "Components/Skeletons/SkeletonBar",
  component: SkeletonBar,
  tags: ["autodocs"],
} satisfies Meta<typeof SkeletonBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {
  args: { className: "h-4 w-20" },
};

export const Medium: Story = {
  args: { className: "h-5 w-36" },
};

export const Wide: Story = {
  args: { className: "h-4 w-72" },
};

export const CustomSize: Story = {
  args: { className: "h-8 w-48" },
};
