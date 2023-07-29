'use client'
import {
  Stack,
  chakra,
  useRadio,
  useRadioGroup,
  UseRadioProps,
  useToast,
} from '@chakra-ui/react'
import { useProductContext } from './product-client'
import { toRecord } from '@/lib/utils'
import { IAttribute } from 'types'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { useEffect } from 'react'
import { Badge } from '@components/ui/shadcn/badge'
import { cn } from 'components/lib/utils'

type OptionGroup = {
  name: string
  values: Record<keyof IAttribute, IAttribute>
}

export const ProductOptions = () => {
  const {
    variants: { data: variants, status },
  } = useProductContext()

  useEffect(() => {
    if (!variants) return

    const getAttributeByName = (name: string, attributes: IAttribute[]) => {
      const filtered = attributes.filter((attr) => attr.name === name)
      const record = toRecord(filtered, 'value')
      return Object.values(record).sort((a, b) =>
        a.value.localeCompare(b.value),
      )
    }
    const attributes = [] as any[]
    throw new Error('Attribute is deprecated')
    // const attributes = variants.flatMap((item) => item.attributes ?? []);
    const names = [...new Set(attributes.map((item) => item.name))].sort(
      (a, b) => a.localeCompare(b),
    )
    const groups: Record<string, OptionGroup['values']> = {}

    names.forEach(
      (name) =>
        (groups[name] = toRecord(
          getAttributeByName(name, attributes),
          'value' as keyof IAttribute,
        )),
    )
    setGroups(groups)
  }, [variants])

  if (!variants) return <>No data found</>

  return (
    <div className="my-2 ">
      <GroupList />
    </div>
  )
}

const GroupList = () => {
  const groups = useOptionStore((state) => state.groups)
  const selected = useOptionStore((state) => state.selected)
  console.log('groups', groups)
  console.count('group list rendered')
  return (
    <>
      {Object.keys(groups).map((name) => (
        <OptionGroup group={{ name, values: groups[name] ?? {} }} key={name} />
      ))}
    </>
  )
}

export const OptionGroup = ({
  group: { name, values },
}: {
  group: OptionGroup
}) => {
  const toast = useToast()
  const [selected, setSelected] = useOptionStore((state) => [
    state.selected,
    state.setSelected,
  ])
  const handleChange = (value: string) => {
    setSelected(values[value as keyof IAttribute])
    toast({
      title: value,
      description: JSON.stringify(selected),
    })
  }

  const { value, getRadioProps, getRootProps } = useRadioGroup({
    // defaultValue: values[0]?.value ?? "",
    onChange: handleChange,
    value: selected[name],
  })

  return (
    <Stack {...getRootProps()}>
      <div key={name}>
        <p className="font-medium text-sm mb-2">{name}:</p>
        <div className="flex gap-2 flex-wrap">
          {Object.values(values).map((item) => {
            return (
              <OptionRadio
                option={item}
                key={item.value}
                {...getRadioProps({ value: item.value })}
              />
            )
          })}
        </div>
      </div>
    </Stack>
  )
}
type RadioProps = {
  option: IAttribute
} & UseRadioProps

const OptionRadio = ({ option, ...props }: RadioProps) => {
  const { state, getInputProps, getRadioProps, htmlProps, getLabelProps } =
    useRadio(props)

  return (
    <chakra.label {...htmlProps} cursor="pointer">
      <input {...getInputProps({})} hidden />
      <Badge
        {...getRadioProps()}
        variant={'outline'}
        className={cn(
          `p-2 text-sm rounded-md font-medium min-w-[100px] border-zinc-300 text-zinc-700 flex justify-center cursor-pointer  hover:bg-blue-50 hover:text-blue-700 hover:border-blue-600`,
          state.isChecked && 'bg-blue-100',
        )}
      >
        {option.value}
        <input type="hidden" />
      </Badge>
      {/* </Box> */}
    </chakra.label>
  )
}

type StoreProps = {
  groups: Record<string, Record<string, IAttribute>>
  selected: Record<string, string>
  setSelected: (option: IAttribute) => void
}

export const useOptionStore = create(
  immer<StoreProps>((set, get) => ({
    groups: {},
    selected: {},
    setSelected: ({ name, value }) =>
      set(({ selected }) => {
        selected[name] = value
      }),
  })),
)

const setGroups = (groups: StoreProps['groups']) =>
  useOptionStore.setState(() => ({ groups }))
