/** @format */

'use client'
import {
  Stack,
  chakra,
  useRadio,
  useRadioGroup,
  UseRadioProps,
  useToast,
  Tooltip,
} from '@chakra-ui/react'
import { useProductContext } from './product-client'
import { toRecord } from '@/lib/utils'
import { ISpecification, IVariant, Option } from 'types'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { useEffect, useMemo } from 'react'
import { Badge } from '@components/ui/shadcn/badge'
import { cn } from 'components/lib/utils'
import { API } from 'types/constants'
import { useCustom } from '@refinedev/core'

type OptionGroup = {
  name: string
  values: Record<string, ISpecification>
}

type StoreProps = {
  groups: Record<string, OptionGroup>
  validVariants: Record<number, IVariant>
  variants: IVariant[]
  variantSpecifications: Record<number, Record<string, ISpecification>>
  selected: Record<string, string>
  setSelected: (option: ISpecification) => void
  removeSelected: (name: string) => void
  setGroups: (groups: StoreProps['groups']) => void
  setVariants: (variants: IVariant[]) => void
  validSpecs: Record<string, string[]>
  getSelectedVariant: () => [IVariant | undefined, boolean]
}

export const useOptionStore = create<StoreProps>()(
  immer((set, get) => {
    const getValid = (
      selected: StoreProps['selected'],
      specRecords?: StoreProps['variantSpecifications'],
    ) => {
      const validSpecs = Object.entries(
        specRecords ?? get().variantSpecifications,
      )
        .filter(([, specs]) =>
          Object.entries(selected).every(
            ([selectedName, selectedvalue]) =>
              specs[selectedName]?.value === selectedvalue,
          ),
        )
        .flatMap(([, variantSpecs]) => Object.entries(variantSpecs))
        .reduce((record, [name, { value }], idx) => {
          if (!record[name]) record[name] = []
          record[name]?.push(value)
          return record
        }, {} as Record<string, string[]>)
      for (const key of Object.keys(validSpecs)) {
        validSpecs[key] = [...new Set(validSpecs[key])]
      }
      return validSpecs
    }

    const getValidSpecs = ({
      addSpec,
      removeSpec,
    }: {
      addSpec?: ISpecification
      removeSpec?: string
    } = {}) => {
      const updateSelected = { ...get().selected }
      if (addSpec) updateSelected[addSpec.name] = addSpec.value
      if (removeSpec) delete updateSelected[removeSpec]
      return getValid(updateSelected)
    }

    const addSelected = (addSpec: ISpecification) => {
      let valid = getValidSpecs({ addSpec })
      if (!Object.keys(valid).length) {
        set((state) => {
          state.selected = {}
        })
        valid = getValidSpecs({ addSpec })
      }
      set((state) => {
        const { name, value } = addSpec
        state.selected[name] = value
        state.validSpecs = valid
      })
    }

    const removeSelected = (name: string) => {
      const valid = getValidSpecs({ removeSpec: name })
      set((state) => {
        delete state.selected[name]
        state.validSpecs = valid
      })
    }

    const getSelectedVariant = (): [IVariant | undefined, boolean] => {
      const {
        groups,
        selected,
        variants,
        validVariants,
        variantSpecifications: specRecords,
      } = get()
      const groupLength = Object.keys(groups).length
      const selectedLength = Object.keys(selected).length
      const variantsLength = variants.length

      const isAddable = groupLength === selectedLength
      //   variantSpecValue === undefined ||
      const variant = Object.entries(validVariants).find(([id, variant]) => {
        return Object.entries(groups).every(([name]) => {
          const variantSpecValue = specRecords[+id]?.[name]?.value
          return variantSpecValue === selected[name]
        })
      })
      return [variant?.[1], isAddable]
    }

    return {
      groups: {},
      variants: [],
      validVariants: {},
      variantSpecifications: {},
      validSpecs: {},
      selected: {},
      setGroups: (newGroups) => {
        set((state) => {
          state.groups = newGroups
        })
      },
      setSelected: addSelected,
      removeSelected,

      setVariants: (variants: IVariant[]) => {
        const { groups } = get()
        console.log('groups', groups)
        const validVariants = variants.filter(
          (item) =>
            item.active &&
            !!item.availableQuantity &&
            Object.entries(groups).every(
              ([name]) =>
                !!item.specifications?.find((spec) => spec.name === name),
            ),
        )
        console.log('validVariants', validVariants)
        const record = validVariants.reduce(
          (record, { id, specifications = [] }) => {
            record[id] = toRecord(specifications, 'name')
            return record
          },
          {} as StoreProps['variantSpecifications'],
        )
        const validSpecs = getValid({}, record)

        set((state) => {
          state.variantSpecifications = record
          state.variants = variants
          state.validVariants = toRecord(validVariants, 'id')
          state.validSpecs = validSpecs
          state.selected = {}
        })
      },
      getSelectedVariant,
    }
  }),
)

