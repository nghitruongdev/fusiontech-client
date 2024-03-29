/** @format */

'use client'

import {
  useShow,
  IResourceComponentsProps,
  useOne,
  useList,
} from '@refinedev/core'
import { NumberField, TagField, TextField } from '@refinedev/chakra-ui'
import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  HStack,
  Heading,
  Image,
  Input,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  TableCaption,
  Tabs,
  Tbody,
  Td,
  Text,
  Textarea,
  Tfoot,
  Th,
  Thead,
  Tr,
  ButtonGroup,
} from '@chakra-ui/react'
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useTable } from '@refinedev/react-table'
import { useHeaders } from '@/hooks/useHeaders'
import { ColumnDef } from '@tanstack/react-table'
import { List } from '@refinedev/chakra-ui'
import { TableContainer, Table } from '@chakra-ui/react'
import { IProduct, IVariant } from 'types'
import { API } from 'types/constants'
import { useDefaultTableRender } from '@/hooks/useRenderTable'
import { cleanUrl, updateUrlParams } from '@/lib/utils'
import { PropsWithChildren } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Rating } from '@smastrom/react-rating'
import { BiChevronDownCircle } from 'react-icons/bi'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Show } from '@components/crud'
import {
  CreateButton,
  EditButton,
  ListButton,
  RefreshButton,
} from '@components/buttons'
import { variantTableColumns as columns } from 'app/admin/variants/(list)/columns'
import { DeleteProductButton } from '../../(form)/DeleteProductButton'
import { useAuthUser } from '@/hooks/useAuth/useAuthUser'

const ProductShowPage = () => {
  return (
    <>
      <ContextProvider>
        <ProductShow />
      </ContextProvider>
    </>
  )
}

const ProductShow: React.FC<IResourceComponentsProps> = () => {
  const {
    queryResult: { isLoading },
    record,
    tabIndex,
    handleTabChange,
  } = useContextProvider()
  const { resource } = API['variants']()
  return (
    <Show
      isLoading={isLoading}
      headerButtons={({
        editButtonProps,
        listButtonProps,
        refreshButtonProps,
        deleteButtonProps,
      }) => {
        return (
          <ButtonGroup>
            <ListButton {...listButtonProps} />
            {tabIndex === 0 && (
              <>
                <EditButton {...editButtonProps} />
                <DeleteProductButton
                  {...deleteButtonProps}
                  productId={record?.id}
                />
              </>
            )}

            <RefreshButton {...refreshButtonProps} />
          </ButtonGroup>
        )
      }}>
      <Tabs
        variant={'solid-rounded'}
        index={tabIndex}
        onChange={handleTabChange}>
        <div className='flex justify-between'>
          <TabList>
            <Tab>Sản phẩm</Tab>
            <Tab>Phiên bản sản phẩm</Tab>
          </TabList>
          {tabIndex === 1 && (
            <CreateButton
              resource={resource}
              meta={{
                query: {
                  product: 1,
                },
              }}>
              Thêm
            </CreateButton>
          )}
        </div>
        <div>
          <TabPanels>
            <TabPanel>
              <ProductInfo />
            </TabPanel>
            <TabPanel>
              <VariantListByProduct />
            </TabPanel>
          </TabPanels>
        </div>
      </Tabs>
    </Show>
  )
}

const ProductInfo = () => {
  const { record } = useContextProvider()
  return (
    <>
      <div className='bg-white'>
        <Grid
          templateRows='repeat(1, 1fr)'
          templateColumns='repeat(3, 1fr)'
          gap={4}>
          <GridItem
            rowSpan={2}
            colSpan={1}>
            <Flex
              justify='center'
              alignItems='center'
              flexDirection='column'
              p={3}>
              <Box
                mb={8}
                className='overflow-x-auto shadow-bannerShadow sm:rounded-lg'>
                {/*https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fvariants%2FlogostuImage.png?alt=media&token=90709f04-0996-4779-ab80-f82e99c62041*/}

                <Image
                  src={record?.images?.[0] ?? ''}
                  alt={record?.images?.[0] ?? ''}
                  width={200}
                  height={200}
                  style={{
                    width: '200px',
                    height: '200px',
                    objectFit: 'contain',
                  }}
                  className='shadow-lg rounded-lg'
                />
              </Box>

              <ProductInfo.AvgRating />
              <ProductInfo.ReviewCount />
            </Flex>
          </GridItem>
          <GridItem
            rowSpan={2}
            colSpan={5}>
            <Box
              p={4}
              mb={10}>
              <Flex>
                <ProductInfo.Id />
                <ProductInfo.Name />
              </Flex>
              <ProductInfo.Summary />
              <ProductInfo.Features />
            </Box>
          </GridItem>
          <GridItem
            rowSpan={2}
            colSpan={6}
            pr={4}>
            <ProductInfo.Description />
          </GridItem>
        </Grid>
      </div>
    </>
  )
}

