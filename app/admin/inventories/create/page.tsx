/** @format */

'use client'
import { IResourceComponentsProps, useSelect } from '@refinedev/core'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Select,
  Button,
  Heading,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CloseButton,
  useDisclosure,
  Box,
  SlideFade,
  Collapse,
} from '@chakra-ui/react'
import { useForm } from '@refinedev/react-hook-form'
import { IInventory, IInventoryDetail, IVariant } from 'types'
import React, { useState } from 'react'
import { Inbox, PlusCircle } from 'lucide-react'
import { FieldValue } from 'react-hook-form'
import { Create } from '@components/crud'
import { SaveButton } from '@components/buttons'
import { InventoryForm } from '../(form)'

export default function CreatePage() {
  //   return <InventoryCreate />
  return <InventoryForm action='create' />
}

export const InventoryCreate: React.FC<IResourceComponentsProps> = () => {
  const {
    refineCore: { formLoading, onFinish },
    register,
    setValue,
  } = useForm<IInventoryDetail>()
  const [items, setItems] = useState<IInventoryDetail[]>([])

  const {
    isOpen: isVisible,
    onClose,
    onOpen,
  } = useDisclosure({ defaultIsOpen: false })

  register('items', {
    required: true,
  })
  const addItemHandler = (item: IInventoryDetail) => {
    console.log('item', item)
    setItems((prev) => [...prev, item])
    setValue('items', items)
  }

  const submitHandler = () => {
    if (!!!items.length) {
      onOpen()
      return
    }
    onFinish({ items: items })
  }

  return (
    <>
      <Create
        isLoading={formLoading}
        headerButtons={({}) => <SaveButton onClick={submitHandler} />}
        saveButtonProps={{ hidden: true }}
        contentProps={{ minH: '550px' }}>
        <div className='border shadow-md my-4 p-4 rounded-md'>
          <InventoryDetailForm addItem={addItemHandler} />
        </div>
        <hr className='my-2' />
        <Heading
          as='h2'
          size='md'
          mt='4'>
          Bảng chi tiết
        </Heading>
        <Collapse
          in={isVisible}
          animateOpacity>
          <Alert
            status='warning'
            rounded='md'
            my='4'>
            <AlertIcon />
            <Box flexGrow='1'>
              <AlertTitle>Cảnh báo!</AlertTitle>
              <AlertDescription>
                Bạn chưa thêm danh sách sản phẩm nhập hàng.
              </AlertDescription>
            </Box>
            <CloseButton
              onClick={onClose}
              alignSelf='flex-start'
              top='-1'
              right='-1'
            />
          </Alert>
        </Collapse>
        {isVisible && <></>}
        <DetailTable items={items} />
      </Create>
    </>
  )
}

const InventoryDetailForm = ({
  addItem,
}: {
  addItem: (item: IInventoryDetail) => void
}) => {
  const {
    register,
    formState: { errors },
    resetField,
    getValues,
    trigger,
  } = useForm<IInventoryDetail>({})

  const { options: variantOptions } = useSelect<IVariant>({
    resource: 'variants',
    optionLabel: 'id',
    optionValue: 'id',
    pagination: {
      mode: 'off',
    },
  })

  React.useEffect(() => {
    resetField('variantId')
  }, [variantOptions, resetField])

  const submitHandler = async () => {
    const result = await trigger(undefined, {
      shouldFocus: true,
    })
    if (result) {
      addItem(getValues() as IInventoryDetail)
    }
  }

  return (
    <div className='flex gap-2'>
      <div className='grid grid-cols-3 gap-4 flex-grow'>
        <FormControl
          mb='3'
          isInvalid={!!errors?.variantId}>
          <FormLabel>Variant</FormLabel>
          <Select
            placeholder='Select variant'
            {...register('variantId', {
              required: 'This field is required',
            })}>
            {variantOptions?.map((option) => (
              <option
                value={option.value}
                key={option.value}>
                {option.label}
              </option>
            ))}
            {!!!variantOptions.length && (
              <option value={1}>Sản phẩm thứ nhất</option>
            )}
          </Select>
          <FormErrorMessage>
            {(errors as any)?.variantId?.message as string}
          </FormErrorMessage>
        </FormControl>
        <FormControl
          mb='3'
          isInvalid={!!(errors as any)?.quantity}>
          <FormLabel>Quantity</FormLabel>
          <Input
            type='number'
            {...register('quantity', {
              required: 'This field is required',
              valueAsNumber: true,
            })}
          />
          <FormErrorMessage>
            {(errors as any)?.quantity?.message as string}
          </FormErrorMessage>
        </FormControl>
      </div>
      <div className='mt-8 px-4'>
        <Button
          className='text-zinc-600'
          onClick={submitHandler}
          leftIcon={<PlusCircle />}>
          Thêm
        </Button>
      </div>
    </div>
  )
}

const DetailTable = ({ items }: { items: IInventoryDetail[] }) => {
  return (
    <div className='border shadow-md rounded-md my-2 p-4'>
      <TableContainer>
        <Table variant='simple'>
          <TableCaption>
            Bảng chi tiết nhập hàng {new Date().toUTCString()}
          </TableCaption>
          <Thead>
            <Tr>
              <Th>Mã sản phẩm</Th>
              {/* <Th isNumeric>Giá nhập</Th> */}
              <Th isNumeric>Số lượng</Th>
              {/* <Th isNumeric>Thành tiền</Th> */}
            </Tr>
          </Thead>
          <Tbody>
            {!!!items.length && (
              <Tr>
                <Td colSpan={4}>
                  <div className='min-h-[300px] flex flex-col items-center justify-center'>
                    <Inbox className='text-muted-foreground w-20 h-20' />
                    <p className='text-muted-foreground'>Không có dữ liệu</p>
                  </div>
                </Td>
              </Tr>
            )}
            {items.map(({ variantId, quantity }, idx) => (
              <Tr key={idx}>
                <Td>{variantId}</Td>
                {/* <Td isNumeric>{price}</Td> */}
                <Td isNumeric>{quantity}</Td>
                {/* <Td isNumeric>{price * quantity}</Td> */}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  )
}
