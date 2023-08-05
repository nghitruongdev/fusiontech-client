/** @format */

import { IProduct } from 'types'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

const RecentProductViewProvider = () => {
  const items = useRecentProductViewStore((state) => [state.items])
  return <></>
}

type RecentView = {
  product: IProduct
  time: number
}
type State = {
  items: RecentView[]
}
type Action = {
  addProduct: (id: IProduct) => void
}

export const useRecentProductViewStore = create<State & Action>()(
  persist(
    immer((set, get) => ({
      items: [],
      addProduct(product) {
        const items = get().items
        const updated = items.filter((item) => product.id !== item.product.id)
        const newItems = [
          { product, time: new Date().getTime() },
          ...updated,
        ].slice(0, 100)
        set(({}) => ({ items: newItems }))
      },
    })),
    {
      name: 'recentProductView', // name of the item in the storage (must be unique)
      //   storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
      partialize(state) {
        return { items: state.items }
      },
      onRehydrateStorage: () => (state) => {
        const name = 'recentProductViewStore'
        console.debug(`hydration of ${name} started.`)
        // optional
        return (state: any, error: any) => {
          if (error) {
            console.error(
              `an error happened during hydration of ${name}`,
              error,
            )
          } else {
            console.debug(`hydration of ${name} finished.`)
          }
        }
      },
    },
  ),
)

export default RecentProductViewProvider
