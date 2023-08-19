/** @format */

import { BaseType, onError, validateIfExists } from '@/lib/validate-utils'
import { API, API_URL } from 'types/constants'
import { ERRORS } from 'types/messages'

const { email, phoneNumber } = ERRORS.users

const { findByEmail, findByPhone } = API['users']()

export const validateUserEmailExists = async (
  current: BaseType,
  onError: onError,
  value: string | undefined,
) =>
  !!value
    ? validateIfExists(`${API_URL}/${findByEmail(value)}`, current, {
        errors: { onError, exists: email.exists },
      })
    : email.required

export const validateUserPhoneExists = async (
  current: BaseType,
  onError: onError,
  value: string | undefined,
) =>
  !!value
    ? validateIfExists(`${API_URL}/${findByPhone(value)}`, current, {
        errors: { onError, exists: phoneNumber.exists },
      })
    : phoneNumber.required
