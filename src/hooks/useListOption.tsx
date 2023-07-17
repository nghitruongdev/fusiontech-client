import { BaseRecord, HttpError, useList } from "@refinedev/core";
import { UseListProps } from "@refinedev/core/dist/hooks/data/useList";
import { useEffect, useState } from "react";

export type ListOption<K, V> = { label: K; value: V };

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
        if (list) {
            setOptions(() => list.map(toOption));
        }
    }, [data?.data]);

    return {
        options,
    };
}
export default useListOption;
