/** @format */

import useCrudNotification from '@/hooks/useCrudNotification'

export const SLUG_PATTERN = {
  value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  message: 'Đường dẫn không hợp lệ',
}

export const EMAIL_PATTERN = {
  value: /^\S+@\S+$/i,
  message: 'Email không hợp lệ.',
}

export const PHONE_PATTERN = {
  value: /^0[\d]{9}/,
  message: 'Số điện thoại không hợp lệ.',
}

export const validatePhoneNumber = (phoneNum: string) => {
  const phone = phoneNum.trim()
  return phone.length === 10 && phone.charAt(0) === '0'
}

export type onError = ReturnType<typeof useCrudNotification>['onDefaultError']

export type BaseType =
  | {
      id: string | number | undefined
    }
  | undefined

export const validateIfExists = async (
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
      console.error('validate exists is not ok')
      return false
    }
    // if (response.type === 'cors')
    //   throw new Error('Yêu cầu đã bị chặn bởi CORS.')
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
