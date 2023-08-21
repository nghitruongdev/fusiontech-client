/** @format */

'use client'
import {
  IOrderStatus,
  OrderStatus as OrderStatusType,
  OrderStatusText,
} from 'types'
import {
  Badge,
  useEditableControls,
  ButtonGroup,
  IconButton,
  CloseButton,
  Editable,
  EditablePreview,
  Tooltip,
} from '@chakra-ui/react'
import { useUpdate } from '@refinedev/core'
import { Check, Loader } from 'lucide-react'
import { useState, useEffect } from 'react'
import { onError, onSuccess } from '@/hooks/useCrudNotification'
import { Select } from '@chakra-ui/react'
import { useHeaders } from '@/hooks/useHeaders'
import { statusColor } from 'types/constants'
export const OrderStatus = ({
  status,
  control,
}: {
  status: IOrderStatus
  control: React.ReactNode
}) => {
  return (
    <Editable
      value={OrderStatusText[status.name as OrderStatusType].text}
      isPreviewFocusable={true}
      selectAllOnFocus={false}>
      <Tooltip
        label='Click để cập nhật'
        shouldWrapChildren={true}>
        <Badge
          as={EditablePreview}
          variant='outline'
          colorScheme={statusColor(status)}
          px='4'
          py='1'
          rounded='md'
        />
      </Tooltip>
      {control}
    </Editable>
  )
}

export const EditableControls = ({
  options,
  status,
  orderId,
}: {
  options: { label: string; value: IOrderStatus }[]
  status: IOrderStatus
  orderId: string
}) => {
  const { mutate, isLoading, isError, isSuccess } = useUpdate()
  const {
    isEditing,
    getSubmitButtonProps: submitProps,
    getCancelButtonProps,
    getEditButtonProps,
  } = useEditableControls()
  const [selectedStatus, setSelectedStatus] = useState<IOrderStatus>()
  const { getAuthHeader } = useHeaders()
  const findStatus = (name: string): IOrderStatus | undefined => {
    return options.find((option) => option.value.name === name)?.value
  }

  useEffect(() => {
    setSelectedStatus(status)
  }, [status])

  const onChangeHandler = (event: any) => {
    setSelectedStatus(findStatus(event.target.value))
  }

  const submitHandler = async (event: any) => {
    if (selectedStatus?.name === status.name) {
      submitProps().onClick?.(event)
      return
    }
    mutate(
      {
        resource: 'orders',
        id: orderId,
        values: selectedStatus?.name ?? '',
        meta: {
          headers: {
            // 'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
        },
        errorNotification: onError,
        successNotification: onSuccess.bind(null, 'edit'),
      },
      {
        onSuccess: () => {
          submitProps().onClick?.(event)
        },
      },
    )
  }
  if (!isEditing) return <></>
  return (
    <>
      <Select
        value={selectedStatus?.name ?? 'Đang tải...'}
        size='sm'
        variant='outline'
        rounded={'md'}
        onChange={onChangeHandler}>
        {options
          .filter((item) => item.value.id >= status.id)
          .map((item) => (
            <option
              key={item.label}
              value={item.value.name}>
              <Badge>{item.label}</Badge>
            </option>
          ))}
      </Select>
      <ButtonGroup
        justifyContent='end'
        size='sm'
        w='full'
        spacing={2}
        mt={2}>
        <IconButton
          aria-label={''}
          icon={!isLoading ? <Check /> : <Loader />}
          {...submitProps()}
          onClick={(event) => {
            submitHandler(event)
          }}
        />
        <CloseButton {...getCancelButtonProps()} />
      </ButtonGroup>
    </>
  )
}
