/** @format */

'use client'
import { IOrderStatus, ProblemDetail } from 'types'
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
import SelectPopout from '@components/ui/SelectPopout'
import ReactSelect from 'react-select'
import { Select } from '@chakra-ui/react'
export const OrderStatus = ({
  status,
  control,
}: {
  status: IOrderStatus
  control: React.ReactNode
}) => {
  return (
    <Editable
      value={status.detailName}
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
            'Content-Type': 'application/json',
          },
        },
        errorNotification: onError,
        successNotification: onSuccess,
      },
      {
        onSuccess: () => {
          submitProps().onClick?.(event)
        },
      },
    )
  }

  //   if (isEditing)
  //     return (
  //       <>
  //         <ReactSelect
  //           options={options}
  //           onChange={() => {}}
  //           className={`absolute z-50`}
  //           defaultValue={options.find((item) => item.value.id === status.id)}
  //         />
  //         {/* <Select
  //           as={ReactSelect}
  //           options={options}
  //         /> */}
  //         <ButtonGroup
  //           justifyContent='end'
  //           size='sm'
  //           w='full'
  //           spacing={2}
  //           mt={2}>
  //           <IconButton
  //             aria-label={''}
  //             icon={!isLoading ? <Check /> : <Loader />}
  //             {...submitProps()}
  //             onClick={(event) => {
  //               submitHandler(event)
  //             }}
  //           />
  //           <CloseButton {...getCancelButtonProps()} />
  //         </ButtonGroup>
  //       </>
  //     )
  if (isEditing)
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

export const statusColor = (status: IOrderStatus | undefined) => {
  switch (status?.group) {
    case 'CANCELLED':
      return 'red'
    case 'VERIFY':
      return 'gray'
    case 'PROCESSING':
      return 'orange'
    case 'ON_DELIVERY':
      return 'linkedin'
    case 'COMPLETED':
      return 'green'
    case 'FAILED':
      return 'purple'
  }
}
