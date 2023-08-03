import SectionTitle from '@components/ui/SectionTitle'
import { FavoriteButton, ProductCardProvider } from './client'
import { getProductsWithDetails } from '@/providers/server-data-provider/data/products'
import { IProduct } from 'types'
import Image from 'next/image'
import Link from 'next/link'
import NextLinkContainer from '@components/ui/NextLinkContainer'
import { formatPrice } from '@/lib/utils'
import { BsStarFill } from 'react-icons/bs'
import { Plus } from 'lucide-react'
import { Button } from '@components/ui/shadcn/button'
// import { Flex } from "@chakra-ui/react";
// import { useWindowDimensions } from "@/hooks/useWindowDimensions";

const Newest = async () => {
  // const { width } = useWindowDimensions();
  let numProductToShow = 10
  const products = await getProductsWithDetails()
  const displayedProducts = Object.values(products.data).slice(
    0,
    numProductToShow,
  )

  return (
    <>
      <SectionTitle title={'Sản phẩm của FusionTech'} />
      {/* <p>Newest</p> */}
      <div className="flex flex-col">
        <div className="grid grid-cols-5 gap-4 rounded-lg shadow-outline shadow py-4  ">
          {displayedProducts.map((item: IProduct) => (
            // eslint-disable-next-line react/jsx-key
            <div className="rounded-lg border border-gray-300 shadow  ">
              <ProductCardProvider key={item.id} product={item}>
                <Product item={item} />
              </ProductCardProvider>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href={'http://localhost:3000/search?keyword='}>
            <Button className=" mt-5 bg-yellow hover:bg-[#f6b911] text-white text-lg  ">
              Xem tất cả
            </Button>
          </Link>
        </div>
      </div>
    </>
  )
}

const Product = ({ item: { id, name, slug, images } }: { item: IProduct }) => {
  return (
    <div
      aria-label={`Product Item:${name}`}
      className="p-1 group cursor-pointer lg:min-w-[16.666667%] md:min-w-[25%] sm:min-w-[33.333333%] min-w-[50%]"
    >
      <NextLinkContainer href={`/products/${id}`}>
        <Product.Image images={images} />
        <div className="px-2 flex flex-col justify-center">
          <div className="flex justify-between">
            {/* <Product.DetailButton id={id} slug={slug} /> */}
          </div>
          <Product.Brand />
          <Product.Price />
          <Product.Name name={name} />
        </div>
      </NextLinkContainer>

      {/* <Product.Review /> */}
    </div>
  )
}

Product.Image = ({ images }: { images: IProduct['images'] }) => {
  return (
    <div
      className="
          w-full h-auto overflow-y-hidden
          ease-in-out duration-300 scale-90 hover:scale-95  p-4"
    >
      {images?.[0]?.url ?? '' ? (
        <Image
          src={images?.[0]?.url ?? ''}
          alt="Product image"
          // fill
          width={200}
          height={100}
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNMz4irBwAEGQGuUtJ+VQAAAABJRU5ErkJggg=="
          className="w-full  aspect-square rounded-md max-w-[200px] mx-auto object-cover"
        />
      ) : (
        <Image
          alt="/"
          width={200}
          height={100}
          className="w-full  aspect-square rounded-md max-w-[200px] mx-auto object-cover"
          src="https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fvariants%2FlogostuImage.png?alt=media&token=90709f04-0996-4779-ab80-f82e99c62041"
        />
      )}
      <Product.FavoriteButton />
    </div>
  )
}
Product.Brand = () => {
  return (
    <p className="py-2 text-sm font-bold text-muted-foreground leading-tight">
      ASUS
    </p>
  )
}
Product.Name = ({ name }: { name: IProduct['name'] }) => {
  return (
    <p className="text-sm leading-normal text-zinc-700 line-clamp-2">
      {/* {
                  "Laptop ACER Nitro 5 Eagle AN515-57-54MV (i5-11400H/RAM 8GB/RTX 3050/512GB SSD/ Windows 11)"
              } */}
      {name}
    </p>
  )
}

Product.Price = () => {
  return (
    <div className="grid gap-2">
      <p className="font-titleFont text-md font-bold text-sky-800">
        {formatPrice(25_000_000)}
      </p>
      <p className="text-gray-500 text-sm leading-tight line-through decoration-[1px]">
        {formatPrice(29_000_000)}
      </p>
    </div>
  )
}

Product.Review = () => {
  return (
    <div className="flex items-center gap-2 text-yellow mt-2">
      <div className="flex text-sm gap-1 items-center">
        <BsStarFill />
        <BsStarFill />
        <BsStarFill />
        <BsStarFill />
        <BsStarFill />
        <p className=" text-black">25</p>
      </div>
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
      <button className="w-24 h-9 bg-white border-[1px] border-secondaryBlue text-blue-600 font-semibold text-sm rounded-full flex items-center justify-center gap-1 hover:bg-primaryBlue hover:text-white duration-150">
        <span>
          <Plus />
        </span>
        Chi tiết
      </button>
    </Link>
  )
}

Product.FavoriteButton = FavoriteButton

export default Newest
