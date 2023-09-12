/** @format */

import { BaseType, onError, validateIfExists } from '@/lib/validate-utils'
import { API, API_URL } from 'types/constants'
import { ERRORS } from 'types/messages'

const { findByCode } = API['vouchers']()
const { exists, required } = ERRORS.vouchers.code

export const validateVoucherCodeExists = async (
  current: BaseType,
  onError: onError,
  value: string | undefined,
) =>
  !!value
    ? validateIfExists(`${API_URL}/${findByCode(value)}`, current, {
        errors: { onError, exists },
      })
    : required
