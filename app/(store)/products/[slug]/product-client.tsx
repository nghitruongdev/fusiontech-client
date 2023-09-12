/** @format */

'use client'

import { Rating } from '@smastrom/react-rating'
import { ShoppingCart } from 'lucide-react'
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
  use,
  useMemo,
  Suspense,
} from 'react'
import { IProduct, IVariant } from 'types'
import { API } from 'types/constants'
import { useCustom, useOne } from '@refinedev/core'
import { cleanUrl, formatPrice } from '@/lib/utils'
import { useOptionStore } from './product-options'
import useCart, {
  ALLOW_QUANTITY,
  useCartStore,
} from '@components/store/cart/useCart'
import { cn } from 'components/lib/utils'
import useNotification from '@/hooks/useNotification'
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
import { notFound, redirect } from 'next/navigation'
import ProductCard from '@components/store/front/product/ProductCard'
import { suspensePromiseWithCleanup } from '../../../../src/lib/promise'
import ProductListLoading from '@components/store/front/product/ProductListLoading'
import { useVisibleObserver } from '@/hooks/useVisibleObserver'
import Loading from 'app/loading'

const {
  findTopFrequentBoughtTogether,
  projection: { dynamic },
  resource,
} = API['products']()
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

  const [[suspense, cleanup], setSuspense] = useState<
    ReturnType<typeof suspensePromiseWithCleanup>
  >(suspensePromiseWithCleanup(false))
  const { data: { data: dynamicProduct } = {}, status } = useOne<IProduct>({
    resource,
    id: product.id,
    meta: {
      query: {
        projection: dynamic,
      },
    },
  })
  const { _links } = product
  const {
    resource: variantResource,
    projection: { withSpecs: projection },
  } = API['variants']()
  const { data, status: variantStatus } = useCustom<IVariant[]>({
    url: `${cleanUrl(_links?.variants.href ?? '')}`,
    meta: {
      resource: variantResource,
    },
    config: {
      query: { projection },
    },

    method: 'get',
    queryOptions: {
      enabled: !!_links,
      retry: false,
    },
  })

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'error') redirect(`/`)
    if (status === 'success') {
      if (!dynamicProduct?.active) notFound()
      setSuspense(suspensePromiseWithCleanup(true))
    }
  }, [status, dynamicProduct])

  useEffect(() => {
    return () => {
      cleanup?.()
    }
  }, [cleanup])
  const dynamicInfo = useMemo(() => {
    if (!dynamicProduct) return {}
    return Object.entries(dynamicProduct).reduce((acc, [key, value]) => {
      if (!!value) acc[key] = value
      return acc
    }, {} as Record<string, any>)
  }, [dynamicProduct])
  const addItems = useRecentProductViewStore((state) => state.addProduct)
  useEffect(() => {
    addItems(product)
  }, [addItems, product])
  return (
    <ProductContext.Provider
      value={{
        product: {
          ...product,
          ...dynamicInfo,
        },
        variants: { data: data?.data, status: variantStatus },
      }}>
      <Suspense fallback={<Loading />}>
        <SuspenseProduct suspense={suspense} />
        {children}
      </Suspense>
    </ProductContext.Provider>
  )
}

const SuspenseProduct = ({ suspense }: { suspense: Promise<unknown> }) => {
  use(suspense)
  return <></>
}
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
      <div className='h-[90%]  bg-white row-span-1 flex items-center justify-center border shadow rounded-lg'>
        <div className=' p-10 flex items-center'>
          <Image
            src={images?.[selectedImageIndex] ?? ''}
            width={500}
            height={500}
            alt='product image'
            className=' w-auto object-center cursor-move duration-500 '
          />
        </div>
      </div>
      <div className='h-[10%] flex flex-row items-center '>
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
export const ProductPrice = function ProductPrice() {
  const {
    product: { minPrice = 0, maxPrice = 0, discount = 0 },
  } = useProductContext()

  const { getSelectedVariant, selected } = useOptionStore()

  const [variant] = getSelectedVariant()

  const discountPrice = (price: number | undefined) =>
    ((100 - discount) / 100) * (price ?? 0)

  if (!!variant)
    return (
      <>
        <div className=' my-2'>
          <div className='flex flex-row mb-2'>
            <p className='text-2xl text-red-600 font-bold leading-none mr-2'>
              {formatPrice(discountPrice(variant.price))}
            </p>
          </div>
          {!!discount && (
            <p className='text-zinc-700 text-md font-normal line-through decoration-[1px] flex gap-1 items-center mr-2'>
              {formatPrice(variant.price)}
            </p>
          )}
        </div>
      </>
    )
  return (
    <>
      {!!discount && (
        <div className=' my-2'>
          <div className='flex flex-row mb-2'>
            <p className='text-2xl text-zinc-600 font-bold leading-none mr-2'>
              {formatPrice(discountPrice(minPrice))}
              {minPrice !== maxPrice && (
                <>
                  <span> - </span>
                  <span>{formatPrice(discountPrice(maxPrice))}</span>
                </>
              )}
            </p>
          </div>
        </div>
      )}
      {!discount && (
        <div className='my-2'>
          <p className='text-2xl text-zinc-600 font-bold leading-none'>
            <span>{formatPrice(minPrice)}</span>
            {!!maxPrice && maxPrice !== minPrice && (
              <>
                <span> - </span>
                <span>{formatPrice(maxPrice)}</span>
              </>
            )}
          </p>
        </div>
      )}
    </>
  )
}

