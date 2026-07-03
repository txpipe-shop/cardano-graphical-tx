import type { Meta, StoryObj } from "@storybook/react";
import { JSONModal } from "./JSONModal";

const meta = {
  title: "Components/JSONModal",
  component: JSONModal,
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    isOpen: { control: "boolean" },
  },
} satisfies Meta<typeof JSONModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    isOpen: true,
    onOpenChange: () => {},
    title: "Transaction CBOR",
    children: (
      <pre className="font-mono text-sm whitespace-pre-wrap break-all">
        {JSON.stringify(
          {
            policyId: "a1b2c3...",
            assetName: "MyToken",
            amount: 1000,
          },
          null,
          2,
        )}
      </pre>
    ),
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    onOpenChange: () => {},
    title: "Transaction CBOR",
    children: <span>This content is hidden</span>,
  },
};
