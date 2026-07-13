import {
  ogImageContentType,
  ogImageSize,
  renderOpenGraphImage,
} from '~/app/_utils/og-image'

export const alt = 'Address Inspector'
export const size = ogImageSize
export const contentType = ogImageContentType

export default function Image() {
  return renderOpenGraphImage({
    kind: 'address',
    title: 'Address Inspector',
    eyebrow: 'Cardano address anatomy',
    description:
      'Parse Cardano addresses and inspect Shelley, Byron, stake, and script address structure.',
    facts: [
      ['Types', 'Shelley + Byron'],
      ['Mode', 'Parse + dissect'],
      ['Output', 'Address details'],
    ],
  })
}
