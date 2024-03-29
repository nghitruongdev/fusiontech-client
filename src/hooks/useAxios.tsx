/** @format */

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
import { API_URL } from 'types/constants'
type State = {
  isLoading?: boolean
  errorText?: string
}
export type AxiosOptions = {
  retryCount?: number
  retryDelay?: number
  timeout?: number
  throwOnError?: boolean
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
type MethodProps = {
  requestUrl?: string
  data?: any
  options?: AxiosOptions
  config?: AxiosRequestConfig<any>
}
const useAxios = (url?: string) => {
  const [state, setState] = useState<State>()

  const resetState = () => {
    setState({ ...{} })
  }

  const get = ({ requestUrl, options, config }: MethodProps = {}) =>
    makeRequest({ method: 'GET', requestUrl, options, config })

  const post = ({ requestUrl, data, options, config }: MethodProps = {}) =>
    makeRequest({ method: 'POST', requestUrl, data, options, config })

  const put = ({ requestUrl, data, options, config }: MethodProps = {}) =>
    makeRequest({ method: 'PUT', requestUrl, data, options, config })

  const patch = ({ requestUrl, data, options, config }: MethodProps = {}) => {
    return makeRequest({
      method: 'PATCH',
      requestUrl,
      data,
      options,
      config,
    })
  }

  const remove = ({ requestUrl, options, config }: MethodProps = {}) =>
    makeRequest({ method: 'DELETE', requestUrl, options, config })

  const makeRequest = async ({
    method,
    data,
    requestUrl,
    options = {},
    config = {},
  }: {
    method: HttpMethod
    requestUrl?: string
    data?: any
    options?: AxiosOptions
    config?: AxiosRequestConfig
  }) => {
    const { timeout } = options
    setState((prevState) => ({ ...prevState, isLoading: true }))
    try {
      if (timeout) await sleep(timeout)
      const response = await axios.request({
        baseURL: API_URL ?? '',
        method: method,
        data: data,
        url: requestUrl ? requestUrl : url,
        headers: { ...config.headers },
        ...config,
      })

      setState((prevState) => ({
        ...prevState,
        isLoading: false,
        data: response.data,
        status: response.status,
      }))
      return response
    } catch (error: any) {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
        errorText: error.message,
      }))
      if (options.throwOnError) throw error
    }
  }
  return {
    ...state,
    get,
    post,
    put,
    patch,
    remove,
    resetAxios: resetState,
  }
}

export default useAxios

const sleep = (ms: number) => {
  return new Promise((res) => setTimeout(res, ms))
}
