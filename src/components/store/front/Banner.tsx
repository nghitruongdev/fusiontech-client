/** @format */

// const Banner = () => {
//   return (

//   )
// }
// export default Banner
/** @format */
'use client'
import SectionTitle from '@components/ui/SectionTitle'
import { getProductsWithDetails } from '@/providers/server-data-provider/data/products'
import { IProduct } from 'types'
import Image from 'next/image'
import Link from 'next/link'
import NextLinkContainer from '@components/ui/NextLinkContainer'
import { formatPrice } from '@/lib/utils'
import { BsStarFill } from 'react-icons/bs'
import { ChevronRight, Plus } from 'lucide-react'
import { Button } from '@components/ui/shadcn/button'
import { FavoriteButtonWithCardProvider } from './product/FavoriteButton'
import { ProductCardProvider } from './product/ProductCardProvider'
import { API } from 'types/constants'
import { useCustom } from '@refinedev/core'
import { bannerImg, newProduct } from 'public/assets/images'
import CaptionCarousel from '@components/ui/Carousel'
import SliderButton from '@components/ui/SliderButton'
import Slider from 'react-slick'
import { useRef } from 'react'
// import { Flex } from "@chakra-ui/react";
// import { useWindowDimensions } from "@/hooks/useWindowDimensions";

const Banner = () => {
  // const { width } = useWindowDimensions();
  // let numProductToShow = 10
  // const products = await getProductsWithDetails()

  const { getHotProducts, resource } = API.products()

  const { data: { data: products = [] } = {} } = useCustom<IProduct[]>({
    url: getHotProducts(5),
    method: 'get',
    meta: { resource },
  })
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: 'linear',
    swipeToSlide: true,
    // arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }
  const sliderRef = useRef<Slider | null>(null)
  const backgroundImageURL =
    'https://media.istockphoto.com/id/496310783/vector/blue-boxes-background.jpg?s=170667a&w=0&k=20&c=7VgnHxd9MiDx21RsgF6bjlgdyvaxwbjOOyfI-QAdg5Q='
  return (
    <div className='w-full  px-4 py-4 font-titleFont flex gap-4 '>
      <div className='w-2/3 rounded-lg h-[410px] shadow-md relative'>
        <CaptionCarousel />
      </div>
      <div
        className='w-1/3 border-[1px] border-gray-200 rounded-lg shadow-md p-4 flex flex-col justify-between'
        style={{
          backgroundImage: `url(${backgroundImageURL})`,
          backgroundSize: 'cover',
          backgroundPosition: '100% 100%',
        }}>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-semibold uppercase text-black'>
            Sản phẩm 🔥
          </h2>
          <p className='text-base text-zinc-600 underline underline-offset-2'>
            View all
          </p>
        </div>
        {/* <div className='flex justify-center items-center h-60'>
          <a href='#'>
            <Image
              className='h-full w-60 object-cover'
              src={newProduct}
              alt=''
            />
          </a>
        </div> */}
        <div className=''>
          <div className='relative px-2 pb-2 text-center'>
            <Slider
              {...settings}
              ref={(slider) => (sliderRef.current = slider)}>
              {products.map((product: IProduct) => (
                <ProductCardProvider
                  key={product.id}
                  product={product}>
                  {/* <div className='bg-white mx-2 rounded-lg border-gray-300 shadow'> */}
                  <Product item={product} />
                  {/* </div> */}
                </ProductCardProvider>
              ))}
            </Slider>
          </div>
        </div>
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
          {/* <Product.Summary summary={summary} /> */}
          <div className='flex justify-between'>
            <Product.Review avgRating={avgRating} />
            <Product.DetailButton
              id={id}
              slug={slug}
            />
          </div>
        </div>
      </NextLinkContainer>

      {/* <Product.Review /> */}
    </div>
  )
}

Product.sale = ({ sale }: { sale: IProduct['discount'] }) => {
  if (!sale) {
    return null
  }
  return (
    <>
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
    </>
  )
}
// eslint-disable-next-line react/display-name
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
          width={400}
          height={600}
          loading='lazy'
          placeholder='blur'
          blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNMz4irBwAEGQGuUtJ+VQAAAABJRU5ErkJggg=='
          className='w-full h-full  aspect-square rounded-md max-w-[200px] mx-auto object-cover'
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
// eslint-disable-next-line react/display-name
Product.Brand = ({ brand }: { brand: IProduct['brand'] }) => {
  return (
    <p className='text-base  font-roboto font-semibold uppercase leading-normal text-zinc-600 line-clamp-1 pt-2'>
      {brand?.name}
    </p>
  )
}
// eslint-disable-next-line react/display-name
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
// eslint-disable-next-line react/display-name
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
// eslint-disable-next-line react/display-name
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
// eslint-disable-next-line react/display-name
Product.DetailButton = ({
  id,
  slug,
}: {
  id: IProduct['id']
  slug: IProduct['slug']
}) => {
  return (
    <Link href={`/products/${id}`}>
      <button className='w-[100px] h-10  bg-white border-[1px] border-secondaryBlue text-zinc-700 font-semibold text-sm rounded-full flex items-center justify-center hover:bg-sky-700 hover:text-white duration-150'>
        <span className='my-10'>
          <Plus size={16} />
        </span>
        Chi tiết
      </button>
    </Link>
  )
}

Product.FavoriteButton = FavoriteButtonWithCardProvider

export default Banner
