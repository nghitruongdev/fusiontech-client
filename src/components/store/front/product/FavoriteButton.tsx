/** @format */

'use client'
import { Heart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useBoolean } from '@chakra-ui/react'
import useFavorite, { useFavoriteStore } from '@/hooks/useFavorite'
import { IProduct } from 'types'
import { cn } from 'components/lib/utils'
import { BaseSyntheticEvent } from 'react'

export const FavoriteButton = ({
  product,
  hideNotActive = true,
}: {
  product: IProduct | undefined
  hideNotActive?: boolean
}) => {
  const [isFavorited, setFavorited] = useState(false)
  const [isBouncing, { on: startBouncing, off: stopBouncing }] = useBoolean()

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
    if (!product?.id) {
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
    }, 1000)
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        `absolute top-1 right-2 group-hover:bg-white rounded-full p-1 cursor-pointer`,
        !isFavorited && hideNotActive && `opacity-0 group-hover:opacity-100`,
        isBouncing && `animate-pulse !duration-600 pointer-events-none`,
        `active:animate-ping duration-300 ease-in-out`,
      )}>
      <Heart
        className={`text-sm w-5 h-5 font-bold text-rose-500  ${
          isFavorited ? 'fill-current' : ''
        }`}
      />
    </div>
  )
}
