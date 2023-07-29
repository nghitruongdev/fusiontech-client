'use client'
import { ReactNode } from 'react'
import VisualWrapper from '@components/ui/VisualWrapper'
import CartItemList from './CartItemList'
import { CartPanel } from './panel'
import useCart, {
  useCartIdStore,
  useCartStore,
} from '@components/store/cart/useCart'
import { Button } from '@components/ui/shadcn/button'
import { useRef, useState } from 'react'

type Props = {
  children: ReactNode
}

const Cart = () => {
  const setCartId = useCartIdStore((state) => state.setId)
  const items = useCartStore((state) => state.items)
  const inputRef = useRef<HTMLInputElement>(null)
  const set = () => {
    setCartId(inputRef.current?.value ?? '')
  }
  const [state, setState] = useState<boolean>(false)
  const [cart] = useCartStore((state) => [state.cart])
  const { createCart, addItem, removeItem, updateItem } = useCart()
  console.debug('cart', items)
  return (
    <VisualWrapper name="Cart">
      <div>
        <p>Test page</p>
        <p>{JSON.stringify(cart)}</p>
        {Object.values(items)
          .reverse()
          .map(({ id, variantId, quantity, updatedAt }) => (
            <div key={id}>
              <p>Id:{id}</p>
              <p>Variant: {variantId}</p>
              <p>Quantity: {quantity}</p>
              <p>
                updatedAt:{' '}
                {JSON.stringify(updatedAt?.toDate().toLocaleTimeString())}
              </p>
            </div>
          ))}
        <input type="text" ref={inputRef} className="border" />

        <Button variant="secondary" onClick={set}>
          Submit
        </Button>

        <Button variant="default" onClick={createCart}>
          Create cart
        </Button>

        <Button
          variant="default"
          // onClick={removeCart.bind(null, inputRef.current?.value ?? "")}
          onClick={() =>
            console.log('inputRef.current?.value', inputRef.current?.value)
          }
        >
          Delete cart
        </Button>

        <Button
          variant="destructive"
          onClick={() => {
            addItem({
              variantId: +Math.random().toFixed(1),
              quantity: +Math.random().toFixed(1),
            })
          }}
        >
          Add item
        </Button>

        <Button onClick={() => setState((prev) => !prev)}>Force refresh</Button>
      </div>
      <div className="w-full py-10 bg-white text-black">
        <div className="w-full flex gap-10">
          <div className="w-2/3">
            <CartItemList />
          </div>

          <div className="w-1/3 min-h-[500px]">
            <CartPanel />
          </div>
        </div>
      </div>
    </VisualWrapper>
  )
}

export default Cart
