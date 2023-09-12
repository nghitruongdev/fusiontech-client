/** @format */

'use client'

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { HiMinusSm } from 'react-icons/hi'
import { MdOutlineAdd } from 'react-icons/md'
import { TbReload } from 'react-icons/tb'
import { ICartItem, IProduct, IVariant } from 'types'
import Image from 'next/image'
import { useSelectedCartItemStore } from './useSelectedItemStore'
import { useDebounce } from 'usehooks-ts'
import useCart, { ALLOW_QUANTITY } from './useCart'
import { formatPrice } from '../../../lib/utils'
import { API, Images } from 'types/constants'
import { TooltipCondition } from '@components/ui/TooltipCondition'
import SelectPopout from '@components/ui/SelectPopout'
import { useForm } from 'react-hook-form'
import { Avatar, Box, Text, useBoolean } from '@chakra-ui/react'
import { Option } from 'types'
import { useCustom } from '@refinedev/core'
import { ISpecification } from '../../../../types/index'
import { getDiscount, getTotalAmount } from './utils'
import LoadingOverlay from '@components/ui/LoadingOverlay'
import useDebounceFn from '@/hooks/useDebounceFn'
import { produce } from 'immer'
const CartItem = ({ item }: { item: ICartItem }) => {
  return (
    <>
      <div className='w-full flex p-2 gap-2 border-t-[1px] border-zinc-200'>
        <CartItem.Provider item={item}>
          <CartItem.SelectedCheckbox />
          <CartItem.ProductInfo />
        </CartItem.Provider>
      </div>
    </>
  )
}
// Khai báo context để lưu trạng thái mục và tình trạng hết hàng
const ItemContext = createContext<{
  item: ICartItem
  isOutOfStock: boolean
} | null>(null)

// Hook để sử dụng context ItemContext
const useItemContextProvider = () => {
  const ctx = useContext(ItemContext)
  if (!ctx) throw new Error('ItemContext is missing')
  return ctx
}
CartItem.Provider = function Provider({
  children,
  item,
}: {
  children: ReactNode
  item: ICartItem
}) {
  // Kiểm tra xem sản phẩm có hết hàng không
  const isOutOfStock = !!!item.variant?.availableQuantity
  return (
    <ItemContext.Provider
      value={{
        item,
        isOutOfStock,
      }}>
      {children}
    </ItemContext.Provider>
  )
}

// Component hiển thị checkbox chọn mục
CartItem.SelectedCheckbox = function Checkbox() {
  const [selectedItems, add, remove] = useSelectedCartItemStore((state) => [
    state.items,
    state.addSelectedItem,
    state.removeSelectedItem,
  ])
  const { item } = useItemContextProvider()
  const isSelected = selectedItems.some(
    (selected) => selected.variantId === item?.variantId,
  )
  const changeHandler = () => {
    if (item === null) return
    if (isSelected) {
      remove(item)
    } else {
      add(item)
    }
  }
  return (
    <input
      title='select-product'
      type='checkbox'
      checked={isSelected}
      onChange={changeHandler}
    />
  )
}

