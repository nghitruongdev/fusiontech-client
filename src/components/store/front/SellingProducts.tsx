/** @format */
'use client'
import SectionTitle from '@components/ui/SectionTitle'
import { getProductsWithDetails } from '@/providers/server-data-provider/data/products'
import { IProduct } from 'types'
import Image from 'next/image'
import Link from 'next/link'
import NextLinkContainer from '@components/ui/NextLinkContainer'
import { formatDate, formatPrice } from '@/lib/utils'
import { BsStarFill } from 'react-icons/bs'
import { ChevronRight, Plus } from 'lucide-react'
import { Button } from '@components/ui/shadcn/button'
import { FavoriteButtonWithCardProvider } from './product/FavoriteButton'
import { ProductCardProvider } from './product/ProductCardProvider'
import { useEffect, useState } from 'react'
import { useCustom, useMany } from '@refinedev/core'
import { API } from 'types/constants'

const SellingProducts = () => {
  // const products = await getProductsWithDetails()
  // const [products, setProducts] = useState<IProduct[]>([])
  // const startDate = '2022-08-01'
  // const endDate = '2024-08-30'
  // const size = 5 // số lượng sản phẩm hiển thị lên

  const { getSellingProducts, resource } = API.products()
  const startDate = new Date('2022-08-30')
  const endDate = new Date('2024-08-30')

  const { data: { data } = {} } = useCustom<{ id: number }[]>({
    // url: `http://100.82.6.136:8080/api/statistical/best-seller?startDate=${startDate}&endDate=${endDate}&size=${size}`,
    url: getSellingProducts(startDate, endDate),
    method: 'get',
    meta: { resource },
  })

  const ids = data?.map((item) => item.id) ?? []
  const drop = useMany<IProduct>({
    resource: 'products',
    ids: ids,
    queryOptions: {
      enabled: !!ids.length,
    },
  })

  const { data: { data: products = [] } = {}, isFetching } = drop

  // useEffect(() => {
  //   async function fetchProducts() {
  //     try {
  //       const response = await fetch(
  //         `http://100.82.6.136:8080/api/statistical/best-seller?startDate=${startDate}&endDate=${endDate}&size=${size}`,
  //       ) // Thay YOUR_API_URL bằng URL của API bạn muốn gọi
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch products')
  //       }
  //       const data = await response.json() // Dữ liệu từ API
  //       setProducts(data)
  //     } catch (error) {
  //       console.error('Error fetching products:', error)
  //     }
  //   }

  //   fetchProducts()
  // }, [])

  console.log('seller', ids)

  return (
    <div className='bg-white rounded-lg '>
      <div className='flex  justify-between items-center px-3 pt-3 md:my-4 lg:mt-10  '>
        <h5 className='font-bold  text-xl uppercase '>
          top sản phẩm bán chạy{' '}
        </h5>
        <Link href={'http://localhost:3000'}>
          <div className=' flex flex-row items-center '>
            <p className='text-base font-semibold text-zinc-500'>Xem tất cả </p>
            <ChevronRight
              size={16}
              strokeWidth={1}
            />
          </div>
        </Link>
      </div>
      <hr />
      <div
        aria-label='product-list'
        className='flex flex-row overflow-auto max-h-[800px] gap-4 pl-2 pt-2 pb-1'>
        {/* <div className='grid grid-cols-5 gap-3'> */}
        {products.map((item: IProduct) => (
          // eslint-disable-next-line react/jsx-key
          <div className='rounded-lg  shadow border-gray-300 bg-white  '>
            <ProductCardProvider
              key={item.id}
              product={item}>
              <Product item={item} />
            </ProductCardProvider>
          </div>
        ))}
      </div>
    </div>
  )
}

const Product = ({
  item: {
    id,
    name,
    slug,
    images,
    summary,
    avgRating,
    brand,
    minPrice,
    maxPrice,
    discount,
  },
}: {
  item: IProduct
}) => {
  return (
    <div
      aria-label={`Product Item:${name}`}
      className=' group cursor-pointer lg:min-w-[16.666667%] md:min-w-[25%] sm:min-w-[33.333333%] min-w-[50%]'>
      <NextLinkContainer href={`/products/${id}`}>
        <Product.sale sale={discount} />
        <Link href={`/products/${id}`}>
          <Product.Image images={images} />
        </Link>
        <div className='px-2 flex flex-col justify-center'>
          <Product.Brand brand={brand} />
          {/* <div className='flex justify-between'>
            <Product.DetailButton
              id={id}
              slug={slug}
            />
          </div> */}
          <Product.Name name={name} />
          <Product.Price
            minPrice={minPrice}
            maxPrice={maxPrice}
          />
          <Product.Summary summary={summary} />
          <Product.Review avgRating={avgRating} />
        </div>
      </NextLinkContainer>

      {/* <Product.Review /> */}
    </div>
  )
}

