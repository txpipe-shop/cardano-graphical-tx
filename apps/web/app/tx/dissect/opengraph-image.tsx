import {
  ogImageContentType,
  ogImageSize,
  renderOpenGraphImage,
} from '~/app/_utils/og-image'

export const alt = 'Transaction Dissector'
export const size = ogImageSize
export const contentType = ogImageContentType

export default function Image() {
  return renderOpenGraphImage({
    kind: 'tx',
    title: 'Transaction Dissector',
    eyebrow: 'Structured transaction data',
    description:
      'Break Cardano transactions into inputs, outputs, witnesses, metadata, scripts, and ledger details.',
    facts: [
      ['Sections', 'Inputs + outputs'],
      ['Data', 'Witnesses + scripts'],
      ['Format', 'Developer view'],
    ],
  })
}
