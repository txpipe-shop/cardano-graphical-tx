import {
  ogImageContentType,
  ogImageSize,
  renderOpenGraphImage,
} from '~/app/_utils/og-image'

export const alt = 'Transaction Grapher'
export const size = ogImageSize
export const contentType = ogImageContentType

export default function Image() {
  return renderOpenGraphImage({
    kind: 'tx',
    title: 'Transaction Grapher',
    eyebrow: 'Graphical UTxO view',
    description:
      'Render Cardano transactions as graphical UTxO diagrams for debugging and exploration.',
    facts: [
      ['View', 'Diagram'],
      ['Model', 'eUTxO'],
      ['Focus', 'Flows + outputs'],
    ],
  })
}