ProductInfo.Id = function Id() {
  const { record } = useContextProvider()

  return (
    <Box
      mb='10'
      mr='10'>
      <Box pos='relative'>
        <div>
          <Text
            top='-15px'
            left='5px'
            p='0 12px'
            bg='#fff'
            transformOrigin='top left'
            transition='all .2s ease-out'
            color='#999'
            pointerEvents='none'
            pos='absolute'
            w='fit-content'
            h='fit-content'
            fontWeight='bold'
            zIndex='2'>
            Id
          </Text>
          <Input
            fontWeight='medium'
            value={record?.id ?? ''}
          />
        </div>
      </Box>
    </Box>
  )
}

ProductInfo.Name = function NameInfo() {
  const { record } = useContextProvider()

  return (
    <Box mb='5'>
      <Box pos='relative'>
        <div>
          <Text
            top='-15px'
            left='5px'
            p='0 12px'
            bg='#fff'
            transformOrigin='top left'
            transition='all .2s ease-out'
            color='#999'
            pointerEvents='none'
            pos='absolute'
            w='fit-content'
            h='fit-content'
            fontWeight='bold'
            zIndex='2'>
            Tên
          </Text>
          <Input
            className='font-bold '
            fontWeight='medium'
            value={record?.name ?? ''}
          />
        </div>
      </Box>
    </Box>
  )
}

ProductInfo.ReviewCount = function ReviewCount() {
  const { record } = useContextProvider()

  return (
    <Box mb='10'>
      <Box pos='relative'>
        <div>
          <Text
            top='-15px'
            left='5px'
            p='0 12px'
            bg='#fff'
            transformOrigin='top left'
            transition='all .2s ease-out'
            color='#999'
            pointerEvents='none'
            pos='absolute'
            w='fit-content'
            h='fit-content'
            fontWeight='bold'
            zIndex='2'>
            Số lượng lượt đánh giá
          </Text>
          <Input
            textAlign='center'
            fontWeight='medium'
            value={record?.reviewCount ?? ''}
          />
        </div>
      </Box>
    </Box>
  )
}

ProductInfo.AvgRating = function AvgRating() {
  const { record } = useContextProvider()

  return (
    <Box mb='5'>
      <Box pos='relative'>
        <Flex alignItems='center'>
          <Rating
            style={{ maxWidth: 180 }}
            value={
              typeof record?.avgRating === 'number'
                ? parseInt(record?.avgRating.toString())
                : 0
            }
            readOnly
          />
          {/* <NumberField value={record?.reviewCount ?? ""} /> */}
        </Flex>
      </Box>
    </Box>
  )
}

