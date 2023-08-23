/** @format */

'use client'
import AuthenticatedPage from 'app/(others)/authenticated'
import { PropsWithChildren } from 'react'

const Layout = ({ children }: PropsWithChildren) => {
  return <AuthenticatedPage>{children}</AuthenticatedPage>
}
export default Layout
