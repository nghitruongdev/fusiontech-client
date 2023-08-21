/** @format */

'use client'
import { ICartItem, IVariant } from 'types'
import { useFetch, useUpdateEffect } from 'usehooks-ts'
import {
  Suspense,
  createContext,
  useContext,
  useRef,
  useEffect,
  PropsWithChildren,
} from 'react'
import CartItem from './CartItem'
import { useSelectedCartItemStore } from './useSelectedItemStore'
import useCart, { useCartItems } from './useCart'
import {
  Button,
  HStack,
  Image,
  Skeleton,
  SkeletonText,
  useBoolean,
} from '@chakra-ui/react'
import { useDialog } from '@components/ui/DialogProvider'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { v4 as uuidv4 } from 'uuid'
import dynamic from 'next/dynamic'

const CartItemList = () => {
  const data = useFetch<IVariant[]>('/api/products', {})
  return (
    <div about='Cart Item List'>
      <div className='flex flex-col gap-2'>
        <CartItemList.Provider>
          <Suspense fallback='Loading items in cart....'>
            <CartItemList.Body />
          </Suspense>
        </CartItemList.Provider>
      </div>
    </div>
  )
}

type ContextProps = {
  status: string
  items: ICartItem[]
}
const useListContext = () => {
  const context = useContext(CartItemList.Context)
  if (!!!context) throw new Error('CartItemList.Context is not found')
  return context
}

CartItemList.Context = createContext<ContextProps | undefined>(undefined)
CartItemList.Provider = function Provider({
  children,
}: React.PropsWithChildren<{}>) {
  const items = Object.values(useCartItems()).reverse()
  const status = 'success'
  return (
    <CartItemList.Context.Provider value={{ status, items: items }}>
      {children}
    </CartItemList.Context.Provider>
  )
}

CartItemList.Header = function Header() {
  const items = useCartItems()

  return (
    <div className='flex justify-between items-end gap-4 px-2'>
      <h1 className='text-2xl font-bold text-black'>
        <span>Giỏ hàng </span>
        <span className='text-lightText font-normal'>
          ({Object.keys(items).length ?? 0} sản phẩm)
        </span>
      </h1>
      <CartItemList.ClearAllButton />
    </div>
  )
}

CartItemList.ClearAllButton = function ClearAllButton() {
  const { confirm } = useDialog()
  const { clearCart } = useCart()
  const items = useCartItems()
  const onClearCartHandler = () => {
    confirm({
      header: <p className='flex gap-2'>Xoá tất cả sản phẩm</p>,
      message: 'Bạn có chắc chắn muốn xoá tất cả sản phẩm trong giỏ hàng?',
    }).then((res) => {
      if (res.status) {
        clearCart()
      }
    })
  }

  if (!Object.keys(items).length) return <></>
  return (
    <>
      <Button
        onClick={onClearCartHandler}
        variant={'link'}
        fontSize={'sm'}>
        Xoá tất cả
      </Button>
      {/* {dialog} */}
    </>
  )
}

CartItemList.Body = function Body() {
  const { items, status } = useListContext()
  const [shouldShow, { on: showOn }] = useBoolean()
  useEffect(() => {
    setTimeout(() => {
      showOn()
    }, 1000)
  }, [])
  if (!shouldShow) return <CartItemList.Loading />
  return (
    <>
      <CartItemList.Header />
      <div className='w-full p-5 border-[1px] border-zinc-400 rounded-md flex flex-col gap-2'>
        <div className='flex justify-between'>
          <CartItemList.SelectAllCheckbox />
          <div className='flex'>
            {/* <Award color="#1e51c8" className="text-sm" /> */}
            <p className=''>
              <span className='mx-1 font-medium text-xs text-zinc-500'>
                Hãng chính hãng được bán và phân phối bởi
              </span>
              <span className='text-primaryBlue font-bold uppercase text-base'>
                FusionTech
              </span>
            </p>
          </div>
        </div>
        <div className=''>
          <div className='grid grid-cols-1 gap-2  border-b-zinc-200 pb-2'>
            {!items.length && (
              <div className='flex flex-col gap-2 items-center'>
                <Image
                  src='https://media.istockphoto.com/id/1139666909/vector/shopping-cart-shop-trolley-or-basket-in-the-supermarket.jpg?s=612x612&w=0&k=20&c=_HajO7ifYKxuwzKFf-Fx9lsLKBa_1Rq9vuzGiPq8Q5Q='
                  className='h-[300px]'
                />
                <p className='font-sans text-2xl font-bold text-zinc-500 mb-2'>
                  Giỏ hàng của bạn trống
                </p>
                <Button className=' bg-primaryBlue'>
                  <Link
                    href='/'
                    className='flex gap-2 items-center text-zinc-500'>
                    Quay trở lại mua sắm <ShoppingBag />
                  </Link>
                </Button>
              </div>
            )}
            {items.map((item) => (
              <CartItem
                item={item}
                key={item.id ?? uuidv4()}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

CartItemList.Loading = function CartItemLoading({
  children,
}: PropsWithChildren) {
  return (
    <>
      <p className='h-[32px]'></p>
      <div className='grid gap-4'>
        {Array.from({ length: 3 }).map((item) => (
          <div className='grid grid-cols-3'>
            <Skeleton
              w='90%'
              h='150px'
              textColor={'gray.500'}
              mx='auto'
            />
            <SkeletonText
              noOfLines={5}
              spacing='2'
              skeletonHeight='6'
              className=' !col-span-2'
            />
          </div>
        ))}
      </div>
    </>
  )
}
CartItemList.SelectAllCheckbox = function AllCheckbox() {
  const allRef = useRef<HTMLInputElement>(null)
  const { items } = useListContext()
  const [selected, addAll, clearAll] = useSelectedCartItemStore((state) => [
    state.items,
    state.addAll,
    state.clearAll,
  ])
  const toggleAll = () => {
    const isSelected = allRef.current?.checked
    if (!isSelected) {
      clearAll()
      return
    }
    addAll(items)
  }
  useUpdateEffect(() => {
    if (!!!allRef.current) return
    console.log('selected.length, items.length', selected.length, items.length)
    if (selected.length === items.length && !!items.length) {
      allRef.current.checked = true
    } else {
      allRef.current.checked = false
    }
  }, [selected.length, items.length])

  return (
    <>
      <label
        htmlFor='all'
        className='flex items-center'>
        <input
          type='checkbox'
          ref={allRef}
          onChange={toggleAll}
          id='all'
        />
        <span className='text-muted-foreground text-sm mx-2'>Chọn tất cả</span>
      </label>
    </>
  )
}

export default CartItemList
