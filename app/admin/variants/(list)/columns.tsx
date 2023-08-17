/** @format */

import { onDefaultSuccess, onError } from '@/hooks/useCrudNotification'
import { formatPrice } from '@/lib/utils'
import {
  Button,
  FormControl,
  HStack,
  Image,
  Switch,
  Tooltip,
} from '@chakra-ui/react'
import { DeleteButton, EditButton, ShowButton } from '@components/buttons'
import { useUpdate } from '@refinedev/core'
import { ColumnDef } from '@tanstack/react-table'
import { useRef, useState } from 'react'
import { FirebaseImage, IProduct, IVariant } from 'types'
import { API } from 'types/constants'
import { AppError } from 'types/error'

const { resource } = API['variants']()

const variantColumns: ColumnDef<IVariant>[] = [
  // {
  //   id: 'id',
  //   accessorKey: 'id',
  //   header: 'Id',
  // },
  {
    id: 'sku',
    accessorKey: 'sku',
    header: 'Mã SKU',
  },
  // {
  //   id: 'images',
  //   accessorKey: 'images',
  //   header: 'Hình ảnh',

  //   cell: function render({ getValue, row }) {
  //     return (
  //       <HStack>
  //         {getValue<FirebaseImage[]>()?.map((item, index) => (
  //           <Image
  //             src={item}
  //             key={index}
  //             sx={{ height: '50px', maxWidth: '100px' }}
  //             alt={`${row.getValue<string>('sku')}`}
  //           />
  //         ))}
  //       </HStack>
  //     )
  //   },
  // },
  {
    id: 'price',
    accessorKey: 'price',
    header: 'Giá tiền',
    cell: ({ getValue }) => <>{formatPrice(getValue<number>())}</>,
  },
  {
    id: 'availableQuantity',
    accessorKey: 'availableQuantity',
    header: 'Số lượng khả dụng',
    enableHiding: true,
    enableResizing: true,
    enablePinning: true,
  },
  {
    id: 'soldCount',
    accessorKey: 'soldCount',
    header: 'Số lượng đã bán',
    enableHiding: true,
    enableResizing: true,
    enablePinning: true,
  },
  {
    id: 'active',
    accessorKey: 'active',
    header: 'Ẩn/ hiện',
    cell: function render({ getValue, row }) {
      return (
        <ActiveToggle
          defaultValue={getValue<boolean>()}
          id={row.getValue<number>('id')}
        />
      )
    },
  },
  {
    id: 'actions',
    accessorKey: 'actions',
    header(props) {
      return <p className='text-center'>Menu</p>
    },
    cell: function render({ getValue }) {
      return (
        <HStack pos={'relative'}>
          <ShowButton
            resource={resource}
            hideText
            recordItemId={getValue() as string}
          />
          <EditButton
            resource={resource}
            hideText
            recordItemId={getValue() as string}
          />
          <Tooltip label={'Chỉ có thể xoá những bán thể chưa được bán'}>
            <DeleteButton
              resource={resource}
              hideText
              recordItemId={getValue() as string}
            />
          </Tooltip>
        </HStack>
      )
    },
  },
]

const ActiveToggle = ({
  defaultValue,
  id,
}: {
  defaultValue: boolean
  id: number
}) => {
  const { mutateAsync, isLoading } = useUpdate<IVariant, AppError>()
  const [active, setActive] = useState<boolean>(defaultValue)
  return (
    <FormControl
      display='flex'
      alignItems='center'>
      <Switch
        id='show-hide-product'
        checked={active}
        isChecked={active}
        isDisabled={isLoading}
        onChange={() => {
          mutateAsync(
            {
              resource,
              id,
              values: { active: !active },
              invalidates: false as unknown as any,
              errorNotification: onError,
              successNotification: onDefaultSuccess('Cập nhật thành công'),
            },
            {
              onSuccess() {
                setActive((prev) => !prev)
              },
            },
          )
        }}
      />
    </FormControl>
  )
}
export { variantColumns as variantTableColumns }
