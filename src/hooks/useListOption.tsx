import { BaseRecord, HttpError, useList } from "@refinedev/core";
import { UseListProps } from "@refinedev/core/dist/hooks/data/useList";
import { useEffect, useState } from "react";

export type ListOption<K, V> = { label: K; value: V };

/**
 *
 * T - resource to fetch, K: type of key of option, V: typeof value of option
 * @param toOption: convert an item in the list to an option
 * @returns
 */
function useListOption<T extends BaseRecord, K, V>({
    toOption,
    ...props
}: UseListProps<T, HttpError, T> & {
    toOption: (item: T) => ListOption<K, V>;
}) {
    const [options, setOptions] = useState<ListOption<K, V>[]>([]);
    const { data } = useList<T>(props);

    useEffect(() => {
        const list = data?.data;
        // console.log("list", list);
        if (list) {
            setOptions(() => list.map(toOption));
        }
    }, [data?.data]);

    return {
        options,
    };
}
export default useListOption;
