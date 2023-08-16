/** @format */

import { BaseType, onError, validateIfExists } from '@/lib/validate-utils'
import { API, API_URL } from 'types/constants'
import { ERRORS } from 'types/messages'

const { name, slug } = ERRORS.brands

const { findByName, findBySlug } = API['brands']()

export const validateBrandSlugExists = async (
  value: string | undefined,
  current: BaseType,
  onError: onError,
) =>
  !!value
    ? validateIfExists(`${API_URL}/${findBySlug(value)}`, current, {
        errors: { onError, exists: slug.exists },
      })
    : undefined
export const validateBrandNameExists = async (
  value: string | undefined,
  current: BaseType,
  onError: onError,
) =>
  !!value
    ? validateIfExists(`${API_URL}/${findByName(value)}`, current, {
        errors: { onError, exists: name.exists },
      })
    : name.required
