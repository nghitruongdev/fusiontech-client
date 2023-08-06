/** @format */

import {
  useNotification,
  OpenNotificationParams,
  HttpError,
  CreateResponse,
  BaseRecord,
} from '@refinedev/core'
import { AxiosError } from 'axios'
import { useCallback } from 'react'
import { messages } from '../../types/messages'
import { Fields } from '@refinedev/core/dist/interfaces/metaData/fields'
import { VariableOptions } from '@refinedev/core/dist/interfaces/metaData/variableOptions'
import { AppError } from 'types/error'

type ValueProps =
  | {
      [x: string]: any
      headers?: {} | undefined
      queryContext?: unknown
      operation?: string | undefined
      fields?: Fields | undefined
      variables?: VariableOptions | undefined
    }
  | undefined
const useCrudNotification = () => {
  const { open, close } = useNotification()

  const onDefaultError = useCallback(
    (err: TypeError) => {
      console.error(err)
      if (err.name === 'TypeError') {
        open?.({
          type: 'error',
          description: 'Trình duyệt đã xảy ra lỗi. Vui lòng thử lại sau.',
          message: 'Trình duyệt không thể tải dữ liệu - 500',
        })
        return
      }
      open?.({
        type: 'error',
        message: err.name,
        description: err.message,
      })
    },
    [open],
  )

  const onError = (
    err?: AppError | HttpError | undefined,
    value?: unknown,
    resource?: string | undefined,
    defaultMessage?: string,
  ): OpenNotificationParams => {
    return {
      type: 'error',
      message: err?.message ?? 'Đã có lỗi xảy ra',
    }
  }
  const onSuccess = (
    data?: CreateResponse<BaseRecord> | undefined,
    values?: ValueProps,
    resource?: string | undefined,
    defaultMessage?: string,
  ): OpenNotificationParams => {
    return {
      type: 'success',
      message: '',
    }
  }
  return {
    onDefaultError,
    onSuccess,
    onError,
    action: {
      open,
      close,
    },
  }
}
export default useCrudNotification
