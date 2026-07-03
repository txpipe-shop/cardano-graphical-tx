import type { Meta, StoryObj } from "@storybook/react";
import { DetailTabs } from "./DetailTabs";

function DummyContent({ label }: { label: string }) {
  return (
    <div className="rounded border border-border bg-surface p-4 text-p-primary">
      Content for {label}
    </div>
  );
}

const meta = {
  title: "Components/DetailTabs",
  component: DetailTabs,
  tags: ["autodocs"],
  args: {
    tabs: [
      {
        key: "overview",
        title: "Overview",
        content: <DummyContent label="Overview" />,
      },
      { key: "cbor", title: "CBOR", content: <DummyContent label="CBOR" /> },
      {
        key: "scripts",
        title: "Scripts",
        content: <DummyContent label="Scripts" />,
      },
    ],
    defaultTab: "overview",
  },
} satisfies Meta<typeof DetailTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithActiveTab: Story = {
  args: {
    activeTab: "cbor",
  },
};
