/** @format */

import { persist } from 'zustand/middleware'
import { useAuthUser } from '@/hooks/useAuth/useAuthUser'
import { firestoreProvider } from '@/lib/firebase'
import { DocumentChangeType, serverTimestamp } from 'firebase/firestore'
import { useCallback, useEffect, useRef } from 'react'
import { ICart, ICartItem, IVariant } from 'types'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { shallow } from 'zustand/shallow'
import { springDataProvider } from '@/providers/rest-data-provider'
import { API } from 'types/constants'
import { checkCartExists, createCart, deleteCart } from './utils'
import { produce } from 'immer'
import { toRecord } from '@/lib/utils'
type ReturnProps = {
  addItem: (item: ICartItem) => void
  updateItem: (item: ICartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
  mergeCart: (localCartId: string, userCart: ICart) => void
  //   updateCart: (id: string, uid: string) => void
  //   getUserCart: (uid: string | null) => void
}

const CART_RESOURCE = 'carts'
const ITEMS_RESOURCE = (cartId: string) => `carts/${cartId}/items`
const getResource = (resource: string) => ({
  dataProviderName: 'firestore',
  resource,
})
export const ALLOW_QUANTITY = 10
const getAllowQuantity = (quantity: number) =>
  Math.round(quantity) > ALLOW_QUANTITY
    ? ALLOW_QUANTITY
    : Math.round(quantity) > 0
    ? Math.round(quantity)
    : 0

const useCart = (): ReturnProps => {
  const { cartId, setCartId } = useCartIdStore(
    ({ cartId, cartUserId, setCartId, setCartUserId }) => ({
      cartId,
      setCartId,
    }),
  )

  const cartIdRef = useRef(cartId)

  useEffect(() => {
    console.log('cartId changed', cartId)
    cartIdRef.current = cartId
  }, [cartId])

  const { user } = useAuthUser()

  const { items, clearItems, onItemsChange } = useCartStore(
    ({ items, onItemsChange, clearItems }) => ({
      items,
      onItemsChange,
      clearItems,
    }),
    shallow,
  )

  const clearCurrentCart = () => {
    if (!cartId) return
    Object.entries(items).forEach(([, { id }]) => id && deleteCartItem(id))
  }

  const deleteCartItem = useCallback(
    (id: string) => {
      if (!cartId) {
        console.error('cart id not found')
        return
      }
      firestoreProvider.deleteOne({
        id,
        resource: ITEMS_RESOURCE(cartId),
      })
    },
    [cartId],
  )

  const updateCartItem = useCallback(
    async ({ id, variantId, quantity, variant }: ICartItem) => {
      if (!cartId) {
        console.error('Cart id or item id not found')
        return
      }
      if (!id || !variantId) {
        console.error('Update error: Check your input.')
        return
      }
      if (quantity === 0) {
        deleteCartItem(id)
        return
      }

      console.count('before updating cart item in database')
      const updateItem = async (
        id: string,
        variantId: number,
        quantity: number,
      ) => {
        firestoreProvider.update({
          id,
          resource: ITEMS_RESOURCE(cartId ?? ''),
          variables: {
            variantId,
            quantity: getAllowQuantity(quantity),
            updatedAt: serverTimestamp(),
          },
        })
      }
      const availQty = variant?.availableQuantity
      const currentCartItemBasedOnVariantId = items[variantId]
      const validVariantQty =
        !!availQty && availQty > 0 ? availQty : ALLOW_QUANTITY

      if (currentCartItemBasedOnVariantId) {
        const { id: currentId, quantity: currentQuantity } =
          currentCartItemBasedOnVariantId
        if (currentId && currentId !== id) {
          Promise.all([
            deleteCartItem(id),
            updateItem(
              currentId,
              variantId,
              Math.min(
                getAllowQuantity(currentQuantity + quantity),
                validVariantQty,
              ),
            ),
          ])
          return
        }
      }

      updateItem(id, variantId, Math.min(quantity, validVariantQty))
    },
    [cartId, deleteCartItem, items],
  )

  const addCartItem = useCallback(
    async (addItem: ICartItem) => {
      if (!cartId) {
        try {
          await new Promise(async (res, rej) => {
            let count = 0
            const interval = setInterval(() => {
              console.log('interval ran', count++)
              if (cartIdRef.current) {
                clearInterval(interval)
                res(undefined)
              }
              if (count === 10) {
                clearInterval(interval)
                rej('Operation time out.')
              }
            }, 1000)
            try {
              const response = await createCart(user?.uid ?? null)
              setCartId(response?.id)
            } catch (err) {
              clearInterval(interval)
              rej(err)
            }
          })
        } catch (err) {
          console.log('err', err)
          return
        }
      }

      console.log('after check cart id and create')

      const itemWithSameVariantId = items[addItem.variantId]
      if (!!itemWithSameVariantId) {
        const { id, variantId, quantity } = itemWithSameVariantId
        console.debug(
          'Duplicate variant id found, use update cart item instead',
        )
        updateCartItem({
          id,
          variantId,
          quantity: getAllowQuantity(quantity + addItem.quantity),
        })
        return
      }
      firestoreProvider.create({
        resource: ITEMS_RESOURCE(cartIdRef.current ?? ''),
        variables: {
          variantId: addItem.variantId,
          quantity: getAllowQuantity(addItem.quantity),
          updatedAt: serverTimestamp(),
        },
      })
    },
    [cartId, items, user?.uid, updateCartItem, setCartId],
  )

  const mergeCart = useCallback(
    async (localCartId: string, userCart: ICart) => {
      console.debug('start to merge cart')
      const localItems = [...Object.values(items)]
      await deleteCart(localCartId)
      setCartId(userCart.id)
      new Promise((res) => {
        setTimeout(() => {
          res(
            localItems.forEach(({ variantId, quantity }) =>
              addCartItem({ variantId, quantity }),
            ),
          )
        }, 500)
      })
    },
    [addCartItem, items, setCartId],
  )

  return {
    addItem: addCartItem,
    updateItem: updateCartItem,
    removeItem: deleteCartItem,
    // createCart,
    clearCart: clearCurrentCart,
    mergeCart,
  }
}

type State = {
  //   cart: ICart | undefined
  items: Record<number, ICartItem>
  //   setCart: (cart: State['cart']) => void
  //   addItem: (item: State['items'][number]) => void
  //   removeItem: (item: State['items'][number]) => void
  //   updateItem: (item: State['items'][number]) => void
  onItemsChange: (
    item: State['items'][number],
    type: DocumentChangeType,
  ) => void
  clearItems: () => void
}

const {
  resource,
  projection: { withProduct: projection },
} = API['variants']()
const useCartStore = create(
  immer<State>((set, get) => {
    const getVariant = async (item: ICartItem) => {
      return await springDataProvider.getOne<IVariant>({
        resource,
        id: item.variantId,
        meta: {
          query: {
            projection,
          },
        },
      })
    }

    const addItem = async (item: State['items'][number]) => {
      const variant = (await getVariant(item)).data
      set(({ items }) => {
        items[item.variantId] = { ...item, variant }
      })
    }
    const removeItem = (item: State['items'][number]) => {
      set(({ items }) => {
        delete items[item.variantId]
      })
    }
    const updateItem = async (item: State['items'][number]) => {
      console.log('update item called')
      const { id, variantId, quantity, variant: variantItem } = item
      const variant = variantItem ?? (await getVariant(item)).data
      const updateItem = { ...item, variant, quantity }
      const array = Object.values(get().items)
      const idx = array.findIndex((current) => current.id === item.id)
      array[idx] = updateItem
      set(() => ({ items: toRecord(array, 'variantId') }))
    }

    return {
      //   cart: undefined,
      items: {},
      //   setCart: (cart) => {
      //     set(() => ({ cart }))
      //   },
      onItemsChange: (item, type) => {
        switch (type) {
          case 'added':
            addItem(item)
            break
          case 'modified':
            updateItem(item)
            break
          case 'removed':
            removeItem(item)
            break
        }
      },
      clearItems: () => {
        if (Object.keys(get().items).length) set(() => ({ items: {} }))
      },
    }
  }),
)

export const useCartIdStore = create<{
  cartId: string | null
  cartUserId: string | null
  setCartId: (cart: string | null) => void
  setCartUserId: (userId: string | null) => void
}>()(
  persist(
    (set, get) => {
      return {
        cartId: null,
        cartUserId: null,
        setCartId: async (id) => {
          if (id) {
            if (!(await checkCartExists(id))) return
            set(() => ({ cartId: id }))
            return
          }

          set(() => ({ cartId: null, cartUserId: null }))
        },
        setCartUserId: (userId) => set(() => ({ cartUserId: userId })),
      }
    },
    {
      name: 'cart',
    },
  ),
)
// const useCartIdStore = create<{
//   //   setId: (id?: string | null) => void
//   cart: Partial<ICart> | null
//   setCart: (cart: Partial<ICart>) => void
// }>()(
//   persist(
//     (set, get) => ({
//       cart: null,
//       setId: (id) => {
//         if (id) {
//           const checkCartId = async () => {
//             if (!(await checkCartExists(id))) return
//             set(({ cart }) => ({ cart: { ...cart, id: id } }))
//           }
//           checkCartId()
//           return
//         }
//         set(() => ({ cart: {} }))
//       },
//       setCart: (cart) => {
//         if (cartId) {
//           console.log('cart', cart)
//           const checkCartId = async () => {
//             if (!(await checkCartExists(cart.id ?? ''))) return
//             set(({}) => ({ cart }))
//           }
//           checkCartId()
//           return
//         }
//         set(() => ({ cart: null }))
//         useCartIdStore.persist.clearStorage()
//       },
//     }),
//     {
//       name: 'cid',
//       onRehydrateStorage(state) {
//         console.log('state', state)
//       },
//     },
//   ),
// )

// export const setCart = useCartIdStore.getState().setCart

export default useCart
export { useCartStore }
export const useCartItems = () => useCartStore((state) => state.items)

export const setCartId = useCartIdStore.getState().setCartId
