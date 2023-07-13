import { ICartItem } from "types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type State = {
    items: ICartItem[];
};
type Action = {
    addSelectedItem: (item: ICartItem) => void;
    removeSelectedItem: (item: ICartItem) => void;
    addAll: (items: ICartItem[]) => void;
    clearAll: () => void;
    // setHydrated: (status: State["_hydrated"]) => void;
};

export const useSelectedCartItemStore = create<State & Action>()(
    persist(
        (set, get) => ({
            items: [],
            _hydrated: false,
            addSelectedItem: (item: ICartItem) =>
                set((state) => ({ items: [...state.items, item] })),
            removeSelectedItem: (item: ICartItem) =>
                set((state) => ({
                    items: [
                        ...state.items.filter(
                            (selected) => selected.variantId !== item.variantId,
                        ),
                    ],
                })),
            addAll: (items: ICartItem[]) => set({ items: items }),
            clearAll: () => set({ items: [] }),
        }),
        {
            name: "selected-items", // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
            partialize(state) {
                return { items: state.items };
            },
            onRehydrateStorage: () => (state) => {
                console.log("hydration starts");
                // optional
                return (state: any, error: any) => {
                    if (error) {
                        console.log(
                            "an error happened during hydration",
                            error,
                        );
                    } else {
                        console.log("hydration finished");
                    }
                };
            },
        },
    ),
);
