/** @format */

import { Tooltip } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'

export const TooltipCondition = ({
  children,
  condition = true,
  label,
}: PropsWithChildren<{ condition: boolean; label: string }>) => {
  if (condition)
    return (
      <Tooltip
        hasArrow
        label={label}
        bg='gray.100'
        color='blackAlpha.700'>
        {children}
      </Tooltip>
    )
  return <>{children}</>
}