// Component hiển thị thông tin sản phẩm
CartItem.ProductInfo = function ProductInfo() {
  const {
    item: { variant },
    isOutOfStock,
  } = useItemContextProvider()
  const product = variant?.product
  console.log('product', product)
  const { control } = useForm() // Sử dụng hook useForm để quản lý form
  return (
    <div className='flex flex-grow justify-between gap-2'>
      <div className='w-3/4 flex items-center gap-4'>
        <Image
          className='w-32'
          width={500}
          height={500}
          alt={product?.name ?? 'Hình ảnh sản phẩm'}
          src={variant?.images?.[0] ?? product?.images?.[0] ?? Images.products}
        />
        <div className='mx-4 grid gap-2'>
          <h2
            className={`text-base ${
              isOutOfStock ? 'text-red-500' : 'text-zinc-700'
            }`}>
            {variant?.product?.name ?? 'Sản phẩm'}
          </h2>
          <p className='text-sm text-zinc-500'>Mã SKU: {variant?.sku ?? ''}</p>
          <CartItem.AvailableQuantity />
          <p className='text-sm text-zinc-500'>
            Giá: {formatPrice(variant?.price)}
          </p>
          <p className='text-sm text-zinc-500 flex items-center gap-1'>
            <span className='bg-primaryBlue rounded-full text-white text-xs w-4 h-4 flex items-center justify-center'>
              <TbReload className='rotate-180' />
            </span>
            30 ngày đổi trả miễn phí
          </p>
          {!!product?.variantCount && product.variantCount > 1 && (
            <CartItem.VariantSelect />
          )}
        </div>
      </div>
      <div className='w-1/4 text-right flex flex-col items-end gap-1 justify-center'>
        <CartItem.ProductInfoPrice />
      </div>
    </div>
  )
}

// Component hiển thị số lượng tồn kho
CartItem.AvailableQuantity = function AvailableQuantity() {
  const { item, isOutOfStock } = useItemContextProvider()
  const { availableQuantity } = item?.variant ?? {}
  if (isOutOfStock)
    return <p className='text-sm text-red-500'>Sản phẩm hết hàng</p>
  return (
    <p className='text-sm text-zinc-500'>
      Số lượng tồn kho: {availableQuantity}
    </p>
  )
}

// Component hiển thị giá sản phẩm và thông tin giảm giá
CartItem.ProductInfoPrice = function ProductPrice() {
  const { item } = useItemContextProvider()
  const { price } = item?.variant ?? {} // Giá của sản phẩm
  const { discount } = item?.variant?.product ?? {} // Giảm giá của sản phẩm
  const original = getTotalAmount([item]) // Tổng giá trị ban đầu
  const discountTotal = getDiscount([item]) // Tổng giá trị giảm giá
  return (
    <>
      <p className='font-semibold text-xl text-green-500 mt-2'>
        {formatPrice(original - discountTotal)}
        {/* Hiển thị giá sau giảm giá */}
      </p>
      {!!true && (
        <>
          <p className='text-sm line-through text-zinc-500'>
            {formatPrice(original)}
            {/* Hiển thị giá gốc */}
          </p>
          <div className='flex items-center text-xs gap-2'>
            <p className='bg-green-200 text-[8px] uppercase px-2 py-[1px]'>
              Tiết kiệm | {`-${discount}%`}
              {/* Hiển thị thông tin tiết kiệm */}
            </p>
            <p className='text-[#2a8703] font-semibold'>
              {formatPrice(discountTotal)}
              {/* Hiển thị giá trị tiết kiệm */}
            </p>
          </div>
        </>
      )}
      <div className='mt-2 flex items-center gap-6'>
        <CartItem.CartButtonGroup />
      </div>
    </>
  )
}

