import {
    ReadonlyURLSearchParams,
    usePathname,
    useSearchParams,
} from "next/navigation";
import { stringifyUrl } from "query-string";
import { Option } from "types";
export const formatPrice = (amount?: number) => {
    if (!amount) return 0;
    const formatted = new Number(amount).toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0,
    });
    return formatted;
};

export const toRecord = <T, K extends keyof T>(
    array: T[],
    key: K,
): Record<K, T> => {
    return array.reduce(function (acc, value) {
        acc[value[key] as K] = value;
        return acc;
    }, {} as Record<K, T>);
};

export const blurColorDataUrl = () => {
    // Pixel GIF code adapted from https://stackoverflow.com/a/33919020/266535
    const keyStr =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    const triplet = (e1: number, e2: number, e3: number) =>
        keyStr.charAt(e1 >> 2) +
        keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
        keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
        keyStr.charAt(e3 & 63);

    const rgbDataURL = (r: number, g: number, b: number) =>
        `data:image/gif;base64,R0lGODlhAQABAPAA${
            triplet(0, r, g) + triplet(b, 255, 255)
        }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`;
    return rgbDataURL;
};

export const useCurrentUrl = () => {
    const searchParams = useSearchParams();
    const pathName = usePathname();
    const query = {} as any;
    searchParams.forEach((value, key) => (query[key] = value));

    return stringifyUrl({ url: pathName, query });
};

export const cleanUrl = (dirtyUrl: string) => {
    return dirtyUrl.replace(/{.*}/, "");
};

export const updateUrlParams = (
    params: Record<string, string>,
    current: ReadonlyURLSearchParams,
) => {
    const update = new URLSearchParams(Array.from(current.entries())); // -> has to use this form

    Object.keys(params).forEach((key) => {
        if (!params[key]) {
            update.delete(key);
        } else {
            update.set(key, params[key] ?? "");
        }
    });

    return update.toString();
};

/**
 *
 * @param array
 * @param label
 * @param value
 * @returns
 */
export const toOption = <T>(array: T[], label: keyof T, value: keyof T | T) => {
    return array.map((item) => ({
        label: item[label],
        value:
            typeof value === "object" ? item : item[value as keyof typeof item],
    }));
};

export const toArrayOptionString = (array: string[]): Option<string>[] => {
    return array.map((item) => toOptionString(item));
};

export const toOptionString = (value: string) => {
    return { label: value, value };
};

// export const toObjectOption = <T>(label: string, value: T) => {
//     return { label, value };
// };

export function toObjectOption<T>(label: string, value: T): Option<T> {
    return { label, value };
}

export function isValidNewOption(
    input: string | undefined,
    values: (string | undefined)[],
) {
    return (
        !!input?.trim() &&
        !values.some(
            (item) =>
                item?.toLocaleLowerCase() === input.trim().toLocaleLowerCase(),
        )
    );
}

// Define a type ToObjectOption<T> using conditional types
// type ToObjectOption<T> = T extends infer U
//     ? { label: string; value: U }
//     : never;
