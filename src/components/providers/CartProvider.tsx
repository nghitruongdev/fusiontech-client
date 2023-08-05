/** @format */

import { useAuthUser } from '@/hooks/useAuth/useAuthUser'
import { firestoreInstance, firestoreProvider } from '@/lib/firebase'
import useCart, {
  useCartIdStore,
  useCartItems,
  useCartStore,
} from '@components/store/cart/useCart'
import { useSelectedCartItemStore } from '@components/store/cart/useSelectedItemStore'
import { getUserCart, updateCart } from '@components/store/cart/utils'
import { useList } from '@refinedev/core'
import { onSnapshot, doc, query, collection, orderBy } from 'firebase/firestore'
import { useCallback, useEffect } from 'react'
import { ICart, ICartItem } from 'types'

const CART_RESOURCE = 'carts'
const ITEMS_RESOURCE = (cartId: string) => `carts/${cartId}/items`
const getResource = (resource: string) => ({
  dataProviderName: 'firestore',
  resource,
})
const CartProvider = () => {
  const items = useCartItems()
  const { user } = useAuthUser()
  const [clearCartItems, onItemsChange] = useCartStore(
    ({ clearItems, onItemsChange }) => [clearItems, onItemsChange],
  )
  const [cartId, setCartId, cartUserId, setCartUserId] = useCartIdStore(
    ({ cartId, setCartId, cartUserId, setCartUserId }) => [
      cartId,
      setCartId,
      cartUserId,
      setCartUserId,
    ],
  )
  const { updateItems } = useSelectedCartItemStore(({ updateItems }) => ({
    updateItems,
  }))
  const { mergeCart } = useCart()

  const {
    data: userCartData,
    remove,
    refetch,
  } = useList<ICart>({
    ...getResource(CART_RESOURCE),
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

  //   useEffect(() => {
  //     const unsub = withStorageDOMEvents(useCartIdStore as any)
  //     return unsub
  //   }, [])

  //   update cart

  useEffect(() => {
    console.count('use effect update cart ran times')
    console.log('cartId', cartId)
    if (!cartId) {
      clearCartItems()
      return
    }

    const unsub = onSnapshot(
      doc(firestoreInstance, 'carts', cartId),
      (snapshot) => {
        if (!snapshot.exists()) {
          unsub()
          return
        }

        const cartDb = snapshot.data() as ICart
        setCartUserId(cartDb.uid)
      },
    )
    return unsub
  }, [clearCartItems, setCartUserId, cartId])

  //update items
  useEffect(() => {
    console.count(`use effect update items ran times cartId ${cartId}`)
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
  }, [cartId, onItemsChange])

  //update when user changes
  useEffect(() => {
    const checkCartWhenLoggedIn = async () => {
      if (!user) return
      const userCart = await getUserCart(user.uid)

      if (cartId === userCart?.id) return

      if (userCart) {
        !!cartId ? mergeCart(cartId, userCart) : setCartId(userCart.id)
        return
      }

      if (cartId) {
        if (cartUserId) {
          console.warn(
            'Error: Not cleaned out the cart of another user, cart on machine belongs to the other user',
          )
          return
        }

        //DONE: update localcartid with userId
        updateCart(cartId, user.uid)
      }
    }

    const checkCartWhenNotLoggedIn = async () => {
      if (!user && !!cartUserId) {
        setCartId(null)
      }
    }

    if (!!user) {
      checkCartWhenLoggedIn()
    } else {
      checkCartWhenNotLoggedIn()
    }
  }, [user, cartId, mergeCart, setCartId, cartUserId])

  // console.log('use effect update selected items ran')
  useEffect(() => {
    updateItems(items)
  }, [items, updateItems])
  return <></>
}
export default CartProvider
