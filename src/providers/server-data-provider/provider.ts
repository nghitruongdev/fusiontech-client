import "server-only";
import { Page } from "types";
import { toRecord } from "../../lib/utils";
import { stringifyUrl } from "query-string";
import { _listLinks, _searchLinks } from "types/_link";
import { CustomResponse } from "types/response";

type GetListProps<T, K extends keyof T> = {
    resource: string;
    key: K;
    cache?: RequestCache;
    pathName?: string;
    baseUrl?: string;
    query?: {
        [key: string]: any;
    };
};

type GetOneProps = {
    resource: string;
    id: string | number;
    cache?: RequestCache;
    pathName?: string;
    baseUrl?: string;
    query?: {
        [key: string]: any;
    };
};

type CustomProps<T> = {
    resource?: string;
    projecion?: string;
    pathName?: string;
    url?: string;
    baseUrl?: string;
    cache?: RequestCache;
    query?: {
        [key: string]: any;
    };
};

type GetAllProps<T, K extends keyof T> = {
    resource?: string;
    key: K;
    baseUrl?: string;
    cache?: RequestCache;
    query?: {
        [key: string]: any;
    };
};

export type ListDataResponse<T> = {
    _embedded: {
        _links?: _listLinks;
        page?: Page;
        [key: string]: unknown[] | unknown;
    };
};

type SearchProps<T, K extends keyof T> = {
    resource: string;
    key: K;
    searchPathname: string;
    cache?: RequestCache;
    baseUrl?: string;
    query?: {
        [key: string]: any;
    };
};

export type SearchDataResponse<T> = {
    _embedded?: {
        _links?: _searchLinks;
        [key: string]: T[] | unknown;
    };
};

export type ResourceData<T, K extends keyof T | undefined> = K extends keyof T
    ? {
          data: Record<K, T>;
          page?: Page;
          _links?: _listLinks | _searchLinks;
      }
    : never;

export type RecordData<T, K extends keyof T> = {
    data: Record<K, T>;
    page?: Page;
    _links?: _listLinks | _searchLinks;
};

export type ListData<T> = {
    data: T[];
    page?: Page;
    _links?: _listLinks | _searchLinks;
};
const isNextProvider = false;
const BASE_URL = isNextProvider
    ? `${process.env.NEXT_URL}/api`
    : process.env.RESOURCE_SERVER_URL;

export const serverDataProvider = {
    getList: async <T, K extends keyof T>({
        resource,
        key,
        cache,
        pathName = resource,
        query,
        baseUrl = BASE_URL,
        ...props
    }: GetListProps<T, K>): Promise<RecordData<T, K>> => {
        const url = stringifyUrl({
            url: `${baseUrl}/${pathName}`,
            query,
        });

        const res = await fetch(url, { cache });
        // The return value is *not* serialized
        // You can return Date, Map, Set, etc.

        // Recommendation: handle errors
        if (!res.ok) {
            // This will activate the closest `error.js` Error Boundary
            throw new Error(`Failed to fetch ${resource}`);
        }
        // await waitPromise(1000 * 20);
        const { _embedded: data } = (await res.json()) as ListDataResponse<T>;
        return {
            data: toRecord(data[resource] as T[], key),
            _links: data._links,
            page: data.page,
        };
    },

    getOne: async <T>({
        resource,
        id,
        cache,
        pathName = resource,
        query,
        baseUrl = BASE_URL,
        ...props
    }: GetOneProps): Promise<T> => {
        const url = stringifyUrl({
            url: `${baseUrl}/${pathName}/${id}`,
            query,
        });

        const res = await fetch(url, { cache });
        // The return value is *not* serialized
        // You can return Date, Map, Set, etc.

        // Recommendation: handle errors
        if (!res.ok) {
            // This will activate the closest `error.js` Error Boundary
            throw new Error(`Failed to fetch ${resource} with id ${id}`);
        }

        return res.json();
    },
    search: async <T, K extends keyof T>({
        resource,
        key,
        cache,
        query,
        searchPathname,
        baseUrl = BASE_URL,
        ...props
    }: SearchProps<T, K>): Promise<unknown> => {
        const url = stringifyUrl({
            url: `${baseUrl}/${resource}/search/${searchPathname}`,
            query,
        });

        const res = await fetch(url, { cache });
        // The return value is *not* serialized
        // You can return Date, Map, Set, etc.

        // Recommendation: handle errors
        if (!res.ok) {
            // This will activate the closest `error.js` Error Boundary
            throw new Error(`Failed to fetch ${resource}`);
        }

        const response = (await res.json()) as SearchDataResponse<T>;

        if (response._embedded) {
            if (!key) throw new Error("Key field is missing");
            const { _embedded: data } = response;
            return {
                data: toRecord(data[resource] as T[], key),
                _links: data._links,
            };
        }

        return response;
    },
    getAll: async <T, K extends keyof T>({
        resource,
        key,
        ...props
    }: GetAllProps<T, K>): Promise<RecordData<T, K>> => {
        const { data, ...result } = (await serverDataProvider.custom({
            ...props,
            pathName: `${resource}/search/all`,
        })) as ListData<T>;
        return {
            ...result,
            data: toRecord(data, key),
        };
    },
    custom: async <T>({
        url,
        pathName,
        baseUrl = BASE_URL,
        cache,
        query,
        resource,
        projecion,
    }: CustomProps<T>): Promise<T | ListData<T>> => {
        if (!url && !pathName) {
            throw new Error("Url or Pathname is required");
        }

        const href = stringifyUrl({
            url: url ?? `${baseUrl}/${pathName}`,
            query: {
                ...query,
                projection: projecion ?? query?.projection,
            },
        });
        const res = await fetch(href, {
            cache,
        });
        if (!res.ok) {
            throw new Error(`Failed to fetch ${href}`);
        }

        const result = (await res.json()) as CustomResponse<T>;

        const { _embedded: data } = result;
        if (data && resource) {
            return {
                data: data[resource] ?? [],
                page: data.page,
                _links: data._links,
            };
        }

        return result as T;
    },
};
