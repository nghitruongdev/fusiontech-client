/** @format */

'use client'
import { ICartItem, IVariant } from 'types'
import { useFetch, useUpdateEffect } from 'usehooks-ts'
import { Suspense, createContext, useContext, useRef } from 'react'
import CartItem from './CartItem'
import { useSelectedCartItemStore } from './useSelectedItemStore'
import useCart, { useCartItems } from './useCart'
import { Button } from '@chakra-ui/react'
import { useDialog } from '@components/ui/DialogProvider'

const CartItemList = () => {
  const data = useFetch<IVariant[]>('/api/products', {})
  return (
    <div about='Cart Item List'>
      <div className='flex flex-col gap-2'>
        <CartItemList.Provider>
          <CartItemList.Header />
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
    <CartItemList.Context.Provider value={{ status, items }}>
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
      {/* <div className="text-xl font-bold flex items-center gap-2 mb-2">
                <Image className="w-10" src={phoneImg} alt="phoneImage" />
                <p>Pickup and delivery options</p>
            </div> */}

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
      if (res) {
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
  const { items } = useListContext()
  // use(
  //     new Promise((res) => {
  //         if (ctx.status === "success") {
  //             res(undefined);
  //         }
  //     }),
  // );
  // if i use like this, will cause hydration failed
  // if (status === "loading") return <>Loading items in your cart...</>;
  return (
    <>
      <div className='w-full p-5 border-[1px] border-zinc-400 rounded-md flex flex-col gap-4'>
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
          <div className='grid grid-cols-1 gap-2 border-b-[1px] border-b-zinc-200 pb-2'>
            {items.map((item) => (
              <CartItem
                item={item}
                key={item.id ?? Math.random()}
              />
            ))}
          </div>
        </div>
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
    if (selected.length === items.length && !!items.length) {
      allRef.current.checked = true
    } else {
      allRef.current.checked = false
    }
  }, [selected.length])

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
