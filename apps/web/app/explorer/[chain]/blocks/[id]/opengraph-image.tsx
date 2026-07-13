import {
  isValidChain,
  NETWORK,
  type Network,
} from '@laceanatomy/types/cardano'
import assert from 'assert'
import { resolveBlockReq } from '~/app/_utils/block'
import {
  formatAdaCompact,
  formatChain,
  truncateMiddle,
} from '~/app/_utils/metadata'
import {
  ogImageContentType,
  ogImageSize,
  renderOpenGraphImage,
} from '~/app/_utils/og-image'
import { getDolosProvider } from '~/server/api/dolos-provider'

export const alt = 'Block'
export const size = ogImageSize
export const contentType = ogImageContentType

type Props = {
  params: Promise<{ chain: Network; id: string }>
}

export default async function Image({ params }: Props) {
  const { id, chain: chainParam } = await params
  const chain: Network = isValidChain(chainParam)
    ? chainParam
    : NETWORK.MAINNET
  const chainLabel = formatChain(chain)
  const blockReq = resolveBlockReq(id)
  const fallbackDescription = `Inspect Cardano ${chainLabel} block ${truncateMiddle(id)} in Lace Anatomy.`

  if (!blockReq || chain === NETWORK.DEVNET) {
    return renderOpenGraphImage({
      kind: 'block',
      title: `Block ${id}`,
      eyebrow: 'Block',
      description: fallbackDescription,
      chain,
      facts: [
        ['Identifier', truncateMiddle(id)],
        ['Network', chainLabel],
      ],
    })
  }

  try {
    const {
      data: [blockWithTxs],
    } = await getDolosProvider(chain).getBlocksWithTxs({
      cursor: blockReq,
      limit: 1n,
    })
    assert(blockWithTxs, 'Block not found')
    const { block, transactions } = blockWithTxs
    const description = `${transactions.length} transactions, ${formatAdaCompact(block.fees)} total fees, slot ${block.slot.toString()}.`

    return renderOpenGraphImage({
      kind: 'block',
      title: `Block ${block.height.toString()}`,
      eyebrow: 'Block',
      description,
      chain,
      facts: [
        ['Hash', truncateMiddle(block.hash)],
        ['Slot', block.slot.toString()],
        ['Txs', transactions.length.toString()],
        ['Fees', formatAdaCompact(block.fees)],
        ['Epoch', block.epoch?.toString() ?? 'Unknown'],
      ],
    })
  } catch (err) {
    console.error(err)
    return renderOpenGraphImage({
      kind: 'block',
      title: `Block ${id}`,
      eyebrow: 'Block',
      description: fallbackDescription,
      chain,
      facts: [
        ['Identifier', truncateMiddle(id)],
        ['Network', chainLabel],
      ],
    })
  }
}
