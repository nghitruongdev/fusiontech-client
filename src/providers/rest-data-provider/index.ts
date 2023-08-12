/** @format */

import { DataProvider, MetaQuery } from '@refinedev/core'
import { axiosInstance, generateSort, generateFilter } from './utils'
import { AxiosInstance } from 'axios'
import { stringify, stringifyUrl } from 'query-string'
import { API_URL } from 'types/constants'

type MethodTypes = 'get' | 'delete' | 'head' | 'options'
type MethodTypesWithBody = 'post' | 'put' | 'patch'

const dataProvider = (
  apiUrl: string,
  httpClient: AxiosInstance = axiosInstance,
): Omit<
  Required<DataProvider>,
  'createMany' | 'updateMany' | 'deleteMany'
> => ({
  getList: async ({ resource, pagination, filters, sorters, meta = {} }) => {
    const { current = 0, pageSize = 10, mode = 'server' } = pagination ?? {}

    const {
      headers: headersFromMeta,
      method,
      url: customUrl,
      query: metaQuery,
    } = meta
    const requestMethod = (method as MethodTypes) ?? 'get'

    const url = customUrl
      ? customUrl
      : `${apiUrl}/${resource}${mode === 'off' ? '/search/all' : ''}`

    if (!!filters) {
      console.warn('Filter is currently not supported.')
    }
    const queryFilters = generateFilter(filters)

    const query: {
      // _start?: number;
      // _end?: number;
      projection?: string
      page?: number
      size?: number
      sort?: string
      //   order?: string
    } = {
      projection: metaQuery?.projection,
    }

    if (mode === 'server') {
      // query._start = (current - 1) * pageSize;
      // query._end = current * pageSize;
      query.page = current - 1
      query.size = pageSize
    }
    query.sort = generateSort(
      sorters?.length ? sorters : [{ field: 'id', order: 'desc' }],
    )?.join(',')
    // if (generatedSort) {
    //   const { _sort, _order } = generatedSort
    //   query.sort = _sort.join(',')
    //   query.order = _order.join(',')
    // } else {
    //   query.sort = 'id'
    //   query.order = 'desc'
    // }
    const requestUrl = `${url}?${stringify(query)}&${stringify(queryFilters)}`
    console.log('getList requestUrl', requestUrl)
    const { data, headers } = await httpClient[requestMethod](requestUrl, {
      headers: headersFromMeta,
    })
    const fetchData =
      data?._embedded?.[meta?._embeddedResource ?? resource] ?? data
    const page = data?.page

    const total = page?.totalElements ?? headers['x-total-count']
    return {
      data: fetchData,
      total: total || fetchData.length,
      page: page,
    }
  },

  getMany: async ({ resource, ids, meta }) => {
    const { headers, method, query } = meta ?? {}
    const requestMethod = (method as MethodTypes) ?? 'get'
    const url = `${apiUrl}/${resource}/search/many?${stringify(
      query,
    )}&${stringify({
      ids: ids.join(','),
    })}`
    const { data } = await httpClient[requestMethod](url, { headers })
    const fetchData =
      data?._embedded?.[meta?._embeddedResource ?? resource] ?? data
    return {
      data: fetchData,
    }
  },

  create: async ({ resource, variables, meta }) => {
    const url = `${apiUrl}/${resource}`

    const { headers, method } = meta ?? {}
    const requestMethod = (method as MethodTypesWithBody) ?? 'post'

    const { data } = await httpClient[requestMethod](url, variables, {
      headers,
    })

    return {
      data,
    }
  },

  update: async ({ resource, id, variables, meta }) => {
    const url = `${apiUrl}/${resource}/${id}`

    const { headers, method } = meta ?? {}
    const requestMethod = (method as MethodTypesWithBody) ?? 'patch'
    const { data } = await httpClient[requestMethod](url, variables, {
      headers,
    })

    return {
      data,
    }
  },

  getOne: async ({ resource, id, meta }) => {
    const url = `${apiUrl}/${resource}/${id}`

    const { headers, method, query } = meta ?? {}

    const requestMethod = (method as MethodTypes) ?? 'get'
    const requestUrl = stringifyUrl({
      url: url,
      query: query,
    })
    console.log('requestUrl', requestUrl)
    const { data } = await httpClient[requestMethod](requestUrl, {
      headers,
    })

    return {
      data,
    }
  },

  deleteOne: async ({ resource, id, variables, meta }) => {
    const url = `${apiUrl}/${resource}/${id}`

    const { headers, method } = meta ?? {}
    const requestMethod = (method as MethodTypesWithBody) ?? 'delete'

    const { data } = await httpClient[requestMethod](url, {
      data: variables,
      headers,
    })

    return {
      data,
    }
  },

  getApiUrl: () => {
    return apiUrl
  },

  custom: async ({
    url,
    method,
    filters,
    sorters,
    payload,
    query,
    headers,
    meta,
  }) => {
    let requestUrl =
      !!sorters || !!filters || (!!query && !url.includes('?'))
        ? `${url}?`
        : url
    if (!url.startsWith('http')) {
      requestUrl = `${API_URL}/${requestUrl}`
    }
    if (!!sorters) {
      const generatedSort = generateSort(sorters)
      //   if (generatedSort) {
      //     const { _sort, _order } = generatedSort
      //     const sortQuery = {
      //       _sort: _sort.join(','),
      //       _order: _order.join(','),
      //     }
      //     requestUrl = `${requestUrl}&${stringify(sortQuery)}`
      //   }

      const sortQuery = generateSort(sorters)?.join(',')
      requestUrl = `${requestUrl}&${sortQuery}`
    }

    if (!!filters) {
      const filterQuery = generateFilter(filters)
      requestUrl = `${requestUrl}&${stringify(filterQuery)}`
    }

    if (!!query) {
      requestUrl = `${requestUrl}&${stringify(query)}`
    }

    if (headers) {
      httpClient.defaults.headers = {
        ...httpClient.defaults.headers,
        ...headers,
      }
    }
    console.log('requestUrl', requestUrl)

    let axiosResponse
    switch (method) {
      case 'put':
      case 'post':
      case 'patch':
        axiosResponse = await httpClient[method](requestUrl, payload)
        break
      case 'delete':
        axiosResponse = await httpClient.delete(requestUrl, {
          data: payload,
        })
        break
      default:
        axiosResponse = await httpClient.get(requestUrl)
        break
    }

    const { data: response } = axiosResponse
    let data =
      response?._embedded?.[meta?._embeddedResource] ??
      response?._embedded?.[meta?.resource] ??
      response

    if (meta?.projection) {
      if (Array.isArray(data)) {
        data = data.map((item) => ({
          ...item,
          projection: meta.projection,
        }))
      } else {
        data = { ...data, projection: meta.projection }
      }
    }
    return Promise.resolve({
      data,
    })
  },
})

export const springDataProvider = dataProvider(API_URL ?? '')
