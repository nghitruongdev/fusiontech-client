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
const ItemContext = createContext<{
  item: ICartItem
  isOutOfStock: boolean
} | null>(null)

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
      type='checkbox'
      checked={isSelected}
      onChange={changeHandler}
    />
  )
}

CartItem.ProductInfo = function ProductInfo() {
  const {
    item: { variant },
    isOutOfStock,
  } = useItemContextProvider()
  const product = variant?.product
  const { control } = useForm()
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
          <p className='text-sm text-zinc-500'>
            Giá: {formatPrice(variant?.price)}
          </p>
          <CartItem.AvailableQuantity />
          <p className='text-sm text-zinc-500 flex items-center gap-1'>
            <span className='bg-primaryBlue rounded-full text-white text-xs w-4 h-4 flex items-center justify-center'>
              <TbReload className='rotate-180' />
            </span>
            30 ngày đổi trả miễn phí
          </p>
          <CartItem.VariantSelect />
        </div>
      </div>
      <div className='w-1/4 text-right flex flex-col items-end gap-1 justify-center'>
        <CartItem.ProductInfoPrice />
      </div>
    </div>
  )
}

CartItem.AvailableQuantity = function AvailableQuantity() {
  const { item, isOutOfStock } = useItemContextProvider()
  const { availableQuantity } = item?.variant ?? {}
  if (isOutOfStock) return <p className='text-sm text-red-500'>Hết hàng</p>
  return (
    <p className='text-sm text-zinc-500'>
      Số lượng tồn kho: {availableQuantity}
    </p>
  )
}

CartItem.ProductInfoPrice = function ProductPrice() {
  const { item } = useItemContextProvider()
  const { price } = item?.variant ?? {}
  const { discount } = item?.variant?.product ?? {}
  //   const original = (price ?? 0) * item.quantity
  const original = getTotalAmount([item])
  const discountTotal = getDiscount([item])
  return (
    <>
      <p className='font-semibold text-xl text-green-500 mt-2'>
        {formatPrice(original - discountTotal)}
      </p>
      {!!true && (
        <>
          <p className='text-sm line-through text-zinc-500'>
            {formatPrice(original)}
          </p>
          <div className='flex items-center text-xs gap-2'>
            <p className='bg-green-200 text-[8px] uppercase px-2 py-[1px]'>
              Tiết kiệm được
            </p>
            <p className='text-[#2a8703] font-semibold'>
              {formatPrice(discountTotal)}
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

CartItem.CartButtonGroup = function ButtonGroup() {
  const { item } = useItemContextProvider()
  const { removeItem, updateItem } = useCart()
  const [quantity, setQuantity] = useState<number>(item.quantity)
  const availableQuantity = item.variant?.availableQuantity
  console.log(
    'item.variant?.availableQuantity',
    item.variant?.availableQuantity,
  )
  const limit =
    availableQuantity && availableQuantity < ALLOW_QUANTITY
      ? availableQuantity
      : ALLOW_QUANTITY
  const isAddOk = quantity < limit
  const isMinusOk = quantity > 1

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
      }, 300)
    })
  }

  const [updateDebounce, , { isLoading }] = useDebounceFn(updateCartItem, 500)

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

  useEffect(() => {
    setQuantity((prev) => (item.quantity !== prev ? item.quantity : prev))
  }, [item])

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

type VariantOption = Option<IVariant>

CartItem.VariantSelect = function VariantSelect() {
  const { control } = useForm<{ variant: VariantOption }>()
  const [shouldFetch, fetchAction] = useBoolean()
  const {
    item: { variant: { product } = {} },
  } = useItemContextProvider()
  const { getSpecificationsByProduct, getVariants } = API['products']()

  //fetch distinct names
  const { data: { data: productSpecifications } = {} } = useCustom<
    { name: string; values: ISpecification[] }[]
  >({
    url: `${getSpecificationsByProduct(product?.id ?? '')}`,
    method: 'get',
    queryOptions: {
      enabled: !!product,
    },
  })

  //fetch variant list by products
  const { data: { data: variants } = {} } = useCustom<IVariant[]>({
    url: getVariants(product?.id),
    method: 'get',
    queryOptions: {
      enabled: !!product && shouldFetch,
    },
  })

  const distinctNames = useMemo(
    () =>
      productSpecifications
        ?.filter((spec) => spec.values.length > 1)
        .map((spec) => spec.name) ?? [],
    [productSpecifications],
  )

  const variantOptions = useMemo(
    () =>
      (variants ?? []).map((v) => {
        const label =
          v.specifications
            ?.filter((spec) => distinctNames.some((name) => name === spec.name))
            .map(({ name, value }) => `${name} ${value}`)
            .join('/ ') ?? ''
        return {
          label,
          value: v,
        }
      }),
    [distinctNames, variants],
  )
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
            console.log('newValue, meta', newValue, meta)
          },
          options: variantOptions,
          noOptionsMessage: 'Không có phiên bản.',
          formatOptionLabel: (data) => {
            return data.value?.name
          },
          onOpen: () => {
            console.log('onOpen ran')
            !shouldFetch && fetchAction.on()
          },
        }}
      />
    </>
  )
}

export default CartItem
