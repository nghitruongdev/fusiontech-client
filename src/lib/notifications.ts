import { HttpError, OpenNotificationParams } from '@refinedev/core'

export const errorNotification = (
  error?: HttpError | undefined,
  values?: unknown,
  resource?: string,
): OpenNotificationParams => {
  return {
    type: 'error',
    message: 'Đã có lỗi xảy ra trong khi tải dữ liệu ' + resource,
  }
}
