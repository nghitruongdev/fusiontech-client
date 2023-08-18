/** @format */

import { DeleteButtonProps } from '@refinedev/chakra-ui'
import { Button, Tooltip } from '@chakra-ui/react'
import { FC } from 'react'
import { DeleteButton } from '@components/buttons'
import { useCustom } from '@refinedev/core'
import { API } from 'types/constants'
import React from 'react'

export const DeleteVariantButton: FC<
  DeleteButtonProps & { variantId: string | number | undefined }
> = ({ variantId: productId, ...props }) => {
  const { data: hasImported } = useHasImportInventory(productId ?? '')
  return (
    <Tooltip
      label={`Không thể xoá, phiên bản sản phẩm đã tồn tại trong kho hàng.`}
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

const { hasImportInventory } = API['variants']()

export const useHasImportInventory = (
  variantId: string | number | undefined,
) => {
  const { data: { data } = {} } = useCustom({
    method: 'get',
    url: hasImportInventory(`${variantId}`),
    queryOptions: {
      enabled: !!variantId,
    },
  })
  return {
    data: data as unknown as boolean | undefined,
  }
}
