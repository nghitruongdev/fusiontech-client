/** @format */

'use client'
import { createContext, useContext, PropsWithChildren } from 'react'
import { IProduct } from 'types'
import { BsStarFill } from 'react-icons/bs'
import Image from 'next/image'
import { Images } from 'types/constants'
import { FavoriteButton } from './FavoriteButton'
import { formatPrice } from '@/lib/utils'
import { DivPropsType } from '@refinedev/core/dist/components/pages/auth'
import NextLinkContainer from '@components/ui/NextLinkContainer'

type ContextState = {
  product: IProduct
}

type ProviderProps = ContextState & DivPropsType

const ProductCard = (props: ProviderProps) => {
  return (
    <ProductCard.Provider {...props}>
      <ProductCard.Image />
      <ProductCard.Brand />
      <ProductCard.Name />
      <ProductCard.Price />
      <ProductCard.AvgRating />
      <ProductCard.Summary />
      <ProductCard.Discount />
    </ProductCard.Provider>
  )
}

ProductCard.Context = createContext<ContextState | null>(null)
ProductCard.useContext = () => {
  const ctx = useContext(ProductCard.Context)
  if (!ctx) throw new Error('ProductCard.Context is missing')
  return ctx
}
ProductCard.Provider = function CardProvider({
  children,
  product,
  ...props
}: PropsWithChildren<ProviderProps>) {
  return (
    <ProductCard.Context.Provider value={{ product }}>
      <div {...props}>{children}</div>
    </ProductCard.Context.Provider>
  )
}

ProductCard.LinkContainer = function ProductLinkContainer({
  children,
}: PropsWithChildren) {
  const {
    product: { name, id, slug },
  } = ProductCard.useContext()
  return (
    <>
      <div className='bg-white mx-2 rounded-lg border-gray-300 shadow'>
        <div
          aria-label={`Product Item:${name}`}
          className='group cursor-pointer lg:min-w-[16.666667%] md:min-w-[25%] sm:min-w-[33.333333%] min-w-[50%]'>
          <NextLinkContainer href={`/san-pham/${id}-${slug}`}>
            {children}
          </NextLinkContainer>
        </div>
      </div>
    </>
  )
}
ProductCard.ProductContainer = function ProductContainer({
  children,
}: PropsWithChildren) {
  const {
    product: { name, id, slug },
  } = ProductCard.useContext()
  return (
    <>
      <div className='bg-white mx-2 rounded-lg border-gray-300 shadow w-[182px] h-[400px] '>
        <div
          aria-label={`Product Item:${name}`}
          className='group cursor-pointer '>
          <NextLinkContainer href={`/san-pham/${id}-${slug}`}>
            {children}
          </NextLinkContainer>
        </div>
      </div>
    </>
  )
}

ProductCard.Image = function ProductImage() {
  const {
    product: { images },
  } = ProductCard.useContext()
  return (
    <div
      className='
        w-full h-auto overflow-y-hidden
        ease-in-out duration-300 scale-90 hover:scale-95'>
      <Image
        src={images?.[0] ?? Images.products}
        alt='Product image'
        width={200}
        height={200}
        loading='lazy'
        placeholder='blur'
        blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNMz4irBwAEGQGuUtJ+VQAAAABJRU5ErkJggg=='
        className='w-full  aspect-square rounded-md max-w-[200px] mx-auto object-contain'
      />
      <ProductCard.FavoriteButton />
    </div>
  )
}

ProductCard.Name = function ProductName() {
  const {
    product: { name },
  } = ProductCard.useContext()
  return (
    <p className='text-sm leading-normal text-zinc-600 line-clamp-1 '>{name}</p>
  )
}

ProductCard.Discount = function ProductDiscount() {
  const {
    product: { discount },
  } = ProductCard.useContext()
  if (!discount) return <></>
  return (
    <>
      <div className='relative'>
        <div
          className='absolute text-xs top-0 left-[-3px] m-0 bg-gradient-to-br from-[#b02d2d] to-[#ff5555] text-white font-bold px-2 py-1 rounded-tl-md rounded-tr-md rounded-br-md shadow'
          style={{
            zIndex: 2,
          }}>
          {discount}% OFF
        </div>

        <div className='relative top-[21.5px] left-[-2.2px] w-0 h-0 border-t-[5px] border-l-[5px] border-[#b02d2d] transform rotate-45 '></div>
      </div>
    </>
  )
}

ProductCard.Price = function ProductPrice() {
  const {
    product: { minPrice, maxPrice, discount = 0 },
  } = ProductCard.useContext()
  const discountPrice = (price: number | undefined) =>
    ((100 - discount) / 100) * (price ?? 0)
  return (
    <div className='flex flex-col justify-start py-2'>
      <p className='font-titleFont text-base font-bold text-red-600  '>
        {formatPrice(discountPrice(minPrice))}
      </p>
      <p className='font-titleFont text-sm font-medium text-slate-400 line-through  '>
        {formatPrice(minPrice)}
      </p>
    </div>
  )
}

ProductCard.Brand = function ProductBrand() {
  const {
    product: { brand },
  } = ProductCard.useContext()
  return (
    <p className='text-base  font-roboto font-semibold uppercase leading-normal text-zinc-700 line-clamp-1 pt-2'>
      {brand?.name}
    </p>
  )
}

ProductCard.Summary = function ProductSummary() {
  const {
    product: { summary },
  } = ProductCard.useContext()
  return (
    <div className='bg-slate-100 rounded-md p-2 mb-2 h-14 max-h-14'>
      <p className='text-sm font-roboto leading-normal text-zinc-700 line-clamp-2 '>
        {summary}
      </p>
    </div>
  )
}

ProductCard.AvgRating = function ProductAvgRating() {
  const {
    product: { avgRating, reviewCount },
  } = ProductCard.useContext()
  const starCount = 5

  const filledStars = Math.floor(avgRating ?? 0)
  const roundedAvgRating = (avgRating ?? 0).toFixed(1)
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
      <p className='line text-sm text-muted-foreground leading-tight'>
        {reviewCount ?? 0}
      </p>
    </div>
  )
}
ProductCard.FavoriteButton = function CardFavoriteButton() {
  const { product } = ProductCard.useContext()
  return <FavoriteButton product={product} />
}
export default ProductCard
