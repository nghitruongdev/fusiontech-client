/** @format */

'use client'
import { IProduct } from 'types'
import Image from 'next/image'
import { BsStarFill } from 'react-icons/bs'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import NextLinkContainer from '@components/ui/NextLinkContainer'
import { useList } from '@refinedev/core'
import Slider from 'react-slick'
import { useRef } from 'react'
import SliderButton from '@components/ui/SliderButton'
import { loginImg } from 'public/assets/images'
import { Button } from '@components/ui/shadcn/button'
import { formatPrice } from '@/lib/utils'
import {
  ProductCardProvider,
  useProductCardContext,
} from './product/ProductCardProvider'
import { FavoriteButtonWithCardProvider } from './product/FavoriteButton'

// const ProductList = async () => {
//     const products = await getProductsWithDetails();
//     console.log("product", products.data);
//     console.log("proudct page", products.page);
//     return (
//         <>
//             <div className="flex justify-between">
//                 <h3>Sản phẩm nổi bật</h3>
//                 <p>Xem tất cả</p>
//             </div>
//             <div aria-label="product-list" className="flex overflow-scroll">
//                 {Object.values(products.data).map((item: IProduct) => (
//                     <ProductCardProvider key={item.id} product={item}>
//                         <Product item={item} />
//                     </ProductCardProvider>
//                 ))}
//             </div>
//         </>
//     );
// };

const ProductList = () => {
  const { data, status } = useList<IProduct>({
    resource: 'products',
  })

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 6,
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
          slidesToShow: 6,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
    ],
  }
  const sliderRef = useRef<Slider | null>(null)
  const backgroundImageURL =
    'https://videohive.img.customer.envatousercontent.com/files/a520307e-8e7a-4b9c-9cb5-60cb91405691/inline_image_preview.jpg?auto=compress%2Cformat&fit=crop&crop=top&max-h=8000&max-w=590&s=8faba409bcd263eeb170d860015ee274'
  return (
    <>
      {/* bg-[#ffc42133]? */}
      {/* <SectionTitle title={'Sản phẩm nổi bật'} className="mt-2" /> */}
      <div
        className='grid grid-cols-6 rounded-lg'
        style={{
          backgroundImage: `url(${backgroundImageURL})`,
          backgroundSize: 'cover',
          backgroundPosition: '100% 100%',
        }}>
        {/* <div className='col-span-1'>
          <div className='flex flex-col items-center justify-center h-full  '>
            <Link href={'http://localhost:3000/search?keyword='}>
              <Image
                src={loginImg}
                width={250}
                height={10}
                alt={'/'}
              />
            </Link>
          </div>
        </div> */}
        <div className='col-span-6'>
          <div className='relative p-1 my-2 md:my-4 text-center'>
            {status === 'loading' ? (
              <div>Loading...</div>
            ) : status === 'error' ? (
              <div>Error occurred while fetching data</div>
            ) : data && data.data && Array.isArray(data.data) ? (
              <>
                <SliderButton sliderRef={sliderRef} />
                <Slider
                  {...settings}
                  ref={(slider) => (sliderRef.current = slider)}>
                  {data.data.map((products: IProduct) => (
                    <ProductCardProvider
                      key={products.id}
                      product={products}>
                      <div className='bg-white mx-2 rounded-lg border-gray-300 shadow'>
                        <Product item={products} />
                      </div>
                    </ProductCardProvider>
                  ))}
                </Slider>
              </>
            ) : (
              <div>No data available</div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

const Product = ({ item: { id, name, slug, images } }: { item: IProduct }) => {
  return (
    <div
      aria-label={`Product Item:${name}`}
      className='group cursor-pointer lg:min-w-[16.666667%] md:min-w-[25%] sm:min-w-[33.333333%] min-w-[50%]'>
      <NextLinkContainer href={`/products/${id}`}>
        <Product.sale />
        <Product.Image images={images} />
        <div className='px-2 flex flex-col justify-center'>
          <div className='flex justify-between'>
            {/* <Product.DetailButton id={id} slug={slug} /> */}
          </div>
          <Product.Brand />
          <Product.Name name={name} />
          <Product.Price />
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
        w-full h-auto overflow-y-hidden
        ease-in-out duration-300 scale-90 hover:scale-95'>
      <Image
        src={
          images?.[0] ??
          'https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fvariants%2FlogostuImage.png?alt=media&token=90709f04-0996-4779-ab80-f82e99c62041'
        }
        alt='Product image'
        // fill
        width={200}
        height={200}
        loading='lazy'
        placeholder='blur'
        blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNMz4irBwAEGQGuUtJ+VQAAAABJRU5ErkJggg=='
        className='w-full  aspect-square rounded-md max-w-[200px] mx-auto object-contain'
      />
      <Product.FavoriteButton />
    </div>
  )
}
Product.Brand = function Brand() {
  const { product } = useProductCardContext()
  return (
    <p className='text-base  font-roboto font-semibold uppercase leading-normal text-zinc-600 line-clamp-1 pt-2'>
      ASUS
    </p>
  )
}
Product.Name = function Name({ name }: { name: IProduct['name'] }) {
  return (
    <p className='text-sm leading-normal text-zinc-500 line-clamp-1 uppercase font-bold '>
      {/* {
                "Laptop ACER Nitro 5 Eagle AN515-57-54MV (i5-11400H/RAM 8GB/RTX 3050/512GB SSD/ Windows 11)"
            } */}
      {name}
    </p>
  )
}

Product.Price = function Price() {
  return (
    <div className='grid my-3'>
      <p className='font-titleFont text-md font-bold text-red-600 '>
        {formatPrice(25_000_000)}
      </p>
      <p className='text-gray-500 text-sm leading-tight line-through decoration-[1px]'>
        {formatPrice(29_000_000)}
      </p>
    </div>
  )
}

Product.Review = function Review() {
  return (
    <div className='flex items-center gap-2 text-yellow mt-2'>
      <div className='flex text-sm gap-1 items-center'>
        <BsStarFill />
        <BsStarFill />
        <BsStarFill />
        <BsStarFill />
        <BsStarFill />
        <p className=' text-black'>25</p>
      </div>
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
      <button className='w-24 h-9 bg-white border-[1px] border-secondaryBlue text-blue-600 font-semibold text-sm rounded-full flex items-center justify-center gap-1 hover:bg-primaryBlue hover:text-white duration-150'>
        <span>
          <Plus />
        </span>
        Chi tiết
      </button>
    </Link>
  )
}

Product.FavoriteButton = FavoriteButtonWithCardProvider

export default ProductList
