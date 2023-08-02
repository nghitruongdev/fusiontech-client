import { persist } from 'zustand/middleware'
import { useAuthUser } from '@/hooks/useAuth/useAuthUser'
import useNotification from '@/hooks/useNotification'
import { withStorageDOMEvents } from '@/hooks/withStorageEvent'
import {
  firebaseStorage,
  firestoreInstance,
  firestoreProvider,
} from '@/lib/firebase'
import { useCreate, useDelete, useList, useUpdate } from '@refinedev/core'
import {
  DocumentChangeType,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'
import { useCallback, useEffect, useRef } from 'react'
import { ICart, ICartItem } from 'types'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { shallow } from 'zustand/shallow'
import { springDataProvider } from '@/providers/rest-data-provider'
type ReturnProps = {
  addItem: (item: ICartItem) => void
  updateItem: (item: ICartItem) => void
  removeItem: (id: string) => void
  //   createCart: () => void
  // removeCart: (id: string) => void;
  clearCart: () => void
}

const CART_RESOURCE = 'carts'
const ITEMS_RESOURCE = (cartId: string) => `carts/${cartId}/items`
const getResource = (resource: string) => ({
  dataProviderName: 'firestore',
  resource,
})
export const ALLOW_QUANTITY = 10
const getAllowQuantity = (quantity: number) =>
  Math.round(quantity) > ALLOW_QUANTITY ? ALLOW_QUANTITY : Math.round(quantity)

const useCart = (): ReturnProps => {
  const cartId = useCartIdStore((state) => state.cartId)

  const cartIdRef = useRef(cartId)
  useEffect(() => {
    cartIdRef.current = cartId
  }, [cartId])

  const { user } = useAuthUser()

  const { items, clearItems, cart, setCart } = useCartStore(
    ({ items, cart, setCart, onItemsChange, clearItems }) => ({
      items,
      onItemsChange,
      clearItems,
      cart,
      setCart,
    }),
    shallow,
  )

  const { data: userCartData } = useList<ICart>({
    ...getResource('cart'),
    filters: [
      {
        field: 'uid',
        value: user?.uid ?? null,
        operator: 'eq',
      },
    ],
    pagination: {
      pageSize: 1,
    },
    queryOptions: {
      enabled: !!user?.uid,
    },
  })

  useEffect(() => {
    const unsub = withStorageDOMEvents(useCartIdStore as any)
    return unsub
  }, [])

  //update cart
  useEffect(() => {
    console.count('use effect update cart ran times')
    console.log('cartId', cartId)
    if (!cartId) {
      clearItems()
      return
    }

    const unsub = onSnapshot(
      doc(firestoreInstance, 'carts', cartId),
      (snapshot) => {
        const cart = snapshot.data() as ICart
        if (snapshot.exists()) {
          console.log('snapshot is exists, setting cart')
          setCart({
            ...cart,
            id: snapshot.id,
          })
        } else {
          unsub()
          setCart(undefined)
        }
      },
    )
    return unsub
  }, [cartId, setCart, clearItems])

  //update items
  useEffect(() => {
    console.count('use effect update items ran times')
    if (!cartId) {
      return
    }
    const q = query(
      collection(firestoreInstance, 'carts', cartId, 'items'),
      orderBy('updatedAt', 'asc'),
    )
    const unsub = onSnapshot(q, (querySnapshot) => {
      querySnapshot.docChanges()?.forEach(({ doc, type }) => {
        const { metadata, id } = doc
        const item = doc.data() as ICartItem
        // console.log("item", item, type);
        if (doc.exists()) {
          // const updatedAt =
          //     item.updatedAt ??
          //     doc.get("updatedAt", { serverTimestamps: "estimate" });
          onItemsChange({ ...item, id: id }, type)
        }
      })
    })

    return unsub
  }, [cartId])

  const clearCurrentCart = () => {
    if (cartId) deleteCart(cartId)
  }

  const deleteCartItem = useCallback(
    (id: string) => {
      if (!!!cartId) {
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
    async ({ id, variantId, quantity }: ICartItem) => {
      if (!cartId) {
        console.error('Cart id or item id not found')
        return
      }
      if (!id || !variantId || !items[variantId]) {
        console.error('Update error: Check your input.')
        return
      }
      if (quantity === 0) {
        deleteCartItem(id)
        return
      }

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

      const currentCartItemBasedOnVariantId = items[variantId]
      if (currentCartItemBasedOnVariantId) {
        const { id: currentId, quantity: currentQuantity } =
          currentCartItemBasedOnVariantId
        if (currentId && currentId !== id) {
          Promise.all([
            deleteCartItem(id),
            updateItem(currentId, variantId, currentQuantity + quantity),
          ])
          return
        }
      }

      updateItem(id, variantId, quantity)
    },
    [cartId, deleteCartItem, items],
  )

  const addCartItem = useCallback(
    async (addItem: ICartItem) => {
      if (!cartId) {
        await createCart(user?.uid ?? null)
      }
      const itemWithSameVariantId = items[addItem.variantId]
      if (!!itemWithSameVariantId) {
        const { id, variantId, quantity } = itemWithSameVariantId
        console.error('Duplicate variant id found, do not use interchangably')
        // updateCartItem({
        //   id,
        //   variantId,
        //   quantity: getAllowQuantity(quantity + addItem.quantity),
        // })
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
    [cartId, items, user?.uid],
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
    [addCartItem, items],
  )

  //update when user changes
  useEffect(() => {
    const checkCartWhenLoggedIn = async () => {
      if (!!!user) {
        return
      }
      const userCart = userCartData?.data?.[0]
      if (cartId === userCart?.id) return

      if (!!userCart) {
        if (!!cartId) {
          mergeCart(cartId, userCart)
        } else setCartId(userCart.id)
        return
      }

      if (!!cartId) {
        if (!!cart?.uid) {
          console.warn('Not yet cleaned out the cart of another user')
          return
        }
        //DONE: update localcartid with userId
        updateCart(cartId, user.uid)
      }
    }
    const checkCartWhenNotLoggedIn = async () => {
      if (!!!user && !!cart?.uid) {
        setCartId(undefined)
      }
    }
    if (!!user) {
      checkCartWhenLoggedIn()
    } else {
      checkCartWhenNotLoggedIn()
    }
  }, [user?.uid, cart?.uid, cartId, mergeCart, user, userCartData?.data])

  return {
    addItem: addCartItem,
    updateItem: updateCartItem,
    removeItem: deleteCartItem,
    // createCart,
    clearCart: clearCurrentCart,
  }
}

type State = {
  cart: ICart | undefined
  items: Record<number, ICartItem>
  setCart: (cart: State['cart']) => void
  addItem: (item: State['items'][number]) => void
  removeItem: (item: State['items'][number]) => void
  updateItem: (item: State['items'][number]) => void
  onItemsChange: (
    item: State['items'][number],
    type: DocumentChangeType,
  ) => void
  clearItems: () => void
}

const createCart = async (userId: string | null) => {
  console.debug('Creating new cart')
  const response = await firestoreProvider.create({
    resource: CART_RESOURCE,
    variables: {
      uid: userId,
      updatedAt: serverTimestamp(),
    },
  })
  setCartId(`${response.data.id}`)
  return response
}

const updateCart = (id: string, uid: string) => {
  return firestoreProvider.update({
    resource: CART_RESOURCE,
    id,
    variables: {
      uid,
      updatedAt: serverTimestamp(),
    },
  })
}

const deleteCart = async (id: string) => {
  if (!id) {
    console.error('Cart ID is not found')
    return
  }
  console.log('deleteCart id', id)
  const response = await firestoreProvider.deleteOne({
    resource: CART_RESOURCE,
    id: id,
  })
  setCartId(null)
  return response
}

const useCartStore = create(
  immer<State>((set, get) => {
    return {
      cart: undefined,
      items: {},
      setCart: (cart) => {
        set(() => ({ cart }))
      },
      addItem: (item) => {
        set(({ items }) => {
          items[item.variantId] = item
        })
      },
      removeItem: (item) => {
        set(({ items }) => {
          delete items[item.variantId]
        })
      },
      updateItem: (item) => {
        console.count('updating store item')
        const { variantId, quantity } = item
        set(({ items }) => {
          if (items[variantId]) {
            items[variantId]!.quantity = quantity
          } else {
            items[variantId] = item
          }
        })
      },
      onItemsChange: (item, type) => {
        switch (type) {
          case 'added':
            get().addItem(item)
            break
          case 'modified':
            get().updateItem(item)
            break
          case 'removed':
            get().removeItem(item)
            break
        }
      },
      clearItems: () => {
        if (Object.keys(get().items).length) set(() => ({ items: {} }))
      },
    }
  }),
)

const useCartIdStore = create<{
  cartId?: string | null
  setId: (id?: string | null) => void
}>()(
  persist(
    (set, get) => ({
      cartId: undefined,
      setId: (id) => {
        set(() => ({ cartId: id }))
        // if (!id) {
        // //   self?.persist!.clearStorage()
        // }
      },
    }),
    {
      name: 'cid',
    },
  ),
)

const onItemsChange = useCartStore.getState().onItemsChange
const setCartId = useCartIdStore.getState().setId
export default useCart
export { useCartStore, useCartIdStore }
export const useCartItems = () => useCartStore((state) => state.items)
