/** @format */

import { DeleteButtonProps } from '@refinedev/chakra-ui'
import { Button, Tooltip } from '@chakra-ui/react'
import { FC } from 'react'
import { DeleteButton } from '@components/buttons'
import { useCustom } from '@refinedev/core'
import { API } from 'types/constants'
import React from 'react'

const { countUsage } = API['vouchers']()
export const DeleteVoucherButton: FC<
  DeleteButtonProps & { usageCount: number }
> = ({ usageCount, ...props }) => {
  const isUsed = usageCount != 0
  return (
    <Tooltip
      label={`Không thể xoá, voucher đã được sử dụng.`}
      hasArrow
      isDisabled={!isUsed}>
      <div>
        <DeleteButton
          {...props}
          disabled={props?.disabled || isUsed}
          isDisabled={props.isDisabled || isUsed}
        />
      </div>
    </Tooltip>
  )
}
