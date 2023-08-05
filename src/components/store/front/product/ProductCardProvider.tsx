/** @format */

import { createContext, useContext, PropsWithChildren } from 'react'
import { IProduct } from 'types'

type ContextState = {
  product: IProduct
}
const ProductContext = createContext<ContextState | null>(null)

export const useProductCardContext = () => {
  const ctx = useContext(ProductContext)
  if (!ctx) throw new Error('ProductContext.Provider is missing')
  return ctx
}

export const ProductCardProvider = ({
  children,
  product,
}: PropsWithChildren<{ product: IProduct }>) => {
  return (
    <ProductContext.Provider value={{ product }}>
      {children}
    </ProductContext.Provider>
  )
}
