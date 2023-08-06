/** @format */

'use client'
import { useEffect, useState } from 'react'
import { useBoolean } from '@chakra-ui/react'
import { Heart } from 'lucide-react'
import { createContext, useContext, PropsWithChildren } from 'react'
import { IProduct } from 'types'
import useFavorite, { useFavoriteStore } from '@/hooks/useFavorite'
import { BaseRequestHandler } from 'next/dist/server/base-server'
import { BaseSyntheticEvent } from 'react'

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

export const FavoriteButton = () => {
  const [isFavorited, setFavorited] = useState(false)
  const [isBouncing, { on: startBouncing, off: stopBouncing }] = useBoolean()
  const { product } = useProductCardContext()

  const { addFavoriteProduct, deleteFavoriteProduct } = useFavorite()
  const [favorites, checkFavorite] = useFavoriteStore(
    ({ favoriteProducts, isFavorite }) => [favoriteProducts, isFavorite],
  )

  useEffect(() => {
    if (!product || !product.id) {
      setFavorited(false)
      return
    }
    console.log('isFavorited', isFavorited)
    setFavorited(checkFavorite(+product.id))
  }, [product, favorites, checkFavorite, isFavorited])

  const onClick = (e: BaseSyntheticEvent) => {
    e.preventDefault()
    if (!product.id) {
      console.error('Product Id is not found')
      return
    }
    startBouncing()

    setTimeout(async () => {
      if (!product.id) return
      const promise = isFavorited
        ? deleteFavoriteProduct(+product.id)
        : addFavoriteProduct(product)
      await promise
      stopBouncing()
    }, 500)
  }

  return (
    <div
      onClick={onClick}
      className={`absolute ${
        !isFavorited ? 'opacity-0 group-hover:opacity-100' : ''
      } ${isBouncing ? 'animate-pulse !duration-1000' : ''}
            ${'active:animate-ping'} top-1 right-2 group-hover:bg-white rounded-full p-1 duration-300 ease-in-out`}>
      <Heart
        className={`text-sm w-5 h-5 font-bold text-rose-500  ${
          isFavorited ? 'fill-current' : ''
        }`}
      />
    </div>
  )
}
