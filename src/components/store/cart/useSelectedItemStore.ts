/** @format */

import { ICartItem } from 'types'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { useCartStore } from './useCart'
import { useMemo } from 'react'

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

export const useSelectedCartItemStore = create<State & Action>()(
  persist(
    (set, get) => ({
      items: [],
      _hydrated: false,
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
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
      partialize(state) {
        return { items: state.items }
      },
      onRehydrateStorage: () => (state) => {
        console.debug('hydration starts')
        // optional
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

export const useValidSelectedCartItems = () => {
  const { items, getValidItems } = useSelectedCartItemStore(
    ({ items, getValidItems }) => ({ items, getValidItems }),
  )

  const { items: cartItems } = useCartStore()
  const selectedItems = useMemo(
    () => getValidItems(items, cartItems),
    [items, cartItems, getValidItems],
  )

  return selectedItems
}
