'use client'

import { Rating } from '@smastrom/react-rating'
import { CarrotIcon, Heart, Info } from 'lucide-react'
import { PropsWithChildren, createContext, useContext } from 'react'
import { IProduct, IVariant, ResourceName } from 'types'
import { API } from 'types/constants'
import { useCustom } from '@refinedev/core'
import { cleanUrl, formatPrice } from '@/lib/utils'
import { useOptionStore } from './ProductOptions'
import useCart, {
    ALLOW_QUANTITY,
    useCartItems,
} from '@components/store/cart/useCart'
import { cn } from 'components/lib/utils'
import useNotification from '@/hooks/useNotification'
import { Skeleton } from '@components/ui/Skeleton'
import Image from 'next/image'

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

    return (
        <ProductContext.Provider
            value={{ product, variants: { data: data?.data, status } }}
        >
            {children}
        </ProductContext.Provider>
    )
}

export const ProductImages = () => {
    const {
        product: { images },
    } = useProductContext()
    return (
        <div className="flex">
            <div className="w-1/5 flex flex-col space-y-2 overflow-auto items-center">
                {images?.map((item, idx, arr) => (
                    <div key={`${idx}-${item.url}`} className="p-2 w-1/2 hover:border ">
                        <Image
                            src={item.url ?? ""}
                            width={"200"}
                            height={"200"}
                            alt="product image"
                            className="cursor-move duration-500"
                        />
                    </div>
                ))}
            </div>
            <div className="w-4/5">
                <Image
                    src={images?.[0]?.url ?? ""}
                    width={"200"}
                    height={"200"}
                    alt="product image"
                    className="w-[80%] transform-origin-top-left cursor-move duration-500"
                />
            </div>
        </div>
    )
}

export const ProductPrice = () => {
    const {
        variants: { data: variants, status },
    } = useProductContext()
    const isDiscount = false

    if (status === 'loading') {
        return <Skeleton className="w-full h-6" />
    }
    if (!variants?.length) {
        return <>Không tìm thấy dữ liệu</>
    }
    const min = variants.sort((a, b) => a.price - b.price)[0]

    return (
        <>
            {isDiscount && (
                <div className="flex items-end gap-2 my-2">
                    <p className="text-3xl text-green-700 font-bold leading-none">
                        Now ${formatPrice(min?.price)}
                    </p>
                    <p className="text-gray-500 text-md font-normal line-through decoration-[1px] flex gap-1 items-center">
                        ${formatPrice(min?.price)}{' '}
                        <span>
                            <Info />
                        </span>
                    </p>
                </div>
            )}
            {!isDiscount && (
                <div className="my-2">
                    <p className="text-3xl text-zinc-950 font-bold leading-none">
                        ${formatPrice(min?.price)}
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
        <div className="flex gap-1 text-sm items-center text-zinc-950 mt-2">
            <div className="rating gap-1">
                <Rating
                    style={{ maxWidth: 180 }}
                    value={avgRating ?? 0}
                    readOnly
                    className="h-5"
                />
            </div>
            <p className="">({avgRating})</p>
            <p className="underline leading-none text-sm">{reviewCount} nhận xét</p>
        </div>
    )
}

export const ProductCartButton = () => {
    const {
        variants: { data: variants, status },
    } = useProductContext()
    const [groups, selected, variantRecords] = useOptionStore((state) => [
        state.groups,
        state.selected,
        state.variantRecords
    ])
    const { addItem, updateItem } = useCart()
    const cartItems = useCartItems()
    const { open: show } = useNotification()
    const groupLength = Object.keys(groups).length
    const selectedLength = Object.keys(selected).length
    const isAddable = groupLength === selectedLength
    const addToCartHandler = () => {
        if (!variants) {
            show({
                type: 'warning',
                title: 'Đang chờ tải các tuỳ chọn sản phẩm',
                colorScheme: 'orange',
                position: 'top',
            })
            return
        }
        if (groupLength !== selectedLength) {
            show({
                type: 'warning',
                title: 'Bạn chưa chọn các tuỳ chọn',
                colorScheme: 'teal',
                position: 'top',
            })
            return
        }
        const variant = variants.find(({ id }) =>
            Object.entries(selected).every(([name, value]) => variantRecords[id]?.[name]?.value === value)
        )
        if (variant) {
            const item = cartItems[variant.id]
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
            description: (
                <>
                    <p>{JSON.stringify(selected)}</p>
                </>
            ),
        })
    }

    return (
        <div className="border-b-[1px] border-b-zinc-300 pb-4 my-2">
            <button
                onClick={addToCartHandler}
                disabled={!isAddable}
                className={cn(
                    `
                mx-auto w-32 h-10 flex items-center justify-center gap-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-md text-zinc-50 rounded-full duration-300
                `,
                    'disabled:cursor-not-allowed disabled:bg-blue-400',
                )}
            >
                <span>Thêm</span>{' '}
                <span>
                    <CarrotIcon />
                </span>
            </button>
        </div>
    )
}

export const ProductFrequentBoughtTogether = () => {
    return (
        <div className="">
            <p className="">Sản phẩm thường được mua cùng</p>
        </div>
    )
}

export const ProductViewRecently = () => {
    return (
        <div className="">
            <p className="text-2xl font-bold mt-4">Sản phẩm đã xem gần đây</p>
            <div className=""></div>
        </div>
    )
}

export const ProductFavoriteDetails = () => {
    const {
        product: { id },
    } = useProductContext()
    const { data, status } = useCustom({
        url: API['products']().countProductSold(id ?? ''),
        method: 'get',
        queryOptions: {
            enabled: !!id,
        },
    })
    const displayText = data?.data
        ? `${data.data}+ khách hàng đã mua sản phẩm`
        : 'Khách hàng đầu tiên sở hữu ngay sản phẩm'
    return (
        <>
            <div className="flex justify-between gap-2 relative border-b mt-2">
                <p className="py-2 text-blue-700 text-sm font-semibold line-clamp-1">{displayText}</p>
                <p className='text-gray-600 text-2xl text-center '>
                    <Heart className="" />
                </p>
            </div>
        </>
    )
}

export default ProductContextProvider
export { useProductContext }
