import { Callback, checkIsCallback } from '@/lib/callback'
import { useConst } from '@chakra-ui/react'
import { BaseRecord, HttpError, useList } from '@refinedev/core'
import { UseListProps } from '@refinedev/core/dist/hooks/data/useList'
import { CloudCog } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Option } from 'types'
import { toOption } from '../lib/utils'

/**
 *
 * T - resource to fetch, K: type of key of option, V: typeof value of option
 * @param toOption: convert an item in the list to an option
 * @returns
 */
export type ListOptionProps<T extends BaseRecord, V = T> = {
  toOption: Callback<(item: T) => Option<V>>
}
function useListOption<T extends BaseRecord, V = T>({
  toOption,
  ...props
}: UseListProps<T, HttpError, T> & ListOptionProps<T, V>) {
  const { data: { data = [] } = {} } = useList<T>(props)

  useEffect(() => {
    console.count('toOptions trigger rerendered')
    checkIsCallback(toOption)
  }, [toOption])
  const options = useMemo(() => data.map(toOption), [data, toOption])
  return {
    options,
  }
}
export default useListOption
