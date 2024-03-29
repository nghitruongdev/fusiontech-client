/** @format */

import {
  useNotification,
  OpenNotificationParams,
  HttpError,
  CreateResponse,
  BaseRecord,
} from '@refinedev/core'
import { useCallback } from 'react'
import { Fields } from '@refinedev/core/dist/interfaces/metaData/fields'
import { VariableOptions } from '@refinedev/core/dist/interfaces/metaData/variableOptions'
import { AppError } from 'types/error'
import { ProblemDetail, ResourceName } from 'types'
import { RESOURCE_LABEL } from 'types/constants'

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

  const onSuccess = (
    data?: CreateResponse<BaseRecord> | undefined,
    values?: ValueProps,
    resource?: string | undefined,
    defaultMessage?: string,
  ): OpenNotificationParams => {
    console.log('values', values)
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

type Action = 'create' | 'edit' | 'delete'
const ActionText: { [key in Action]: string } = {
  create: 'Thêm mới',
  edit: 'Cập nhật',
  delete: 'Xoá',
}
export const onSuccess = (
  action: Action,
  data: any,
  values: any,
  resource: string | undefined,
  defaultMessage?: string,
): OpenNotificationParams => {
  if (defaultMessage)
    return {
      type: 'success',
      message: defaultMessage,
    }

  return {
    type: 'success',
    message: `${ActionText[action]} ${
      (resource && RESOURCE_LABEL[resource as ResourceName]) ?? ''
    } thành công`,
  }
}

export const onDefaultSuccess = (
  message: string,
  description?: string,
): OpenNotificationParams => ({
  type: 'success',
  message,
  description,
})

export const onError = (
  err?: AppError | HttpError | undefined,
  value?: unknown,
  resource?: string | undefined,
  defaultMessage?: string,
): OpenNotificationParams => {
  console.log('err', err)
  if (err?.isAxiosError) {
    const data = err.response?.data as ProblemDetail
    const code = data?.status ?? err.statusCode
    const name = data?.title ?? err.name
    switch (code) {
      case 403:
        return {
          type: 'error',
          message: 'Từ chối truy cập - [403]',
          description: 'Bạn không có quyền để thực hiện hành động này',
        }
    }
    return {
      type: 'error',
      message: `${getErrorTitle(name)} - ${code}`,
      description:
        data?.detail ?? 'Đã có lỗi xảy ra, vui lòng liên hệ nhà cung cấp.',
    }
  }
  return {
    type: 'error',
    message: err?.name,
    description:
      err?.message ?? 'Đã có lỗi xảy ra, vui lòng liên hệ nhà cung cấp.',
  }
}

const getErrorTitle = (title?: string) => {
  console.log('title', title)
  if ('Bad Request'.toUpperCase() === title?.toUpperCase())
    return 'Yêu cầu không hợp lệ'
  return title ?? 'Hệ thống đã xảy ra lỗi'
}

export default useCrudNotification
