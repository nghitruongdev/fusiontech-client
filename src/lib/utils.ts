/** @format */

import {
  ReadonlyURLSearchParams,
  usePathname,
  useSearchParams,
} from 'next/navigation'
import { stringifyUrl } from 'query-string'
import { KeyboardEvent, useCallback, useMemo } from 'react'
import { Option } from 'types'
export const formatPrice = (amount?: number) => {
  if (!amount) return 0
  const formatted = new Number(amount).toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  })
  return formatted.replace(/\./g, ',')
}

export const toRecord = <T, K extends keyof T>(
  array: T[],
  key: K,
): Record<K, T> => {
  return array.reduce(function (acc, value) {
    acc[value[key] as K] = value
    return acc
  }, {} as Record<K, T>)
}

export const blurColorDataUrl = () => {
  // Pixel GIF code adapted from https://stackoverflow.com/a/33919020/266535
  const keyStr =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='

  const triplet = (e1: number, e2: number, e3: number) =>
    keyStr.charAt(e1 >> 2) +
    keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
    keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
    keyStr.charAt(e3 & 63)

  const rgbDataURL = (r: number, g: number, b: number) =>
    `data:image/gif;base64,R0lGODlhAQABAPAA${
      triplet(0, r, g) + triplet(b, 255, 255)
    }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`
  return rgbDataURL
}

export const useCurrentUrl = () => {
  const searchParams = useSearchParams()
  const pathName = usePathname()
  return useMemo(() => {
    const query = {} as any
    searchParams.forEach((value, key) => (query[key] = value))
    return stringifyUrl({ url: pathName, query })
  }, [pathName, searchParams])
}

export const useUrl = () => {
  const searchParams = useSearchParams()
  const pathName = usePathname()
  const updateParam = useCallback(
    (params: Record<string, any>) => {
      const query = Array.from(searchParams)
        .concat(Object.entries(params))
        .reduce((acc, [key, value]) => {
          acc[key] = value
          return acc
        }, {} as typeof params)
      return stringifyUrl({ url: pathName, query })
    },
    [searchParams, pathName],
  )
  return {
    updateParam,
  }
}
export const cleanUrl = (dirtyUrl: string) => {
  return dirtyUrl.replace(/{.*}/, '')
}

export const updateUrlParams = (
  params: Record<string, string>,
  current: ReadonlyURLSearchParams,
) => {
  const update = new URLSearchParams(Array.from(current.entries())) // -> has to use this form

  Object.keys(params).forEach((key) => {
    if (!params[key]) {
      update.delete(key)
    } else {
      update.set(key, params[key] ?? '')
    }
  })

  return update.toString()
}

/**
 *
 * @param array
 * @param label
 * @param value
 * @returns
 */
export const toOption = <T>(array: T[], label: keyof T, value: keyof T | T) => {
  return array.map((item) => ({
    label: item[label],
    value: typeof value === 'object' ? item : item[value as keyof typeof item],
  }))
}

export const toArrayOptionString = (array: string[]): Option<string>[] => {
  return array.map((item) => toOptionString(item))
}

export const toOptionString = (value: string) => {
  return { label: value, value }
}

// export const toObjectOption = <T>(label: string, value: T) => {
//     return { label, value };
// };

export function toObjectOption<T>(label: string, value: T): Option<T> {
  return { label, value }
}

/**
 *
 * @deprecated
 * @param input
 * @param values
 * @returns
 */
export function isValidNewOption(
  input: string | undefined,
  values: (string | undefined)[],
) {
  return (
    !!input?.trim() &&
    !values.some(
      (item) => item?.toLocaleLowerCase() === input.trim().toLocaleLowerCase(),
    )
  )
}

export const getDateFromPast = (pastYear: number) => {
  // Get the current date
  const currentDate = new Date()

  // Subtract 18 years from the current date
  const pastYearDate = new Date(currentDate)
  pastYearDate.setFullYear(currentDate.getFullYear() - pastYear)

  return pastYearDate
}

export const formatDateTime = (time: undefined | string | number) => {
  return !time
    ? ''
    : new Date(time).toLocaleString('vi-VN', {
        // hour12: false,
        hourCycle: 'h24',
      })
}

export function formatDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export const cleanValue = (input: string | undefined) =>
  input?.replace(/\s+/g, ' ').trim() ?? ''

export const isValidNewSelectOption = <T extends { label?: string }>(
  input: string | undefined,
  values: readonly T[],
  options: readonly T[],
) => {
  const cleanInput = cleanValue(input).toLowerCase()
  return (
    !!cleanInput &&
    !values.some((item) => item.label?.toLowerCase() === cleanInput) &&
    !options.some((item) => item.label?.toLowerCase() === cleanInput)
  )
}

export function handleNumericInput(event: KeyboardEvent<HTMLInputElement>) {
  const allowedKeys = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'Backspace',
    'Enter',
  ]
  if (!allowedKeys.includes(event.key)) {
    event.preventDefault()
  }
}
export * from './slug-utils'
