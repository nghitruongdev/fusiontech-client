/** @format */

import { springDataProvider } from '@/providers/rest-data-provider'
import { cache } from 'react'
import { GroupBase } from 'react-select'
import { IProduct, IVariant, Option } from 'types'
import { API } from 'types/constants'

const {
  resource,
  findByNameLike,
  projection: { nameWithVariants },
} = API['products']()

export const toVariantsWithProduct = (product: IProduct): IVariant[] => {
  const copyProduct = { ...product, variants: undefined }
  const variants =
    product.variants?.map((variant) => ({
      ...variant,
      product: copyProduct,
    })) ?? []
  return variants
}

export const findProductLikeNoOption = cache(
  async (input: string): Promise<GroupBase<IVariant>[]> => {
    if (!input?.length) return []
    const { data } = await springDataProvider.custom<IProduct[]>({
      url: `${findByNameLike(input)}&projection=${nameWithVariants}`,
      method: 'get',
      meta: {
        resource,
      },
    })
    return (
      data.map((item) => ({
        label: item.name,
        options: toVariantsWithProduct(item),
      })) ?? []
    )
  },
)
