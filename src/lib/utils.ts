import { usePathname, useSearchParams } from "next/navigation";
import { stringify, stringifyUrl } from "query-string";

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
