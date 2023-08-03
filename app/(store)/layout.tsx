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
    <div className='font-roboto bg-white'>
      <RefineProvider>
        <Header />
        {/* <Link href="/test">Go to test</Link> */}
        <main>{children}</main>
        <Footer />
      </RefineProvider>
    </div>
  )
}
