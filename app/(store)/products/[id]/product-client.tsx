/** @format */

'use client'

import { Rating } from '@smastrom/react-rating'
import { CarrotIcon } from 'lucide-react'
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { IProduct, IVariant } from 'types'
import { API } from 'types/constants'
import { useCustom } from '@refinedev/core'
import { cleanUrl, formatPrice } from '@/lib/utils'
import { useOptionStore } from './product-options'
import useCart, {
  ALLOW_QUANTITY,
  useCartStore,
} from '@components/store/cart/useCart'
import { cn } from 'components/lib/utils'
import useNotification from '@/hooks/useNotification'
import { Skeleton } from '@components/ui/Skeleton'
import Image from 'next/image'
import {
  Table,
  TableContainer,
  Tbody,
  Tr,
  Td,
  Collapse,
  Button,
} from '@chakra-ui/react'
import { useRecentProductViewStore } from '@components/providers/RecentProductViewProvider'
import { useIsFirstRender } from 'usehooks-ts'
import { FavoriteButton } from '@components/store/front/product/FavoriteButton'
import Link from 'next/link'

const { findTopFrequentBoughtTogether } = API['products']()
type ContextState = {
  product: IProduct
  variants: {
    data: IVariant[] | undefined
    status: 'loading' | 'success' | 'error'
  }
}

const ProductContext = createContext<ContextState | null>(null)
const useProductContext = () => {
  const ctx = useContext(ProductContext)
  if (!ctx) throw new Error('ProductContext is missing')
  return ctx
}

const ProductContextProvider = ({
  product,
  children,
}: PropsWithChildren<Partial<ContextState>>) => {
  if (!product) {
    throw new Error('Product is missing in the context')
  }
  const { _links } = product
  const {
    resource,
    projection: { withSpecs: projection },
  } = API['variants']()
  const { data, status } = useCustom<IVariant[]>({
    url: `${cleanUrl(_links?.variants.href ?? '')}`,
    meta: {
      resource,
    },
    config: {
      query: { projection },
    },

    method: 'get',
    queryOptions: {
      enabled: !!_links,
    },
  })

  const addItems = useRecentProductViewStore((state) => state.addProduct)
  useEffect(() => {
    addItems(product)
  }, [addItems, product])
  return (
    <ProductContext.Provider
      value={{ product, variants: { data: data?.data, status } }}>
      {children}
    </ProductContext.Provider>
  )
}

// export const ProductImages = () => {
//   const {
//     product: { images },
//   } = useProductContext()
//   return (
//     <div className='flex border shadow rounded-lg gap-5 '>
//       <div className='w-1/5 flex flex-col space-y-2 space-x-2 border-r-2 overflow-auto items-center bg-white '>
//         {images?.map((item, idx, arr) => (
//           <div
//             key={`${idx}-${item}`}
//             className='p-2 w-1/2 hover:border '>
//             <Image
//               src={item}
//               width={'200'}
//               height={'200'}
//               alt='product image'
//               className='cursor-move duration-500'
//               priority
//             />
//           </div>
//         ))}
//       </div>
//       <div className='w-3/5 bg-white  flex items-center justify-center'>
//         <Image
//           src={images?.[0] ?? ''}
//           width={'200'}
//           height={'200'}
//           alt='product image'
//           className='w-[80%] transform-origin-top-left cursor-move duration-500 '
//         />
//       </div>
//     </div>
//   )
// }
export const ProductImages = () => {
  const {
    product: { images },
  } = useProductContext()

  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index)
  }

  return (
    <div className='grid grid-rows-1 gap-4 mb-10'>
      <div className='row-span-1 bg-white flex items-center justify-center border shadow rounded-lg'>
        <div className='h-[400px] p-10 flex items-center'>
          <Image
            src={images?.[selectedImageIndex] ?? ''}
            width={500}
            height={500}
            alt='product image'
            className='max-h-[350px] object-cover cursor-move duration-500 '
          />
        </div>
      </div>
      <div className='flex flex-row items-center '>
        {images?.map((item, idx) => (
          <div
            key={`${idx}-${item}`}
            className='h-[50px ] p-2 mr-4  ease-in-out duration-300 scale-97 hover:scale-95 border  cursor-pointer  shadow rounded-lg  '
            onClick={() => handleImageClick(idx)}>
            <Image
              src={item}
              width={80}
              height={80}
              alt='product image'
              className='h-[50px] object-cover cursor-move duration-500 rounded-lg'
              priority
            />
          </div>
        ))}
      </div>
    </div>
  )
}
export const ProductPrice = () => {
  const {
    variants: { data: variants, status },
    product: { minPrice, maxPrice },
  } = useProductContext()
  const isDiscount = false

  if (status === 'loading') {
    return <Skeleton className='w-full h-10' />
  }
  if (!variants?.length) {
    return <>Không có dữ liệu</>
  }

  return (
    <>
      {isDiscount && (
        <div className='flex items-end gap-2 my-2'>
          <p className='text-3xl text-green-700 font-bold leading-none'>
            {formatPrice(minPrice)}
          </p>
          <p className='text-gray-500 text-md font-normal line-through decoration-[1px] flex gap-1 items-center'>
            {formatPrice(minPrice)}
            {/* <span> */}
            {/* <Info /> */}
            {/* </span> */}
          </p>
        </div>
      )}
      {!isDiscount && (
        <div className='my-2'>
          <p className='text-2xl text-zinc-600 font-bold leading-none'>
            <span>{formatPrice(minPrice)}</span>
            <span> - </span>
            <span>{formatPrice(maxPrice)}</span>
          </p>
        </div>
      )}
    </>
  )
}

