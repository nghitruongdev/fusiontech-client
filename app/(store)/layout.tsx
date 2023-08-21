/** @format */

import RefineProvider from '@components/providers/RefineProvider'
import Footer from '@components/store/layout/Footer'
import Header from '@components/store/layout/Header'

export const metadata = {
  title: 'FusionTech Online Store',
  description: 'Cửa hàng thương mại thiết bị điện tử',
}

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <RefineProvider>
        {/* @ts-expect-error Async Server Component */}
        <Header />
        <main>{children}</main>
        <Footer />
      </RefineProvider>
    </div>
  )
}