// Component chứa nút để điều chỉnh số lượng sản phẩm trong giỏ hàng
CartItem.CartButtonGroup = function ButtonGroup() {
  const { item } = useItemContextProvider()
  const { removeItem, updateItem } = useCart() // Sử dụng custom hook useCart để xoá và cập nhật sản phẩm
  const [quantity, setQuantity] = useState<number>(item.quantity) // Số lượng sản phẩm
  const availableQuantity = item.variant?.availableQuantity // Số lượng tồn kho
  const limit =
    availableQuantity && availableQuantity < ALLOW_QUANTITY
      ? availableQuantity
      : ALLOW_QUANTITY // Số lượng tối đa cho phép
  const isAddOk = quantity < limit // Kiểm tra xem có thể thêm sản phẩm không
  const isMinusOk = quantity > 1 // Kiểm tra xem có thể giảm sản phẩm không

  const removeItemHandler = () => {
    if (!!!item?.id) {
      console.error('ID item not found')
      return
    }
    const result = confirm('Xoá sản phẩm khỏi giỏ hàng?')
    if (result) {
      removeItem(item.id)
    }
  }

  const updateCartItem = async (quantity: number) => {
    await new Promise((res) => {
      setTimeout(() => {
        console.log('item inside timeout', quantity)
        res(updateItem.bind(null, { ...item, quantity })())
      }, 300) // Đợi 300ms trước khi cập nhật sản phẩm
    })
  }

  // Thiết lập việc cập nhật số lượng sản phẩm sau một khoảng thời gian sử dụng custom hook useDebounceFn
  const [updateDebounce, , { isLoading }] = useDebounceFn(updateCartItem, 500)

  // Xử lý khi người dùng thay đổi số lượng sản phẩm bằng cách thêm hoặc giảm
  const updateQuantityHandler = (isPlus: boolean) => {
    if (isPlus) {
      setQuantity((prev) => {
        const quantity = prev + 1
        return quantity
      })
      updateDebounce(quantity + 1)
    } else {
      if (quantity <= 1) {
        removeItemHandler()
        return
      }
      setQuantity((prev) => {
        const quantity = prev - 1
        return quantity
      })

      updateDebounce(quantity - 1)
    }
  }

  // Sử dụng useEffect để cập nhật số lượng sản phẩm khi trạng thái item thay đổi
  useEffect(() => {
    setQuantity((prev) => (item.quantity !== prev ? item.quantity : prev))
  }, [item])

  // Lấy thông tin số lượng tồn kho từ biến item
  const { variant: { availableQuantity: availQty } = {} } = item

  // Hiển thị nút và thông báo khi sản phẩm đã hết hàng hoặc số lượng tồn kho là 0
  if (!availQty || availQty <= 0)
    return (
      <>
        <button
          onClick={removeItemHandler}
          className='text-sm underline underline-offset-2 decoration-[1px] text-zinc-600 hover:no-underline hover:text-primaryBlue duration-300'>
          Xoá
        </button>
        <p className='text-red-500 text-normal font-semibold'>Hết hàng</p>
      </>
    )
  // Hiển thị nút để xoá sản phẩm khỏi giỏ hàng và điều chỉnh số lượng
  return (
    <>
      {isLoading && <LoadingOverlay />}
      <button
        onClick={removeItemHandler}
        className='text-sm underline underline-offset-2 decoration-[1px] text-zinc-600 hover:no-underline hover:text-primaryBlue duration-300'>
        Xoá
      </button>

      <div className='w-28 h-9 border border-zinc-400 rounded-full text-base font-semibold text-black flex items-center justify-between px-3'>
        <button
          title='button'
          onClick={updateQuantityHandler.bind(this, false)}
          className={`text-base w-5 h-5 text-zinc-600 hover:-bg[#74767c] hover:text-zinc-400 rounded-full flex items-center justify-center cursor-pointer duration-200`}>
          <HiMinusSm />
        </button>

        <span className='select-none'>{quantity}</span>

        <TooltipCondition
          condition={!isAddOk}
          label={
            availableQuantity && availableQuantity < ALLOW_QUANTITY
              ? `Số lượng hàng tồn kho là ${availableQuantity}`
              : `Số lượng đặt tối đa là ${ALLOW_QUANTITY} sản phẩm`
          }>
          <button
            onClick={updateQuantityHandler.bind(this, true)}
            {...(!isAddOk && { disabled: true })}
            className={`text-base w-5 h-5 text-zinc-600 hover:-bg[#74767c] hover:text-zinc-400 rounded-full flex items-center justify-center cursor-pointer duration-200  ${
              !isAddOk && 'opacity-50 cursor-not-allowed cursor-event-none'
            }`}>
            <MdOutlineAdd />
          </button>
        </TooltipCondition>
      </div>
    </>
  )
}

// Định nghĩa kiểu dữ liệu cho option của dropdown phiên bản
type VariantOption = Option<IVariant>

