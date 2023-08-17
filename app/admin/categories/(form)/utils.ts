/** @format */

import { BaseType, onError, validateIfExists } from '@/lib/validate-utils'
import { API, API_URL } from 'types/constants'
import { ERRORS } from 'types/messages'

const { name, slug } = ERRORS.categories

const { findByName, findBySlug } = API['categories']()

export const validateCategoryNameExists = async (
  current: BaseType,
  onError: onError,
  value: string | undefined,
) =>
  !!value
    ? validateIfExists(`${API_URL}/${findByName(value)}`, current, {
        errors: { onError, exists: name.exists },
      })
    : name.required

export const validateCategorySlugExists = async (
  current: BaseType,
  onError: onError,
  value: string | undefined,
) =>
  !!value
    ? validateIfExists(`${API_URL}/${findBySlug(value)}`, current, {
        errors: { onError, exists: slug.exists },
      })
    : undefined