Product.sale = ({ sale }: { sale: IProduct['discount'] }) => {
  if (!sale) {
    return null // Ẩn đi nếu không có dữ liệu giảm giá
  }

  return (
    <div className='relative'>
      <div
        className='absolute text-xs top-0 left-[-3px] m-0 bg-gradient-to-br from-[#b02d2d] to-[#ff5555] text-white font-bold px-2 py-1 rounded-tl-md rounded-tr-md rounded-br-md shadow'
        style={{
          zIndex: 2,
        }}>
        {sale}% OFF
      </div>

      <div className='relative top-[21.5px] left-[-2.2px] w-0 h-0 border-t-[5px] border-l-[5px] border-[#b02d2d] transform rotate-45 '></div>
    </div>
  )
}
Product.Image = ({ images }: { images: IProduct['images'] }) => {
  return (
    <div
      className='
          w-full h-auto overflow-y-hidden
          ease-in-out duration-300 scale-90 hover:scale-95'>
      {images?.[0] ?? '' ? (
        <Image
          src={images?.[0] ?? ''}
          alt='Product image'
          // fill
          width={200}
          height={100}
          loading='lazy'
          placeholder='blur'
          blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNMz4irBwAEGQGuUtJ+VQAAAABJRU5ErkJggg=='
          className='w-full  aspect-square rounded-md max-w-[200px] mx-auto object-cover'
        />
      ) : (
        <Image
          alt='/'
          width={200}
          height={100}
          className='w-full  aspect-square rounded-md max-w-[200px] mx-auto object-cover'
          src='https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fvariants%2FlogostuImage.png?alt=media&token=90709f04-0996-4779-ab80-f82e99c62041'
        />
      )}
      <Product.FavoriteButton />
    </div>
  )
}
Product.Brand = ({ brand }: { brand: IProduct['brand'] }) => {
  return (
    <p className='text-base  font-roboto font-semibold uppercase leading-normal text-zinc-600 line-clamp-1 pt-2'>
      {brand?.name}
    </p>
  )
}
Product.Name = ({ name }: { name: IProduct['name'] }) => {
  return (
    <p className=' text-xs leading-normal text-zinc-500 line-clamp-1 uppercase font-bold '>
      {/* {
                  "Laptop ACER Nitro 5 Eagle AN515-57-54MV (i5-11400H/RAM 8GB/RTX 3050/512GB SSD/ Windows 11)"
              } */}
      {name}
    </p>
  )
}
Product.Summary = ({ summary }: { summary: IProduct['summary'] }) => {
  return (
    <div className='bg-slate-100 rounded-md p-2 mb-2 h-14 max-h-14'>
      <p className='text-sm font-roboto leading-normal text-zinc-700 line-clamp-2 '>
        {summary}
      </p>
    </div>
  )
}

// eslint-disable-next-line react/display-name
Product.Price = ({
  minPrice,
  maxPrice,
}: {
  minPrice: IProduct['minPrice']
  maxPrice: IProduct['maxPrice']
}) => {
  return (
    <div className='flex justify-start items-center py-2'>
      <p className='font-titleFont text-base font-bold text-red-600 mr-1'>
        {formatPrice(minPrice)}
      </p>
      <p className='font-titleFont text-base font-bold text-red-600 mr-1'>-</p>
      <p className='font-titleFont text-base font-bold text-red-600 '>
        {formatPrice(maxPrice)}
      </p>
    </div>
  )
}

Product.Review = ({ avgRating }: { avgRating: IProduct['avgRating'] }) => {
  const starCount = 5

  const filledStars = Math.floor(avgRating ?? 0)

  const remainingStars = starCount - filledStars

  const filledStarsArray = Array.from({ length: filledStars }, (_, index) => (
    <BsStarFill key={index} />
  ))

  // Tạo mảng sao trống
  const remainingStarsArray = Array.from(
    { length: remainingStars },
    (_, index) => (
      <BsStarFill
        key={index}
        className='text-gray-300'
      />
    ),
  )

  return (
    <div className='flex items-center gap-2 text-yellow my-2'>
      {filledStarsArray}
      {remainingStarsArray}
      <p className='line font-bold text-muted-foreground leading-tight'>
        {avgRating}/5
      </p>
    </div>
  )
}

Product.DetailButton = ({
  id,
  slug,
}: {
  id: IProduct['id']
  slug: IProduct['slug']
}) => {
  return (
    <Link href={`/products/${id}`}>
      <button className='w-16 h-7 my-2 bg-white border-[1px] border-secondaryBlue text-zinc-700 font-semibold text-sm rounded-full flex items-center justify-center hover:bg-sky-700 hover:text-white duration-150'>
        {/* <span>
          <Plus />
        </span> */}
        Chi tiết
      </button>
    </Link>
  )
}

Product.FavoriteButton = FavoriteButtonWithCardProvider

export default SellingProducts