// Component cho việc chọn phiên bản sản phẩm
CartItem.VariantSelect = function VariantSelect() {
  const [shouldFetch, fetchAction] = useBoolean() // Hook để quản lý trạng thái fetching
  const { item } = useItemContextProvider()
  const { product, id: variantId } = item?.variant ?? {}
  const { updateItem } = useCart()

  const { control, setValue } = useForm<{ variant: VariantOption }>()

  const { getSpecificationsByProduct, getVariants } = API['products']()
  // Lấy thông tin các specification của sản phẩm từ API
  const { data: { data: productSpecifications } = {} } = useCustom<
    { name: string; values: ISpecification[] }[]
  >({
    url: `${getSpecificationsByProduct(product?.id ?? '')}`,
    method: 'get',
    queryOptions: {
      enabled: !!product && shouldFetch,
    },
  })

  const {
    resource: variantResource,
    projection: { withSpecs },
  } = API.variants()

  // Lấy thông tin danh sách các phiên bản sản phẩm từ API
  const { data: { data: variants } = {} } = useCustom<IVariant[]>({
    url: getVariants(product?.id),
    method: 'get',
    queryOptions: {
      enabled: !!product && shouldFetch,
    },
    meta: {
      resource: variantResource,
    },
    config: {
      query: {
        projection: withSpecs,
      },
    },
  })

  // Lọc các tên specification có nhiều giá trị khác nhau
  const distinctNames = useMemo(
    () =>
      productSpecifications
        ?.filter((spec) => spec.values.length > 1)
        .map((spec) => spec.name) ?? [],
    [productSpecifications],
  )
  // Tạo danh sách các phiên bản có thể chọn trong dropdown
  const variantOptions = useMemo(() => {
    const array = (variants ?? [])
      .map((v) => {
        const label =
          v.specifications
            ?.filter((spec) => distinctNames.some((name) => name == spec.name))
            .map(({ name, value }) => `${name} ${value}`)
            .join(' - ') ?? ''
        return {
          label,
          value: v,
          __isDisabled__: !v.availableQuantity || v.availableQuantity <= 0,
        }
      })
      .filter((item) => !!item.label && item.value.active)
    return array
      .filter((item) => !item.__isDisabled__)
      .concat(array.filter((item) => item.__isDisabled__))
  }, [distinctNames, variants])

  // Đặt giá trị mặc định cho dropdown khi biến item thay đổi
  useEffect(() => {
    if (!variantOptions) return
    const selected = variantOptions.find((item) => item.value.id === variantId)
    selected && setValue(`variant`, selected)
  }, [setValue, variantOptions, variantId])
  return (
    <>
      <SelectPopout
        controller={{
          name: 'variant',
          control,
        }}
        stateLabel={{
          defaultEmpty: `Chọn sản phẩm`,
        }}
        props={{
          onChange(newValue, meta) {
            const selected = newValue as Option<IVariant>
            const updated = {
              ...item,
              variant: selected.value,
              variantId: selected.value.id,
            }
            updateItem(updated)
            setValue(`variant`, selected)
          },
          options: variantOptions,
          noOptionsMessage: 'Không có phiên bản.',
          formatOptionLabel: ({ label, value, __isDisabled__ }) => {
            return (
              <div className=''>
                <p>{label}</p>
                <div
                  className={`text-sm ${
                    __isDisabled__ ? 'text-gray-300' : 'text-zinc-500, '
                  }`}>
                  <p className=''>Số lượng: {value?.availableQuantity}</p>
                  <p className=''>Giá: {formatPrice(value?.price)}</p>
                </div>
              </div>
            )
          },
          isOptionDisabled(option, value) {
            return (option as Option<IVariant>).__isDisabled__ ?? false
          },

          onOpen: () => {
            !shouldFetch && fetchAction.on()
          },
        }}
      />
    </>
  )
}

export default CartItem