ProductInfo.Summary = function Summary() {
  const { record } = useContextProvider()

  return (
    <Box mb='10'>
      <Box pos='relative'>
        <div>
          <Text
            top='-15px'
            left='5px'
            p='0 12px'
            bg='#fff'
            transformOrigin='top left'
            transition='all .2s ease-out'
            color='#999'
            pointerEvents='none'
            pos='absolute'
            w='fit-content'
            h='fit-content'
            fontWeight='bold'
            zIndex='2'>
            Mô tả sản phẩm
          </Text>
          <Textarea
            fontWeight='medium'
            h='150px'
            value={record?.summary ?? ''}
          />
        </div>
      </Box>
    </Box>
  )
}
ProductInfo.Features = function Features() {
  const { record } = useContextProvider()

  return (
    <Box>
      <Box pos='relative'>
        <Text
          top='-15px'
          left='5px'
          p='0 12px'
          bg='#fff'
          transformOrigin='top left'
          transition='all .2s ease-out'
          color='#999'
          pointerEvents='none'
          pos='absolute'
          w='fit-content'
          h='fit-content'
          fontWeight='bold'
          zIndex='2'>
          Tính năng nổi bật
        </Text>
        <div className='overflow-x-auto overflow-y-auto shadow-bannerShadow sm:rounded-lg max-h-[310px]'>
          <Table
            className='w-full normal-case text-base text-left '
            fontWeight='medium'>
            <Tbody>
              {record?.features?.map((feature, index) => (
                <Tr key={index}>
                  <Td>
                    <TextField value={feature} />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </div>
      </Box>
    </Box>
  )
}

ProductInfo.Description = function Description() {
  const { record } = useContextProvider()

  return (
    <Box mb='10'>
      <Box pos='relative'>
        <div>
          <Text
            top='-15px'
            left='5px'
            p='0 12px'
            bg='#fff'
            transformOrigin='top left'
            transition='all .2s ease-out'
            color='#999'
            pointerEvents='none'
            pos='absolute'
            w='fit-content'
            h='fit-content'
            fontWeight='bold'
            zIndex='2'>
            Bài đăng
          </Text>
          <Textarea
            fontWeight='medium'
            h='120px'
            value={record?.description ?? ''}
          />
        </div>
      </Box>
    </Box>
  )
}

const VariantListByProduct: React.FC<IResourceComponentsProps> = () => {
  const {
    record: product,
    tabIndex,
    variantTable: { headers, body },
  } = useContextProvider()

  return (
    <TableContainer
      whiteSpace='pre-line'
      w={'100%'}
      overflowWrap='break-word'
      objectFit='contain'
      overflowX='hidden'>
      <Table variant='simple'>
        {headers}
        {body}
      </Table>
    </TableContainer>
  )
}

type State = {
  record: IProduct | undefined
  tabIndex: number
  handleTabChange: (index: number) => void
  variantTable: {
    headers: JSX.Element | JSX.Element[]
    body: JSX.Element | JSX.Element[]
  }
} & ReturnType<typeof useShow<IProduct>>

const Context = createContext<State | null>(null)
const useContextProvider = () => {
  const ctx = useContext(Context)
  if (!ctx) throw new Error('Context Provider is missing')
  return ctx
}

const ContextProvider = ({ children }: PropsWithChildren) => {
  const showProps = useShow<IProduct>()
  const { data: { data: record } = {} } = showProps.queryResult

  const { getAuthHeader } = useHeaders()
  const { replace, push } = useRouter()
  const params = useSearchParams()
  const pathname = usePathname()

  const tabParam = params.get('tab')
  const [tabIndex, setTabIndex] = useState<number>(
    tabParam && tabParam == '1' ? 1 : 0,
  )

  const syncUrl = (index: number) => {
    const values = {
      tab: `${index}`,
    }
    const updateParams = updateUrlParams(values, params)
    const search = updateParams ? `?${updateParams}` : ''
    const url = `${pathname}${search}`
    // push(url);
  }

  const handleTabChange = (index: number) => {
    setTabIndex(() => index)
    // syncUrl(index);
  }

  const {
    resource,
    projection: { withSpecs: projection },
  } = API['variants']()
  const {
    getHeaderGroups,
    getRowModel,
    setOptions,
    refineCore: {
      tableQueryResult: { data: tableData },
    },
  } = useTable<IVariant>({
    columns,
    refineCoreProps: {
      resource,
      pagination: {
        mode: 'off',
      },
      queryOptions: {
        enabled: !!record,
      },
      meta: {
        url: cleanUrl(record?._links?.variants.href ?? ''),
        query: {
          projection,
        },
        headers: {
          ...getAuthHeader(),
        },
      },
    },
  })

  setOptions((prev) => ({
    ...prev,
    meta: {
      ...prev.meta,
    },
  }))

  const { headers, body } = useDefaultTableRender({
    rowModel: getRowModel(),
    headerGroups: getHeaderGroups(),
  })

  return (
    <Context.Provider
      value={{
        ...showProps,
        record,
        tabIndex,
        handleTabChange,
        variantTable: {
          headers,
          body,
        },
      }}>
      {children}
    </Context.Provider>
  )
}

export default ProductShowPage
