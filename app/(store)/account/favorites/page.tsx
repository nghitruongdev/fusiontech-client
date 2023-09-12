/** @format */

'use client'
import React, { useMemo } from 'react'
import { useFavoriteStore } from '@/hooks/useFavorite'
import ProductCard from '@components/store/front/product/ProductCard'
import { NoData } from '@components/no-result/NoData'

const FavoriteProducts = () => {
  const [favorites] = useFavoriteStore((state) => [state.favoriteProducts])
  const items = useMemo(() => Object.values(favorites), [favorites])
  return (
    <div className='mx-auto bg-white rounded py-4'>
      <h1 className='text-xl font-semibold pl-4 pb-4'>
        Sản phẩm bạn yêu thích
      </h1>
      <div className='mx-auto'>
        {!items.length && <NoData />}
        <div className='px-4 mx-4 grid grid-cols-4 gap-4'>
          {items.map((product) => (
            <ProductCard.Provider
              key={product.id}
              product={product}>
              <ProductCard.ProductContainer>
                <ProductCard.Discount />
                <ProductCard.Image />
                <div className='px-2 flex flex-col'>
                  <ProductCard.Brand />
                  <ProductCard.Name />
                  <ProductCard.Price />
                  <ProductCard.Summary />
                  <ProductCard.AvgRating />
                </div>
              </ProductCard.ProductContainer>
            </ProductCard.Provider>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FavoriteProducts
