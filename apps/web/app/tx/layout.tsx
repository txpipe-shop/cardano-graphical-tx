import type { Metadata } from 'next'
import { ROUTES } from '~/app/_utils/constants'
import { createPageMetadata } from '~/app/_utils/metadata'

export const metadata: Metadata = createPageMetadata({
  title: 'Transaction Tools',
  description:
    'Draw, dissect, and inspect Cardano transactions from CBOR or transaction hashes.',
  path: ROUTES.TX,
})

export default function TxLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
