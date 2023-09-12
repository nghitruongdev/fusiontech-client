/** @format */

import { notFound } from 'next/navigation'
import {
  AllProduct,
  HotProduct,
  ProductLastest,
  SellingProducts,
} from './search-result-pagination'

type Props = {
  params: {
    search: string[]
  }
}
const page = ({ params: { search } }: Props) => {
  switch (search[0]) {
    case 'tat-ca':
      return <AllProduct />
    case 'san-pham-hot':
      return <HotProduct />
    case 'san-pham-moi-nhat':
      return <ProductLastest />
    case 'san-pham-ban-chay-nhat':
      return <SellingProducts />
  }
  return notFound()
}
export default page
