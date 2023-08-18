/** @format */

import { DeleteButtonProps } from '@refinedev/chakra-ui'
import { Button, Tooltip } from '@chakra-ui/react'
import { FC } from 'react'
import { DeleteButton } from '@components/buttons'
import { useCustom } from '@refinedev/core'
import { API } from 'types/constants'
import React from 'react'

export const DeleteProductButton: FC<
  DeleteButtonProps & { productId: string | number | undefined }
> = ({ productId, ...props }) => {
  const { data: hasImported } = useHasImportInventory(productId ?? '')
  return (
    <Tooltip
      label={`Không thể xoá, sản phẩm đã tồn tại trong kho hàng.`}
      hasArrow
      isDisabled={!hasImported}>
      <div>
        <DeleteButton
          {...props}
          disabled={props?.disabled || hasImported}
          isDisabled={props.isDisabled || hasImported}
        />
      </div>
    </Tooltip>
  )
}

const { hasImportInventory } = API['products']()

export const useHasImportInventory = (
  productId: string | number | undefined,
) => {
  const { data: { data } = {} } = useCustom({
    method: 'get',
    url: hasImportInventory(`${productId}`),
    queryOptions: {
      enabled: !!productId,
    },
  })
  return {
    data: data as unknown as boolean | undefined,
  }
}
