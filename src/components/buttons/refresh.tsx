import { IconButton, Button } from '@chakra-ui/react'
import React from 'react'
import {
  useOne,
  useTranslate,
  useResource,
  pickNotDeprecated,
} from '@refinedev/core'
import { IconRefresh } from '@tabler/icons'
import type { RefreshButtonProps } from '@refinedev/chakra-ui'
import { RefineButtonClassNames } from '@refinedev/ui-types'
import { ButtonText } from 'types/constants'

/**
 * `<RefreshButton>` uses Chakra UI {@link https://chakra-ui.com/docs/components/button `<Button> `} component.
 * to update the data shown on the page via the {@link https://refine.dev/docs/api-reference/core/hooks/data/useOne `useOne`} method provided by your dataProvider.
 *
 * @see {@link https://refine.dev/docs/api-reference/chakra-ui/components/buttons/refresh-button} for more details.
 */
export const RefreshButton: React.FC<RefreshButtonProps> = ({
  resource: resourceNameFromProps,
  resourceNameOrRouteName,
  recordItemId,
  hideText = false,
  meta,
  metaData,
  dataProviderName,
  svgIconProps,
  children,
  onClick,
  ...rest
}) => {
  const { identifier, id } = useResource(
    resourceNameFromProps ?? resourceNameOrRouteName,
  )

  const translate = useTranslate()

  const { refetch, isFetching } = useOne({
    resource: identifier,
    id: recordItemId ?? id ?? '',
    queryOptions: {
      enabled: false,
    },
    meta: pickNotDeprecated(meta, metaData),
    metaData: pickNotDeprecated(meta, metaData),
    liveMode: 'off',
    dataProviderName,
  })

  return hideText ? (
    <IconButton
      variant="outline"
      aria-label={translate('buttons.refresh', ButtonText('refresh'))}
      onClick={(e: React.PointerEvent<HTMLButtonElement>) =>
        onClick ? onClick(e) : refetch()
      }
      isDisabled={isFetching}
      className={RefineButtonClassNames.RefreshButton}
      {...rest}
    >
      <IconRefresh size={20} {...svgIconProps} />
    </IconButton>
  ) : (
    <Button
      variant="outline"
      leftIcon={<IconRefresh size={20} {...svgIconProps} />}
      isLoading={isFetching}
      onClick={(e: React.PointerEvent<HTMLButtonElement>) =>
        onClick ? onClick(e) : refetch()
      }
      className={RefineButtonClassNames.RefreshButton}
      {...rest}
    >
      {children ?? translate('buttons.refresh', ButtonText('refresh'))}
    </Button>
  )
}
