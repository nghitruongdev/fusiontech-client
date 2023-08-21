/** @format */

import './globals.css'
import '@smastrom/react-rating/style.css'

import { Inter, Open_Sans } from 'next/font/google'
import dynamic from 'next/dynamic'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })
const open_sans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open_sans',
})
export const metadata = {
  title: 'FusionTech Online Store',
  description: 'Cửa hàng thương mại thiết bị điện tử',
}

const DynamicAuthProvider = dynamic(
  () => import('@components/providers/AuthProvider'),
  { ssr: false },
)
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className={`${inter.className} font-sans relative`}>
        <DynamicAuthProvider>{children}</DynamicAuthProvider>
      </body>
    </html>
  )
}
