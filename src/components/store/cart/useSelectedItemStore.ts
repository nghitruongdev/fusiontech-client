/** @format */

import { ICartItem } from 'types'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { useCartStore } from './useCart'
import { useMemo } from 'react'

/**
 * useSelectedCartItemStore để quản lý danh sách các mục đã chọn từ giỏ hàng.
 * Mỗi hành động trong store sẽ thay đổi trạng thái của mảng items,
 *  và store này cũng sử dụng middleware persist để duy trì trạng thái sau khi tải lại trang.
 * Hàm useValidSelectedCartItems được sử dụng để lấy danh sách các mục đã chọn mà còn tồn tại trong giỏ hàng.
 */

// Khai báo các kiểu dữ liệu trạng thái và hành động của store
type State = {
  items: ICartItem[]
}
type Action = {
  addSelectedItem: (item: ICartItem) => void
  removeSelectedItem: (item: ICartItem) => void
  addAll: (items: ICartItem[]) => void
  clearAll: () => void
  updateItems: (items: Record<number, ICartItem>) => void
  getValidItems: (
    items: ICartItem[],
    cartItems: Record<number, ICartItem>,
  ) => ICartItem[]
}

// create để tạo một custom store sử dụng Zustand
export const useSelectedCartItemStore = create<State & Action>()(
  //Sử dụng persist middleware để lưu trạng thái của store vào bộ nhớ tạm thời (session storage) để duy trì sau khi tải lại trang
  persist(
    (set, get) => ({
      items: [], // Mảng lưu trữ các mục đã chọn
      _hydrated: false, // Dấu hiệu đã nạp trạng thái từ storage
      // gồm các hành động như addSelectedItem, removeSelectedItem, ... để thay đổi trạng thái của mảng các mục đã chọn (items).
      addSelectedItem: (item: ICartItem) =>
        set((state) => ({ items: [...state.items, item] })),
      removeSelectedItem: (item: ICartItem) =>
        set((state) => ({
          items: [
            ...state.items.filter(
              (selected) => selected.variantId !== item.variantId,
            ),
          ],
        })),
      addAll: (items: ICartItem[]) => set({ items: items }),
      clearAll: () => set({ items: [] }),
      updateItems: (newItems: Record<number, ICartItem>) => {
        // set(({ items }) => ({
        //   items: items
        //     .map((item) => newItems[item.variantId])
        //     .filter((item) => !!item)
        //     .map((item) => item as ICartItem),
        // }))
      },
      getValidItems: (items, cartItems) => {
        return items
          .map((item) => cartItems[item.variantId])
          .filter((item) => !!item)
          .map((item) => item as ICartItem)
      },
    }),
    {
      name: 'selected-items', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // Sử dụng sessionStorage để lưu trạng thái (tuỳ chọn)
      partialize(state) {
        return { items: state.items }
      },
      onRehydrateStorage: () => (state) => {
        console.debug('hydration starts')
        // Xử lý sau khi nạp trạng thái từ storage (tuỳ chọn)
        return (state: any, error: any) => {
          if (error) {
            console.error(
              'an error happened during hydration of selectedCartItems store',
              error,
            )
          } else {
            console.debug('hydration of selected cart items finished')
          }
        }
      },
    },
  ),
)

//Hook useValidSelectedCartItems để lấy danh sách các mục đã chọn từ store
export const useValidSelectedCartItems = () => {
  // Hàm này sử dụng useSelectedCartItemStore để truy cập các hành động và trạng thái của store
  const { items, getValidItems } = useSelectedCartItemStore(
    ({ items, getValidItems }) => ({ items, getValidItems }),
  )

  //useCartStore để lấy danh sách các mục trong giỏ hàng
  const { items: cartItems } = useCartStore()

  //useMemo để tính toán danh sách các mục đã chọn mà còn tồn tại trong giỏ hàng
  const selectedItems = useMemo(
    // getValidItems được gọi từ store để lọc ra các mục hợp lệ.
    () => getValidItems(items, cartItems),
    [items, cartItems, getValidItems],
  )

  return selectedItems
}