export const ProductOptions = () => {
  const { getSpecificationsByProduct } = API['products']()
  const setGroups = useOptionStore((state) => state.setGroups)
  const setVariants = useOptionStore((state) => state.setVariants)
  const variantRecords = useOptionStore((state) => state.variantSpecifications)
  const {
    variants: { data: variants, status },
    product,
  } = useProductContext()

  //get specs by product
  const { data: { data } = {} } = useCustom<
    { name: string; values: ISpecification[] }[]
  >({
    url: getSpecificationsByProduct(product?.id ?? ''),
    method: 'get',
    queryOptions: {
      enabled: !!product,
      suspense: true,
    },
  })

  useEffect(() => {
    const updateGroups = () => {
      if (!data) return
      console.log('group data', data)
      console.log('variants', variants)
      const names: OptionGroup[] = data
        .sort((a, b) => a.name.localeCompare(b.name))
        // .filter(({ values }) => values.length > 1)
        .map((group) => ({ ...group, values: toRecord(group.values, 'value') }))
      setGroups(toRecord(names, 'name'))
    }
    updateGroups()
    setVariants(variants ?? [])
  }, [variants, setVariants, setGroups, data])

  if (!variants) return <></>

  return (
    <div className='my-2 '>
      <GroupList />
    </div>
  )
}

const GroupList = () => {
  const {
    variants: { data: variants },
  } = useProductContext()
  const groups = useOptionStore((state) => state.groups)

  return (
    <div className='grid gap-2'>
      {Object.values(groups).map((group) => (
        <OptionGroup
          key={group.name}
          group={group}
        />
      ))}
    </div>
  )
}

export const OptionGroup = ({
  group: { name, values },
}: {
  group: OptionGroup
}) => {
  const [selected, setSelected, removeSelected, validSpecs] = useOptionStore(
    ({ selected, setSelected, removeSelected, validSpecs }) => [
      selected,
      setSelected,
      removeSelected,
      validSpecs,
    ],
  )

  const handleChange = (value: string) => {
    const selectedVal = values[value]
    if (!selectedVal) return
    selected[name] !== value ? setSelected(selectedVal) : removeSelected(name)
  }

  const { value, getRadioProps, getRootProps } = useRadioGroup({
    onChange: handleChange,
    // value: selected[name],
  })
  const isValid = (value: string) =>
    validSpecs[name]?.some((valid) => value == valid)
  return (
    <Stack {...getRootProps()}>
      <div key={name}>
        <p className='font-medium text-sm mb-2'>{name}:</p>
        <div className='flex gap-2 flex-wrap'>
          {Object.values(values).map((item) => {
            return (
              <OptionRadio
                key={item.value}
                option={item}
                {...getRadioProps({ value: item.value })}
                isDisabled={!isValid(item.value)}
                isChecked={selected[name] === item.value}
              />
            )
          })}
        </div>
      </div>
    </Stack>
  )
}
type RadioProps = {
  option: OptionGroup['values'][string]
} & UseRadioProps

const OptionRadio = ({ option, ...props }: RadioProps) => {
  const { state, getInputProps, getRadioProps, htmlProps, getLabelProps } =
    useRadio(props)
  const toast = useToast()
  const [removeSelected] = useOptionStore((state) => [state.removeSelected])
  return (
    <Tooltip label={state.isDisabled ? 'Tuỳ chọn không khả dụng' : ''}>
      <chakra.label
        {...htmlProps}
        cursor='pointer'>
        <input
          {...getInputProps({})}
          hidden
        />

        <Badge
          {...getRadioProps()}
          variant={'outline'}
          aria-disabled
          className={cn(
            `p-2 text-sm rounded-md font-medium min-w-[100px] border-zinc-300 text-zinc-700 flex justify-center cursor-pointer  hover:bg-blue-50 hover:text-blue-700 hover:border-blue-600`,
            state.isChecked && 'bg-blue-100',
            state.isDisabled &&
              'bg-gray-100 text-zinc-500 pointer-events-none hover:bg-gray-50 hover:text-gray-500 hover:border-zinc-300',
          )}
          onClick={(e) => {
            if (!state.isChecked) return
            removeSelected(option.name)
            e.preventDefault()
          }}>
          {option.value}
          <input type='hidden' />
        </Badge>
      </chakra.label>
    </Tooltip>
  )
}
