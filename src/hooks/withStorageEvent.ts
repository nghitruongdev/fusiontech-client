import { Mutate, StoreApi } from "zustand";

type StoreWithPersist = Mutate<
    StoreApi<unknown>,
    [["zustand/persist", unknown]]
>;

export const withStorageDOMEvents = (store: StoreWithPersist) => {
    const storageEventCallback = (e: StorageEvent) => {
        if (e.key === store.persist.getOptions().name) {
            store.persist.rehydrate();
        }
    };

    window.addEventListener("storage", storageEventCallback);

    return () => {
        window.removeEventListener("storage", storageEventCallback);
    };
};
