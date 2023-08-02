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
import { IAttribute, ISpecification, IVariant, Option } from 'types'
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
    variantRecords: Record<number, Record<string, ISpecification>>
    selected: Record<string, string>
    setSelected: (option: ISpecification) => void
    setGroups: (groups: StoreProps['groups']) => void
    setVariantRecords: (variants: IVariant[]) => void
    validSpecs: Record<string, string[]>
    removeSelected: (name: string) => void
}

export const useOptionStore = create(
    immer<StoreProps>((set, get) => ({
        groups: {},
        variantRecords: {},
        selected: {},
        validSpecs: {},
        removeSelected: (name) => {
            set(({ selected }) => {
                delete selected[name]
            })
            const { variantRecords, selected } = get()
            const validSpecs = getValidSpecs(variantRecords, selected)
            set(() => ({ validSpecs }))
        },
        setSelected: ({ name, value }) => {
            const { selected, variantRecords } = get()
            const updateSelected = Object.assign({}, selected)
            updateSelected[name] = value
            let validSpecs = getValidSpecs(variantRecords, updateSelected)

            if (!Object.keys(validSpecs).length) {
                const newSelected: typeof selected = {}
                newSelected[name] = value
                validSpecs = getValidSpecs(variantRecords, newSelected)
                set(() => ({ validSpecs, selected: newSelected }))
                return
            }

            set(({ selected }) => {
                selected[name] = value
            })
            set(() => ({ validSpecs }))

            // Object.entries(selected).forEach(([name, value]) => {
            //     const isSelectedInvalid = validSpecs[name]?.every(validVal => validVal !== value)
            //     if (isSelectedInvalid) {
            //         set(({ selected }) => {
            //             console.log('selected', selected)
            //             delete selected[name]
            //             console.log('selected', selected)
            //         })
            //     }
            // })
        },

        setGroups: (groups: StoreProps['groups']) => set(() => ({ groups })),
        setVariantRecords: (variants: IVariant[]) => {
            const record: Record<number, Record<string, ISpecification>> = {}
            variants?.forEach(va => {
                const specRecord = toRecord(va.specifications ?? [], 'name')
                record[va.id] = specRecord
            })
            const validSpecs = getValidSpecs(record, {})
            set(() => ({ variantRecords: record, validSpecs, selected: {} }))
        }
    })),
)

const getValidSpecs = (variantRecord: StoreProps['variantRecords'], selected: StoreProps['selected']) => {
    const availableVariants = Object.keys(variantRecord)?.filter((id) => Object.keys(selected).every(name => variantRecord[+id]?.[name]?.value === selected[name])).map(id => +id)
    const availableSpecs = availableVariants?.flatMap((id) => Object.entries(variantRecord[id] ?? {}))

    const record: Record<string, string[]> = {}
    availableSpecs.forEach(([name, value]) => {
        if (!record[name]) record[name] = []
        record[name]?.push(value.value)
    })
    return record
}

export const ProductOptions = () => {
    const { getSpecificationsByProduct } = API['products']()
    const setGroups = useOptionStore((state) => state.setGroups)
    const setVariantRecord = useOptionStore((state) => state.setVariantRecords)
    const {
        variants: { data: variants, status },
        product
    } = useProductContext()

    const { data: { data } = {} } = useCustom<{ name: string, values: ISpecification[] }[]>({
        url: getSpecificationsByProduct(product?.id ?? ""),
        method: 'get',
        queryOptions: {
            enabled: !!product
        }
    })
    useEffect(() => {
        if (!data) return
        const names: OptionGroup[] = data.sort((a, b) => a.name.localeCompare(b.name)).map(group => ({ ...group, values: toRecord(group.values, 'value') }))

        setGroups(toRecord(names, 'name'))
    }, [data, setGroups])

    useEffect(() => {
        setVariantRecord(variants ?? [])
    }, [variants, setVariantRecord])

    if (!variants) return <>No data found</>

    return (
        <div className="my-2 ">
            <GroupList />
        </div>
    )
}

const GroupList = () => {
    const { variants: { data: variants } } = useProductContext()
    const groups = useOptionStore((state) => state.groups)

    return (
        <div className='grid gap-2'>
            {Object.values(groups).map((group) =>
                <OptionGroup key={group.name} group={group} />
            )}
        </div>
    )
}

export const OptionGroup = ({
    group: { name, values },
}: {
    group: OptionGroup
}) => {
    const toast = useToast()
    const [selected, setSelected, validSpecs, removeSelected] = useOptionStore((state) => [
        state.selected,
        state.setSelected,
        state.validSpecs,
        state.removeSelected
    ])

    const handleChange = (value: string) => {
        const selectedVal = values[value]
        if (!selectedVal) return
        selected[name] !== value ? setSelected(selectedVal) : removeSelected(name)
    }

    const { value, getRadioProps, getRootProps } = useRadioGroup({
        onChange: handleChange,
        // value: selected[name],
    })
    const isValid = (value: string) => Object.keys(selected)[0] === name || validSpecs[name]?.some(validVal => validVal === value)
    return (
        <Stack {...getRootProps()}>
            <div key={name}>
                <p className="font-medium text-sm mb-2">{name}:</p>
                <div className="flex gap-2 flex-wrap">
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
        <Tooltip label={state.isDisabled ? "Tuỳ chọn không khả dụng" : ""}>
            <chakra.label {...htmlProps} cursor="pointer">
                <input {...getInputProps({})} hidden />

                <Badge
                    {...getRadioProps()}
                    variant={'outline'}
                    aria-disabled
                    className={cn(
                        `p-2 text-sm rounded-md font-medium min-w-[100px] border-zinc-300 text-zinc-700 flex justify-center cursor-pointer  hover:bg-blue-50 hover:text-blue-700 hover:border-blue-600`,
                        state.isChecked && 'bg-blue-100',
                        state.isDisabled && 'bg-gray-100 text-zinc-500 cursor-not-allowed hover:bg-gray-50 hover:text-gray-500 hover:border-zinc-300'
                    )}
                    onClick={(e) => {
                        if (!state.isChecked) return
                        removeSelected(option.name)
                        e.preventDefault()

                    }}
                >
                    {option.value}
                    <input type="hidden" />
                </Badge>
            </chakra.label>
        </Tooltip >

    )
}
