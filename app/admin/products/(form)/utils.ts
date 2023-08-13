/** @format */

import useCrudNotification from '@/hooks/useCrudNotification'
import { IProduct } from 'types'
import { API, API_URL } from 'types/constants'
import { ERRORS } from 'types/messages'
import { onError } from '../../../../src/hooks/useCrudNotification'

type onError = ReturnType<typeof useCrudNotification>['onDefaultError']
const { findByName, findBySlug } = API['products']()

type BaseType =
  | {
      id: string | number | undefined
    }
  | undefined

const validateIfExists = async (
  url: string,
  current: BaseType,
  options?: {
    errors: {
      onError: onError
      required?: string
      exists: string
    }
  },
) => {
  const { onError, exists } = options?.errors ?? {}
  const sendRequest = async () => {
    const response = await fetch(url)

    console.debug('response', response)
    if (!response.ok) {
      if (response.status === 404) return true
      console.error('validate name is not ok')
      return false
    }
    const data = (await response.json()) as BaseType
    if (data) {
      if (!current) return exists ?? false

      if (data.id !== current.id) return exists ?? false
    }
    return true
  }
  try {
    return await sendRequest()
  } catch (err) {
    onError?.(err as Error)
    return false
  }
}
const { name, slug } = ERRORS.products

export const validateProductSlugExists = async (
  value: string | undefined,
  current: BaseType,
  onError: onError,
) =>
  !!value
    ? validateIfExists(`${API_URL}/${findBySlug(value)}`, current, {
        errors: { onError, exists: slug.exists },
      })
    : undefined
export const validateProductNameExists = async (
  value: string | undefined,
  current: BaseType,
  onError: onError,
) =>
  !!value
    ? validateIfExists(`${API_URL}/${findByName(value)}`, current, {
        errors: { onError, exists: name.exists },
      })
    : name.required
