/** @format */
'use client'
import { useRecentProductViewStore } from '@components/providers/RecentProductViewProvider'
import { ProductCardProvider } from '../product/ProductCardProvider'

const RecentProductView = () => {
  const [items] = useRecentProductViewStore((state) => [state.items])
  if (!items.length) return <></>
  return (
    <>
      <p className='text-2xl font-bold mt-4'>Sản phẩm đã xem gần đây</p>
      {items.map(({ product, time }) => (
        <ProductCardProvider
          product={product}
          key={product.id}>
          <p>{product.id}</p>
          <p>{product.name}</p>
          <p>{time && new Date(time).toISOString()}</p>
        </ProductCardProvider>
      ))}
    </>
  )
}
export default RecentProductView
