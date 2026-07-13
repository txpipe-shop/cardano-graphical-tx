import type { Metadata } from 'next'
import { ROUTES } from '~/app/_utils/constants'
import { createPageMetadata } from '~/app/_utils/metadata'

export const metadata: Metadata = createPageMetadata({
  title: 'Address Inspector',
  description:
    'Parse Cardano addresses and inspect Shelley, Byron, stake, and script address structure.',
  path: ROUTES.ADDRESS,
})

export default function AddressLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