export const Discount = function ProductDiscount() {
  const {
    product: { discount },
  } = useProductContext()
  if (!discount) return <></>
  return (
    <>
      <div className='relative mb-4'>
        <div
          className=' text-xs top-0 left-[-3px] m-0  text-black font-bold px-2 py-1 '
          style={{
            zIndex: 2,
          }}>
          {discount}% SALE
        </div>

        {/* <div className='relative top-[21.5px] left-[-2.2px] w-0 h-0 border-t-[5px] border-l-[5px] border-[#b02d2d] transform rotate-45 '></div> */}
      </div>
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
      if (!item) {
        if (!variant.availableQuantity) {
          show({
            type: 'warning',
            title: 'Xin lỗi quý khách! Sản phẩm đã hết hàng.',
          })
          return
        }
        addItem({ variantId: variant.id, quantity: 1 })
      }
      if (item) {
        if (
          !variant.availableQuantity ||
          item.quantity >= variant.availableQuantity
        ) {
          show({
            type: 'warning',
            title: 'Sản phẩm trong giỏ hàng vượt quá số lượng tồn kho',
            message: !variant.availableQuantity
              ? 'Số lượng không khả dụng'
              : `Số lượng tồn kho sản phẩm là ${variant.availableQuantity}`,
          })
          return
        }
        if (item.quantity >= ALLOW_QUANTITY) {
          show({
            type: 'warning',
            title: `Chỉ được thêm tối đa ${ALLOW_QUANTITY} sản phẩm vào giỏ hàng`,
          })
          return
        }
        updateItem({ ...item, quantity: (item?.quantity ?? 0) + 1 })
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
          `mx-auto w-32 h-10 flex items-center justify-center gap-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-md text-zinc-50 rounded-full duration-300`,
          'disabled:cursor-not-allowed disabled:bg-blue-400',
        )}>
        <span>Thêm</span>{' '}
        <span>
          <ShoppingCart />
        </span>
      </button>
    </div>
  )
}

export const ProductQuantity = () => {
  const {
    product: { id },
  } = useProductContext()
  const { getAvailableQuantity } = API['products']()
  const { getSelectedVariant, selected } = useOptionStore()
  const { data: { data } = {} } = useCustom({
    url: getAvailableQuantity(id),
    method: 'get',
    queryOptions: {
      enabled: !!id,
    },
  })

  const [variant] = getSelectedVariant()
  const quantity = variant?.availableQuantity ?? data
  if (!quantity) return <></>
  return (
    <p className='text-sm font-medium text-gray-500'>
      Số lượng khả dụng: {quantity + ''}
    </p>
  )
}

export const ProductFrequentBoughtTogether = () => {
  const {
    product: { id },
  } = useProductContext()
  const { isVisible, ref } = useVisibleObserver<HTMLDivElement>()
  const { data: { data: products } = {}, status } = useCustom<IProduct[]>({
    url: findTopFrequentBoughtTogether(id, 10),
    method: 'get',
    queryOptions: {
      enabled: !!id && isVisible,
      retry: false,
    },
    meta: {
      resource,
    },
    errorNotification: false,
    successNotification: false,
  })

  if (status === 'loading') {
    return (
      <div ref={ref}>
        <ProductListLoading />
      </div>
    )
  }

  if (!products || !products?.length) return <></>

  return (
    <div>
      <p className='text-2xl font-semibold my-4'>
        Sản phẩm thường được mua cùng
      </p>
      <div
        className='flex flex-overflow-x-auto gap-4'
        ref={ref}>
        {products.map((product) => (
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
        <>
          <FavoriteButton
            product={product}
            hideNotActive={false}
          />
        </>
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
