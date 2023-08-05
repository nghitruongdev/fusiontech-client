/** @format */

import { firestoreProvider, firestoreInstance } from '@/lib/firebase'
import { serverTimestamp, getDoc, doc } from 'firebase/firestore'
import { ICart, ICartItem } from 'types'
import { setCartId } from './useCart'

const CART_RESOURCE = 'carts'

export const getTotalAmount = (items: ICartItem[]) =>
  items
    .map((item) => (item.variant?.price ?? 0) * item.quantity)
    .reduce((prev, curr) => prev + curr, 0)

export const getDiscount = (items: ICartItem[]) =>
  items
    .map((item) => {
      const original = item.quantity * (item.variant?.price ?? 0)
      return ((item.variant?.product?.discount ?? 0) / 100) * original
    })
    .reduce((prev, curr) => prev + curr, 0)

export const createCart = async (userId: string | null) => {
  console.debug('Creating new cart')
  const response = await firestoreProvider.create<ICart>({
    resource: CART_RESOURCE,
    variables: {
      uid: userId,
      updatedAt: serverTimestamp(),
    },
  })
  console.log('response.data.id', response.data)
  return response.data
}

export const updateCart = (id: string, uid: string) => {
  return firestoreProvider.update({
    resource: CART_RESOURCE,
    id,
    variables: {
      uid,
      updatedAt: serverTimestamp(),
    },
  })
}

export const deleteCart = async (id: string) => {
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

export const getUserCart = async (uid: string | null) => {
  if (!uid) return
  const response = await firestoreProvider.getList<ICart>({
    resource: CART_RESOURCE,
    filters: [
      {
        field: 'uid',
        value: uid ?? null,
        operator: 'eq',
      },
    ],
    pagination: {
      pageSize: 1,
    },
  })
  return response.data?.[0]
}

export const checkCartExists = async (id: string) => {
  const result = await getDoc(doc(firestoreInstance, 'carts', id))
  return result.exists()
}

export * from './utils'