export const ProductRating = () => {
  const {
    product: { avgRating, reviewCount },
  } = useProductContext()
  return (
    <div className='flex gap-1 text-sm items-center text-zinc-950 mt-2'>
      <div className='rating gap-1'>
        <Rating
          style={{ maxWidth: 180 }}
          value={avgRating ?? 0}
          readOnly
          className='h-5'
        />
      </div>
      <p className=''>({avgRating})</p>
      <Link
        className='underline leading-none text-sm'
        href={'#review-section'}>
        {reviewCount} nhận xét
      </Link>
    </div>
  )
}

export const ProductCartButton = () => {
  const {
    variants: { data: variants, status },
  } = useProductContext()
  const { addItem, updateItem } = useCart()
  const cartItems = useCartStore((state) => state.items)
  const { open: show } = useNotification()
  const [selected, getSelectedVariant] = useOptionStore((state) => [
    state.selected,
    state.getSelectedVariant,
  ])
  const [variant, isAddable] = getSelectedVariant()
  const addToCartHandler = () => {
    if (variant) {
      const item = cartItems[variant.id]
      console.log('cartItems[variant.id]', cartItems[variant.id])
      if (item) {
        if (item?.quantity === ALLOW_QUANTITY) {
          show({
            type: 'warning',
            title: `Chỉ được thêm tối đa 10 sản phẩm vào giỏ hàng`,
          })
          return
        }
        updateItem({ ...item, quantity: (item?.quantity ?? 0) + 1 })
      } else {
        addItem({ variantId: variant.id, quantity: 1 })
      }

      show({
        type: 'success',
        title: `Thêm sản phẩm với phiên bản ${variant.id} vào giỏ hàng`,
      })

      return
    }
    show({
      type: 'error',
      title: `Không tìm thấy phiên bản sản phẩm tương ứng`,
      description: <>{/* <p>{JSON.stringify(selected)}</p> */}</>,
    })
  }

  return (
    <div className='border-b-[1px] border-b-zinc-300 pb-4 my-2'>
      <button
        onClick={addToCartHandler}
        disabled={!isAddable}
        className={cn(
          `
                mx-auto w-32 h-10 flex items-center justify-center gap-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-md text-zinc-50 rounded-full duration-300
                `,
          'disabled:cursor-not-allowed disabled:bg-blue-400',
        )}>
        <span>Thêm</span>{' '}
        <span>
          <CarrotIcon />
        </span>
      </button>
    </div>
  )
}

export const ProductFrequentBoughtTogether = () => {
  const firstRender = useIsFirstRender()
  const {
    product: { id },
  } = useProductContext()
  const { data: { data: products } = {}, status } = useCustom<IProduct[]>({
    url: findTopFrequentBoughtTogether(id, 10),
    method: 'get',
    queryOptions: {
      enabled: !!id && firstRender,
      suspense: true,
    },
  })

  console.log('top', products)

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!Array.isArray(products)) {
    return <div>No frequent bought together products found.</div>
  }

  return (
    <div>
      {products.length === 0 ? (
        <div>No frequent bought together products found.</div>
      ) : (
        <div>
          <p>Sản phẩm thường được mua cùng</p>
          <ul>
            {products.map((product) => (
              <li key={product.id}>
                <h3>{product.name}</h3>
                <p>{product.summary}</p>
                {/* Render other product information as needed */}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export const ProductFavoriteDetails = () => {
  const { product } = useProductContext()
  const { data, status } = useCustom({
    url: API['products']().countProductSold(product.id ?? ''),
    method: 'get',
    queryOptions: {
      enabled: !!product.id,
    },
  })
  const displayText = data?.data
    ? `${data.data}+ khách hàng đã mua sản phẩm`
    : 'Trở thành khách hàng sở hữu sản phẩm đầu tiên'
  return (
    <>
      <div className='flex justify-between gap-2 relative border-b mt-2'>
        <p className='py-2 text-blue-700 text-sm font-semibold line-clamp-1'>
          {displayText}
        </p>
        <p className=''>
          <FavoriteButton
            product={product}
            hideNotActive={false}
          />
        </p>
      </div>
    </>
  )
}

export const ProductSpecification = () => {
  const {
    product: { specifications },
  } = useProductContext()
  const [show, setShow] = useState(false)
  const handleToggle = () => setShow(!show)
  if (!specifications?.length) return <></>
  const renderTable = () => (
    <TableContainer roundedBottom={'md'}>
      <Table
        variant='striped'
        roundedBottom={'md'}>
        <Tbody>
          {specifications?.map(({ name, values }) => (
            <Tr key={name}>
              <Td className='font-semibold text-sm'>{name}</Td>
              <Td className='text-sm font-normal'>
                {values.map(({ value }) => value).join('/ ')}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
  return (
    <div className='mx-4'>
      <p className='font-bold text-xl mb-2'>Thông số kỹ thuật</p>
      <div className='border shadow-lg rounded-b-md'>
        {specifications.length <= 6 && renderTable()}
        {specifications.length > 6 && (
          <>
            <Collapse
              animate
              startingHeight={300}
              animateOpacity
              in={show}>
              {renderTable()}
            </Collapse>
            <div className='flex justify-center pt-6 pb-2 bg-gradient-to-b from-white to-slate-100'>
              <Button
                onClick={handleToggle}
                variant={'link'}
                fontSize={'sm'}
                color='gray.500'>
                Xem thêm
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ProductContextProvider
export { useProductContext }
