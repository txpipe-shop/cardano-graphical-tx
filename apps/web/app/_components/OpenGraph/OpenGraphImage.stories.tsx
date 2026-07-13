import type { Meta, StoryObj } from '@storybook/react'
import {
  OPEN_GRAPH_IMAGE_SIZE,
  OpenGraphImage,
} from './OpenGraphImage'

const meta = {
  title: 'Open Graph/Preview',
  component: OpenGraphImage,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    kind: {
      control: 'select',
      options: [
        'home',
        'tx',
        'address',
        'explorer',
        'transaction',
        'block',
        'token',
      ],
    },
    title: { control: 'text' },
    eyebrow: { control: 'text' },
    description: { control: 'text' },
    chain: { control: 'text' },
    facts: { control: 'object' },
  },
  render: (args) => (
    <div
      style={{
        width: OPEN_GRAPH_IMAGE_SIZE.width,
        height: OPEN_GRAPH_IMAGE_SIZE.height,
        overflow: 'hidden',
        border: '1px solid #e5e7eb',
      }}
    >
      <OpenGraphImage {...args} />
    </div>
  ),
} satisfies Meta<typeof OpenGraphImage>

export default meta
type Story = StoryObj<typeof meta>

export const Home: Story = {
  args: {
    kind: 'home',
    title: 'Lace Anatomy',
    eyebrow: 'Cardano transaction anatomy',
    description:
      'Visualize and dissect Cardano transactions, addresses, blocks, and tokens with developer-focused blockchain diagrams.',
    facts: [
      ['Mode', 'Graphical'],
      ['Data', 'CBOR + hashes'],
      ['Built by', 'TxPipe'],
    ],
  },
}

export const Transaction: Story = {
  args: {
    kind: 'transaction',
    title: 'b15a2e8a6366dedcf3d4b84d5332fcae849746766aecbcb3af2328a665236d0a',
    eyebrow: 'Transaction',
    description:
      'Block 3787101 transaction with 2 inputs, 3 outputs, and 0.172437 ₳ fee.',
    chain: 'preprod',
    facts: [
      ['Block', '3787101'],
      ['Fee', '0.172437 ₳'],
      ['Inputs', '2'],
      ['Outputs', '3'],
      ['Mint', '0'],
      ['Scripts', 'None'],
    ],
  },
}

export const Block: Story = {
  args: {
    kind: 'block',
    title: 'Block 3787101',
    eyebrow: 'Block',
    description:
      '15 transactions, 2.481932 ₳ total fees, slot 76492312.',
    chain: 'preprod',
    facts: [
      ['Hash', '3abfb9d7ad3154a47ef1292a7f816e82664825b9b2176c982cb4e6e947b09d5e'],
      ['Slot', '76492312'],
      ['Txs', '15'],
      ['Fees', '2.481932 ₳'],
      ['Epoch', '178'],
    ],
  },
}

export const Address: Story = {
  args: {
    kind: 'address',
    title:
      'addr_test1qq585l3rd3s6pgr3fgjvux8qplj3vav0w5wckh25ua6hgz6j8qqmfn632w2rr8nyywqse40sxy45wq2eh4ksy9j8u9cq2fcnp3',
    eyebrow: 'Base address (payment & delegation)',
    description:
      '12.450000 ₳ balance, 43 transactions, 6 native assets on Preprod.',
    chain: 'preprod',
    facts: [
      ['Balance', '12.45 ₳'],
      ['Txs', '43'],
      ['Assets', '6'],
      ['First seen', 'Block 3421022'],
      ['Last seen', 'Block 3787101'],
    ],
  },
}

export const Token: Story = {
  args: {
    kind: 'token',
    title: 'Lace Anatomy Preview Token',
    eyebrow: 'asset1kk4x7f6e36w2w0v2jzw72ejp8lq',
    description:
      '1,000,000 supply, 24 holder preview, 3 mint/burn events.',
    chain: 'preprod',
    facts: [
      ['Policy', '2b424eb51d04e39cfe7483ffe60eda9c5388d622d2bbb10443631818'],
      ['Supply', '1,000,000'],
      ['Holders', '24'],
      ['Events', '3'],
      ['Sources', 'token-registry, cip68'],
    ],
  },
}

export const LongValues: Story = {
  args: {
    kind: 'transaction',
    title: 'b15a2e8a6366dedcf3d4b84d5332fcae849746766aecbcb3af2328a665236d0a',
    eyebrow: 'Transaction with deliberately long values',
    description:
      'A stress case for social cards with long hashes, policy IDs, dense facts, and enough prose to test wrapping.',
    chain: 'preprod',
    facts: [
      ['Hash', 'b15a2e8a6366dedcf3d4b84d5332fcae849746766aecbcb3af2328a665236d0a'],
      ['Policy', '2b424eb51d04e39cfe7483ffe60eda9c5388d622d2bbb10443631818'],
      ['Address', 'addr_test1qq585l3rd3s6pgr3fgjvux8qplj3vav0w5wckh25ua6hgz6j8qqmfn632w2rr8nyywqse40sxy45wq2eh4ksy9j8u9cq2fcnp3'],
      ['Fee', '0.172437 ₳'],
      ['Outputs', '14'],
      ['Scripts', '3/8 datum'],
    ],
  },
}

export const SixFactsTallContent: Story = {
  args: {
    kind: 'address',
    title:
      'addr_test1qz98x4hm8g9x2evg3wu5f9kv44lljq4ss3j4tr6ecx0sr6p3s4ztvlzzqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq',
    eyebrow: 'Base address (payment & delegation)',
    description:
      'A deliberately dense address preview with a long title, long description, and all six facts present so containment can be checked quickly.',
    chain: 'preprod',
    facts: [
      ['Balance', '12.450000 ₳'],
      ['Txs', '43'],
      ['Assets', '6'],
      ['First seen', 'Block 3421022'],
      ['Last seen', 'Block 3787101'],
      ['Stake key', 'stake_test1uq78w3x84f4v76e60pkxj0psrj6q6e3y5ezh9jz0u7xtsqsp8wdm9'],
    ],
  },
}
