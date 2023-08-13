/** @format */
'use client'
import { useRecentProductViewStore } from '@components/providers/RecentProductViewProvider'
import { ProductCardProvider } from '../product/ProductCardProvider'
import { Link } from '@chakra-ui/react'
import { BsStarFill } from 'react-icons/bs'
import { formatPrice } from '@/lib/utils'
import { IProduct } from 'types'
import Image from 'next/image'

import NextLinkContainer from '@components/ui/NextLinkContainer'
import { FavoriteButtonWithCardProvider } from '../product/FavoriteButton'
import { ChevronRight } from 'lucide-react'

const RecentProductView = () => {
  const [items] = useRecentProductViewStore((state) => [state.items])
  if (!items.length) return <></>
  return (
    <div className='bg-white rounded-lg '>
      <div className='flex  justify-between items-center px-3 pt-3 md:my-4 lg:mt-10  '>
        <h5 className='font-bold  text-xl uppercase '>
          Sản phẩm đã xem gần đây
        </h5>
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
          <div
            key={product.id}
            className='rounded-lg shadow border-gray-300 bg-white'>
            <ProductCardProvider
              product={product}
              key={product.id}>
              <Product item={product} />
              {/* <p>{time && new Date(time).toISOString()}</p> */}
            </ProductCardProvider>
          </div>
        ))}
      </div>
    </div>

    // </div>
  )
}

const Product = ({
  item: { id, name, slug, images, summary, avgRating, brand },
}: {
  item: IProduct
}) => {
  return (
    <div
      aria-label={`Product Item:${name}`}
      className=' group cursor-pointer lg:min-w-[16.666667%] md:min-w-[25%] sm:min-w-[33.333333%] min-w-[100%]'>
      <NextLinkContainer href={`/products/${id}`}>
        <Product.sale />
        <Link href={`/products/${id}`}>
          <Product.Image images={images} />
        </Link>
        <div className='px-2 flex flex-col justify-center'>
          {/* <Product.Brand brand={brand} /> */}
          {/* <div className='flex justify-between'>
            <Product.DetailButton
              id={id}
              slug={slug}
            />
          </div> */}
          <Product.Name name={name} />
          <Product.Price />
          {/* <Product.Summary summary={summary} /> */}
          {/* <Product.Review avgRating={avgRating} /> */}
        </div>
      </NextLinkContainer>

      {/* <Product.Review /> */}
    </div>
  )
}

Product.sale = () => {
  return (
    <>
      <div className='relative'>
        <div
          className='absolute text-xs top-0 left-[-3px] m-0 bg-gradient-to-br from-[#b02d2d] to-[#ff5555] text-white font-bold px-2 py-1 rounded-tl-md rounded-tr-md rounded-br-md shadow'
          style={{
            zIndex: 2,
          }}>
          50% OFF
        </div>

        <div className='relative top-[21.5px] left-[-2.2px] w-0 h-0 border-t-[5px] border-l-[5px] border-[#b02d2d] transform rotate-45 '></div>
      </div>
    </>
  )
}

Product.Image = function ProductImage({
  images,
}: {
  images: IProduct['images']
}) {
  return (
    <div
      className='
          w-full h-auto p-2 overflow-y-hidden
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
Product.Brand = function Brand({ brand }: { brand: IProduct['brand'] }) {
  return (
    <p className='text-base  font-roboto font-semibold uppercase leading-normal text-zinc-600 line-clamp-1 pt-2'>
      {brand?.name}
    </p>
  )
}
Product.Name = function Name({ name }: { name: IProduct['name'] }) {
  return (
    <p className=' text-xs leading-normal text-zinc-500 line-clamp-1 uppercase font-bold '>
      {/* {
                  "Laptop ACER Nitro 5 Eagle AN515-57-54MV (i5-11400H/RAM 8GB/RTX 3050/512GB SSD/ Windows 11)"
              } */}
      {name}
    </p>
  )
}
Product.Summary = function Summary({
  summary,
}: {
  summary: IProduct['summary']
}) {
  return (
    <div className='bg-slate-100 rounded-md p-2 mb-2 h-14 max-h-14'>
      <p className='text-sm font-roboto leading-normal text-zinc-700 line-clamp-2 '>
        {summary}
      </p>
    </div>
  )
}

Product.Price = function Price() {
  return (
    <div className='flex justify-start items-center py-2'>
      <p className='font-titleFont text-md font-bold text-red-600 mr-2'>
        {formatPrice(25_000_000)}
      </p>
      {/* <p className='text-gray-500 font-titleFont text-sm leading-tight line-through decoration-[1px] ml-2'>
        {formatPrice(29_000_000)}
      </p> */}
    </div>
  )
}

Product.Review = function Review({
  avgRating,
}: {
  avgRating: IProduct['avgRating']
}) {
  // return (
  //   <div className='flex items-center gap-2 text-yellow my-2'>
  //     {/* {avgRating} */}
  //     <BsStarFill />
  //     <BsStarFill />
  //     <BsStarFill />
  //     <BsStarFill />
  //     <BsStarFill />
  //     <p className='line font-bold text-muted-foreground leading-tight'>
  //       {avgRating}/5
  //     </p>
  //   </div>
  // )
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

Product.DetailButton = function DetailButton({
  id,
  slug,
}: {
  id: IProduct['id']
  slug: IProduct['slug']
}) {
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
export default RecentProductView
