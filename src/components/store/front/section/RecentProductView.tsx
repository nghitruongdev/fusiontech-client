/** @format */
'use client'
import { useRecentProductViewStore } from '@components/providers/RecentProductViewProvider'
import ProductCard from '../product/ProductCard'

const RecentProductView = () => {
  const [items] = useRecentProductViewStore((state) => [state.items])
  if (!items.length) return <></>
  return (
    <div className='bg-white rounded-lg '>
      <div className='flex  justify-between items-center px-3 pt-3 md:my-4 lg:mt-10  '>
        <h5 className='font-bold  text-xl uppercase '>Đã xem gần đây</h5>
      </div>
      <hr />
      {/* <p>Newest</p> */}
      {/* <div className='grid grid-cols-6 rounded-lg bg-slate-50'> */}
      <div
        aria-label='product-list'
        className='flex flex-row overflow-auto gap-4  pl-2 pt-2 pb-1'>
        {' '}
        {/* Thay đổi kích thước với max-w-[1200px] */}
        {items.map(({ product, time }) => (
          // eslint-disable-next-line react/jsx-key
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

    // </div>
  )
}

export default RecentProductView
