import { parseAddress } from '@laceanatomy/napi-pallas'
import { Address } from '@laceanatomy/types'
import {
  isValidChain,
  NETWORK,
  type Network,
} from '@laceanatomy/types/cardano'
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
import {
  loadAddressStats,
  resolveDisplayAddress,
  resolveTypeLabel,
} from './_utils'

export const alt = 'Address'
export const size = ogImageSize
export const contentType = ogImageContentType

type Props = {
  params: Promise<{ chain: Network; address: string }>
}

export default async function Image({ params }: Props) {
  const { chain: chainParam, address: raw } = await params
  const chain: Network = isValidChain(chainParam)
    ? chainParam
    : NETWORK.MAINNET
  const chainLabel = formatChain(chain)
  const shortAddress = truncateMiddle(raw, 16, 12)
  const fallbackDescription = `Inspect Cardano ${chainLabel} address ${shortAddress} in Lace Anatomy.`

  try {
    const normalizedAddress = Address(raw)
    const addressInfoRes = parseAddress(raw)
    const addressInfo = addressInfoRes.error?.trim()
      ? undefined
      : addressInfoRes.address
    const typeLabel = resolveTypeLabel(addressInfo, raw)
    const displayAddress = resolveDisplayAddress(
      raw,
      addressInfo?.kind,
      chain,
      normalizedAddress,
    )
    const { balance, tokenEntries, txCount, firstSeen, lastSeen } =
      await loadAddressStats({ chain, normalizedAddress })
    const description = `${formatAdaCompact(balance)} balance, ${txCount.toString()} transactions, ${tokenEntries.length} native assets on ${chainLabel}.`

    return renderOpenGraphImage({
      kind: 'address',
      title: displayAddress,
      eyebrow: typeLabel,
      description,
      chain,
      facts: [
        ['Balance', formatAdaCompact(balance)],
        ['Txs', txCount.toString()],
        ['Assets', tokenEntries.length.toString()],
        [
          'First seen',
          firstSeen?.blockHeight ? `Block ${firstSeen.blockHeight}` : 'Unknown',
        ],
        [
          'Last seen',
          lastSeen?.blockHeight ? `Block ${lastSeen.blockHeight}` : 'Unknown',
        ],
      ],
    })
  } catch (err) {
    console.error(err)
    return renderOpenGraphImage({
      kind: 'address',
      title: raw,
      eyebrow: 'Address',
      description: fallbackDescription,
      chain,
      facts: [
        ['Address', shortAddress],
        ['Network', chainLabel],
      ],
    })
  }
}
