import "server-only";
import { IProduct, Page } from "types";
import { toRecord } from "../utils";
import { stringify } from "querystring";
type GetProps<T, K extends keyof T> = {
    resource: string;
    key: K;
    cache?: RequestCache;
    pathName?: string;
    baseUrl?: string;
    query?: {
        [key: string]: any;
    };
};

export type _resourceLink = {
    first: {
        href: string;
    };
    self: {
        href: string;
    };
    next: {
        href: string;
    };
    last: {
        href: string;
    };
    profile: {
        href: string;
    };
    search: {
        href: string;
    };
};
export type ListDataResponse = {
    _embedded: {
        _links?: _resourceLink;
        page?: Page;
        [key: string]: unknown[] | unknown;
    };
};

export type ResourceData<T, K extends keyof T> = {
    data: Record<K, T>;
    page?: Page;
    _links?: _resourceLink;
};
const isNextProvider = true;
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
        ...props
    }: GetProps<T, K>): Promise<ResourceData<T, K>> => {
        const { baseUrl = BASE_URL } = props;

        const url = `${baseUrl}/${pathName}${
            query ? "?" + stringify(query) : ""
        }`;

        const res = await fetch(url, { cache });
        // The return value is *not* serialized
        // You can return Date, Map, Set, etc.

        // Recommendation: handle errors
        if (!res.ok) {
            // This will activate the closest `error.js` Error Boundary
            throw new Error(`Failed to fetch ${resource}`);
        }
        // await waitPromise(1000 * 20);
        const { _embedded: data } = (await res.json()) as ListDataResponse;
        return {
            data: toRecord(data[resource] as T[], key),
            _links: data._links,
            page: data.page,
        };
    },
};
