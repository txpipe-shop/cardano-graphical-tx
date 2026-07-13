import type { Metadata } from 'next'
import { ROUTES } from '~/app/_utils/constants'
import { createPageMetadata } from '~/app/_utils/metadata'

export const metadata: Metadata = createPageMetadata({
  title: 'Transaction Grapher',
  description:
    'Render Cardano transactions as graphical UTxO diagrams for debugging and exploration.',
  path: ROUTES.GRAPHER,
})

export default function GrapherLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
