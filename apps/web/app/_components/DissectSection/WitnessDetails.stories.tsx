import type { StoryObj } from "@storybook/react";
import { RedeemerDetail, ScriptList, VKeyDetail } from "./WitnessDetails";

const meta = {
  title: "Components/WitnessDetails",
  tags: ["autodocs"],
};

export default meta;

export const VKeyWitnesses: StoryObj<typeof VKeyDetail> = {
  name: "VKeyDetail",
  render: () => (
    <VKeyDetail
      items={[
        {
          key: "60e2ea8e0f6da5db2e8a8e1a3f04a8e5b0b3d9f2b1c3d4e5f6a7b8c9d0e1f2",
          hash: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
          signature:
            "f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9e0d1c2b3a4f5e6d7c8b9a0f1e2",
        },
        {
          key: "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
          hash: "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
          signature:
            "fedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321",
        },
      ]}
    />
  ),
};

export const Redeemer: StoryObj<typeof RedeemerDetail> = {
  name: "RedeemerDetail",
  render: () => (
    <RedeemerDetail
      r={{
        tag: "Spend",
        index: 0,
        exUnits: { mem: 1500000, steps: 5000000000 },
        dataJson: '{"constructor":0,"fields":[{"bytes":"deadbeef"}]}',
      }}
    />
  ),
};

export const Scripts: StoryObj<typeof ScriptList> = {
  name: "ScriptList",
  render: () => (
    <ScriptList
      label="Plutus Script"
      items={[
        "8201830082582060e2ea8e0f6da5db2e8a8e1a3f04a8e5b0b3d9f2b1c3d4e5f6a7b8c9d0e1f28258201234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "82018300825820abcdef1234567890abcdef1234567890abcdef1234567890abcdef825820deadbeef1234567890abcdef1234567890abcdef1234567890abcdef12345678",
      ]}
    />
  ),
};
