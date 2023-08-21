/** @format */

import {
  Button,
  HStack,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from '@chakra-ui/react'
import React, { useContext, useState } from 'react'
import {
  useDelete,
  useTranslate,
  useMutationMode,
  useCan,
  useResource,
  pickNotDeprecated,
  useWarnAboutChange,
  AccessControlContext,
  useOne,
} from '@refinedev/core'
import { IconTrash } from '@tabler/icons'
import type { DeleteButtonProps } from '@refinedev/chakra-ui'
import { RefineButtonClassNames } from '@refinedev/ui-types'
import { ButtonText } from 'types/constants'
import {
  onError,
  onSuccess as notificationOnSuccess,
} from '@/hooks/useCrudNotification'
import { useHeaders } from '@/hooks/useHeaders'

/**
 * `<DeleteButton>` uses Chakra UI {@link https://chakra-ui.com/docs/components/button `<Button>`} and {@link https://chakra-ui.com/docs/components/popover `<Popover>`} components.
 * When you try to delete something, a dialog modal shows up and asks for confirmation. When confirmed it executes the `useDelete` method provided by your `dataProvider`.
 *
 * @see {@link https://refine.dev/docs/api-reference/chakra-ui/components/buttons/delete-button} for more details.
 */

export const DeleteButton: React.FC<DeleteButtonProps> = (props) => {
  const {
    resource: resourceNameFromProps,
    resourceNameOrRouteName,
    recordItemId,
    onSuccess,
    mutationMode: mutationModeProp,
    children,
    successNotification,
    errorNotification,
    hideText = false,
    accessControl,
    meta,
    metaData,
    dataProviderName,
    confirmTitle,
    confirmOkText,
    confirmCancelText,
    svgIconProps,
    ...rest
  } = props
  const accessControlContext = useContext(AccessControlContext)

  const accessControlEnabled =
    accessControl?.enabled ??
    accessControlContext.options.buttons.enableAccessControl

  const hideIfUnauthorized =
    accessControl?.hideIfUnauthorized ??
    accessControlContext.options.buttons.hideIfUnauthorized

  const translate = useTranslate()

  const { id, resource, identifier } = useResource(
    resourceNameFromProps ?? resourceNameOrRouteName,
  )

  const { mutationMode: mutationModeContext } = useMutationMode()

  const mutationMode = mutationModeProp ?? mutationModeContext

  const { mutate, isLoading, variables } = useDelete()
  const onDeleteSuccess = resource?.meta?.onDeleteSuccess

  const { data } = useCan({
    resource: resource?.name,
    action: 'delete',
    params: { id: recordItemId ?? id, resource },
    queryOptions: {
      enabled: accessControlEnabled,
    },
  })
  const [opened, setOpened] = useState(false)

  const disabledTitle = () => {
    if (data?.can) return ''
    else if (data?.reason) return data.reason
    else return translate('buttons.notAccessTitle', 'Bạn không có quyền để xoá')
  }

  const { getAuthHeader } = useHeaders()
  const onConfirm = () => {
    if (identifier && (recordItemId ?? id)) {
      setWarnWhen(false)
      setOpened(false)
      mutate(
        {
          id: recordItemId ?? id ?? '',
          resource: identifier,
          mutationMode,
          successNotification:
            successNotification ?? notificationOnSuccess.bind(null, 'delete'),
          errorNotification: errorNotification ?? onError,
          meta: {
            ...pickNotDeprecated(meta, metaData),
            headers: {
              ...getAuthHeader(),
            },
          },
          metaData: pickNotDeprecated(meta, metaData),
          dataProviderName,
        },
        {
          onSuccess: (value) => {
            onSuccess && onSuccess(value)
          },
        },
      )
    }
  }

  const { setWarnWhen } = useWarnAboutChange()

  if (accessControlEnabled && hideIfUnauthorized && !data?.can) {
    return null
  }

  return (
    <Popover
      isOpen={opened}
      isLazy>
      <PopoverTrigger>
        {hideText ? (
          <IconButton
            colorScheme='red'
            variant='outline'
            aria-label={translate('buttons.edit', 'Edit')}
            onClick={() => {
              console.log('delete button clicked')
              setOpened((o) => !o)
            }}
            isDisabled={isLoading || data?.can === false}
            isLoading={(recordItemId ?? id) === variables?.id && isLoading}
            className={RefineButtonClassNames.DeleteButton}
            {...rest}>
            <IconTrash
              size={20}
              {...svgIconProps}
            />
          </IconButton>
        ) : (
          <Button
            colorScheme='red'
            variant='outline'
            onClick={() => {
              console.log('Button clicked')
              setOpened((o) => !o)
            }}
            isDisabled={isLoading || data?.can === false}
            isLoading={id === variables?.id && isLoading}
            leftIcon={
              <IconTrash
                size={20}
                {...svgIconProps}
              />
            }
            title={disabledTitle()}
            className={RefineButtonClassNames.DeleteButton}
            {...rest}>
            {children ?? translate('buttons.delete', ButtonText('delete'))}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverHeader textAlign='center'>
          {confirmTitle ??
            translate('buttons.confirm', 'Xác nhận rằng bạn muốn xoá?')}
        </PopoverHeader>
        <PopoverBody
          display='flex'
          justifyContent='center'>
          <HStack>
            <Button
              onClick={() => setOpened(false)}
              size='sm'>
              {confirmCancelText ??
                translate('buttons.cancel', ButtonText('cancel'))}
            </Button>
            <Button
              colorScheme='red'
              onClick={onConfirm}
              autoFocus
              size='sm'>
              {confirmOkText ??
                translate('buttons.delete', ButtonText('delete'))}
            </Button>
          </HStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
