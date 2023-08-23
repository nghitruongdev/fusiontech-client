/** @format */

import { IProduct } from 'types'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

const RecentProductViewProvider = () => {
  // Sử dụng store 'useRecentProductViewStore' để lấy thông tin items
  const items = useRecentProductViewStore((state) => [state.items])
  return <></>
}

type RecentView = {
  product: IProduct
  time: number
}
type State = {
  items: RecentView[] // Danh sách các sản phẩm xem gần đây
}
type Action = {
  addProduct: (id: IProduct) => void
}

// Tạo store sử dụng Zustand, kết hợp với middleware persist và immer
export const useRecentProductViewStore = create<State & Action>()(
  // Sử dụng middleware persist và immer
  persist(
    immer((set, get) => ({
      items: [], // Khởi tạo danh sách ban đầu là rỗng
      addProduct(product) {
        const items = get().items // Lấy danh sách items hiện tại
        const updated = items.filter((item) => product.id !== item.product.id) // Loại bỏ sản phẩm trùng (nếu có)
        const newItems = [
          { product, time: new Date().getTime() }, // Thêm sản phẩm mới và thời gian vào danh sách
          ...updated,
        ].slice(0, 100) // Giới hạn số lượng sản phẩm trong danh sách
        set(({}) => ({ items: newItems })) // Cập nhật trạng thái mới cho store
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
