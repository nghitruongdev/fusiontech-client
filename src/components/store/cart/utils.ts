/** @format */

import { firestoreProvider, firestoreInstance } from '@/lib/firebase'
import { serverTimestamp, getDoc, doc } from 'firebase/firestore'
import { ICart, ICartItem } from 'types'
import { setCartId } from './useCart'

const CART_RESOURCE = 'carts'

// tính tổng số tiền của tất cả sản phẩm trong giỏ hàng
export const getTotalAmount = (
  items: ICartItem[], // Định nghĩa hàm getTotalAmount, nhận vào một mảng các sản phẩm trong giỏ hàng (items)
) =>
  items
    .map((item) => (item.variant?.price ?? 0) * item.quantity) //.map() để tính giá tiền cho mỗi sản phẩm
    .reduce((prev, curr) => prev + curr, 0) //.reduce() để tính tổng số tiền của tất cả các sản phẩm.

//tính tổng số tiền giảm giá dựa trên phần trăm giảm giá của sản phẩm.
export const getDiscount = (items: ICartItem[]) =>
  items
    .map((item) => {
      const original = item.quantity * (item.variant?.price ?? 0)
      return ((item.variant?.product?.discount ?? 0) / 100) * original
    })
    .reduce((prev, curr) => prev + curr, 0)

//createCart, tạo một giỏ hàng mới trong cơ sở dữ liệu Firestore
export const createCart = async (userId: string | null) => {
  console.debug('Creating new cart')
  //firestoreProvider.create() để thực hiện tạo giỏ hàng, với các biến truyền vào bao gồm userId và updatedAt.
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

//updateCart, cập nhật thông tin giỏ hàng đã tồn tại trong cơ sở dữ liệu.
export const updateCart = (id: string, uid: string) => {
  //firestoreProvider.update() để thực hiện cập nhật thông tin giỏ hàng.
  return firestoreProvider.update({
    resource: CART_RESOURCE,
    id,
    variables: {
      uid,
      updatedAt: serverTimestamp(),
    },
  })
}

//deleteCart, xóa một giỏ hàng dựa trên id
export const deleteCart = async (id: string) => {
  if (!id) {
    console.error('Cart ID is not found')
    return
  }
  console.log('deleteCart id', id)
  //firestoreProvider.deleteOne() để thực hiện xóa giỏ hàng và sau đó đặt setCartId thành null.
  const response = await firestoreProvider.deleteOne({
    resource: CART_RESOURCE,
    id: id,
  })

  setCartId(null)
  return response
}

//getUserCart, lấy thông tin giỏ hàng của người dùng dựa trên uid
export const getUserCart = async (uid: string | null) => {
  if (!uid) return

  // firestoreProvider.getList() để lấy danh sách các giỏ hàng của người dùng và trả về giỏ hàng đầu tiên trong danh sách.
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

// checkCartExists, kiểm tra xem một giỏ hàng có tồn tại dựa trên id
export const checkCartExists = async (id: string) => {
  //Hàm này sử dụng getDoc() để lấy thông tin của giỏ hàng và kiểm tra xem nó có tồn tại hay không.
  const result = await getDoc(doc(firestoreInstance, 'carts', id))
  return result.exists()
}

export * from './utils'
