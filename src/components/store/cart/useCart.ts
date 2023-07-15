import { useAuthUser } from "@/hooks/useAuth/useAuthUser";
import useNotification from "@/hooks/useNotification";
import { withStorageDOMEvents } from "@/hooks/withStorageEvent";
import { firestoreInstance } from "@/lib/firebase";
import { useCreate, useDelete, useList, useUpdate } from "@refinedev/core";
import {
    DocumentChangeType,
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
} from "firebase/firestore";
import { useEffect } from "react";
import { ICart, ICartItem } from "types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { shallow } from "zustand/shallow";
type ReturnProps = {
    addItem: (item: ICartItem) => void;
    updateItem: (item: ICartItem) => void;
    removeItem: (id: string) => void;
    createCart: () => void;
    // removeCart: (id: string) => void;
    clearCart: () => void;
};

const CART_RESOURCE = "carts";
const ITEMS_RESOURCE = (cartId: string) => `carts/${cartId}/items`;
const getResource = (resource: string) => ({
    dataProviderName: "firestore",
    resource,
});
export const ALLOW_QUANTITY = 10;
const getAllowQuantity = (quantity: number) =>
    Math.round(quantity) > ALLOW_QUANTITY
        ? ALLOW_QUANTITY
        : Math.round(quantity);

const useCart = (): ReturnProps => {
    const cartId = useCartIdStore((state) => state.cartId);
    const setCartId = useCartIdStore((state) => state.setId);
    const { user } = useAuthUser();

    const { mutateAsync: create } = useCreate({});

    const { mutateAsync: update } = useUpdate({});

    const { mutateAsync: deleteOne } = useDelete({});

    const { items, onItemsChange, clearItems, cart, setCart } = useCartStore(
        ({ items, cart, setCart, onItemsChange, clearItems }) => ({
            items,
            onItemsChange,
            clearItems,
            cart,
            setCart,
        }),
        shallow,
    );

    const { data: userCartData } = useList<ICart>({
        ...getResource("cart"),
        filters: [
            {
                field: "uid",
                value: user?.uid ?? null,
                operator: "eq",
            },
        ],
        pagination: {
            pageSize: 1,
        },
        queryOptions: {
            enabled: !!user?.uid,
        },
    });

    useEffect(() => {
        const unsub = withStorageDOMEvents(useCartIdStore as any);
        return unsub;
    }, []);

    //update cart
    useEffect(() => {
        if (!!!cartId) {
            return;
        }

        const unsub = onSnapshot(
            doc(firestoreInstance, "carts", cartId),
            (snapshot) => {
                const cart = snapshot.data() as ICart;
                if (snapshot.exists()) {
                    console.log("snapshot is exists, setting cart");
                    setCart({
                        ...cart,
                        id: snapshot.id,
                    });
                } else {
                    unsub();
                    setCart(undefined);
                }
            },
        );
        return unsub;
    }, [cartId]);

    //update items
    useEffect(() => {
        if (!cartId) {
            if (!!Object.keys(items).length) {
                clearItems();
            }
            return;
        }

        const q = query(
            collection(firestoreInstance, "carts", cartId, "items"),
            orderBy("updatedAt", "asc"),
        );
        const unsub = onSnapshot(q, (querySnapshot) => {
            querySnapshot.docChanges()?.forEach(({ doc, type }) => {
                const { metadata, id } = doc;
                const item = doc.data() as ICartItem;
                // console.log("item", item, type);
                if (doc.exists()) {
                    // const updatedAt =
                    //     item.updatedAt ??
                    //     doc.get("updatedAt", { serverTimestamps: "estimate" });
                    onItemsChange({ ...item, id: id }, type);
                }
            });
        });

        return unsub;
    }, [cartId]);

    const createCart = () => {
        console.debug("Creating new cart");
        return create(
            {
                ...getResource(CART_RESOURCE),
                values: {
                    uid: user?.uid ?? null,
                    updatedAt: serverTimestamp(),
                },
                successNotification: false,
            },
            {
                onSuccess(data, variables, context) {
                    setCartId(data.data.id as string);
                },
            },
        );
    };

    const updateCart = (id: string, uid: string) => {
        update({
            ...getResource(CART_RESOURCE),
            id,
            values: {
                uid,
                updatedAt: serverTimestamp(),
            },
            successNotification: false,
        });
    };
    const deleteCart = (id: string) => {
        if (!!!id) {
            console.error("Cart ID is not found");
            return;
        }
        console.log("deleteCart id", id);

        return deleteOne(
            {
                ...getResource(CART_RESOURCE),
                id: id,
                successNotification: false,
            },
            {
                onSuccess(data, variables, context) {
                    console.debug("Delete cart success");
                    setCartId(undefined);
                },
                onError(error, variables, context) {
                    console.error("Delete cart error", error);
                },
            },
        );
    };

    const clearCurrentCart = () => {
        if (cartId) deleteCart(cartId);
    };
    const addCartItem = async (addItem: ICartItem) => {
        if (!!!cartId) {
            createCart();
            await new Promise((res) => {
                if (!!cartId) res(undefined);
            });
        }

        const itemWithSameVariantId = items[addItem.variantId];
        if (!!itemWithSameVariantId) {
            const { id, variantId, quantity } = itemWithSameVariantId;
            console.warn("Duplicate variant id found, use update instead");
            updateCartItem({
                id,
                variantId,
                quantity: getAllowQuantity(quantity + addItem.quantity),
            });
            return;
        }

        create({
            ...getResource(ITEMS_RESOURCE(cartId ?? "")),
            values: {
                variantId: addItem.variantId,
                quantity: getAllowQuantity(addItem.quantity),
                updatedAt: serverTimestamp(),
            },
            successNotification: false,
        });
    };

    const updateCartItem = async ({ id, variantId, quantity }: ICartItem) => {
        if (!cartId) {
            console.error("Cart id or item id not found");
            return;
        }
        if (!id || !variantId || !items[variantId]) {
            console.error("Update error: Check your input.");
            return;
        }
        if (quantity === 0) {
            deleteCartItem(id);
            return;
        }

        const updateItem = async (
            id: string,
            variantId: number,
            quantity: number,
        ) => {
            const allowQty = getAllowQuantity(quantity);

            update({
                ...getResource(ITEMS_RESOURCE(cartId ?? "")),
                id: id,
                values: {
                    variantId,
                    quantity: getAllowQuantity(quantity),
                    updatedAt: serverTimestamp(),
                },
                successNotification: false,
            });
        };

        const currentCartItemBasedOnVariantId = items[variantId];
        if (currentCartItemBasedOnVariantId) {
            const { id: currentId, quantity: currentQuantity } =
                currentCartItemBasedOnVariantId;
            if (currentId && currentId !== id) {
                Promise.all([
                    deleteCartItem(id),
                    updateItem(
                        currentId,
                        variantId,
                        currentQuantity + quantity,
                    ),
                ]);
                return;
            }
        }

        updateItem(id, variantId, quantity);
    };

    const deleteCartItem = (id: string) => {
        if (!!!cartId) {
            console.error("cart id not found");
            return;
        }
        return deleteOne({
            ...getResource(ITEMS_RESOURCE(cartId)),
            id: id,
            successNotification: false,
        });
    };

    const mergeCart = async (localCartId: string, userCart: ICart) => {
        console.log("start to merge cart");
        const localItems = [...Object.values(items)];
        await deleteCart(localCartId);
        setCartId(userCart.id);
        new Promise((res) => {
            setTimeout(() => {
                res(
                    localItems.forEach(({ variantId, quantity }) =>
                        addCartItem({ variantId, quantity }),
                    ),
                );
            }, 500);
        });
    };

    //update when user changes
    useEffect(() => {
        const checkCartWhenLoggedIn = async () => {
            if (!!!user) {
                return;
            }
            const userCart = userCartData?.data?.[0];
            if (cartId === userCart?.id) return;

            if (!!userCart) {
                if (!!cartId) {
                    mergeCart(cartId, userCart);
                } else setCartId(userCart.id);
                return;
            }

            if (!!cartId) {
                if (!!cart?.uid) {
                    console.warn(
                        "Not yet cleaned out the cart of another user",
                    );
                    return;
                }
                //todo: update localcartid with userId
                updateCart(cartId, user.uid);
            }
        };
        const checkCartWhenNotLoggedIn = async () => {
            if (!!!user && !!cart?.uid) {
                setCartId(undefined);
            }
        };
        if (!!user) {
            checkCartWhenLoggedIn();
        } else {
            checkCartWhenNotLoggedIn();
        }
    }, [user?.uid]);

    return {
        addItem: addCartItem,
        updateItem: updateCartItem,
        removeItem: deleteCartItem,
        createCart,
        clearCart: clearCurrentCart,
    };
};

type State = {
    cart: ICart | undefined;
    // items: ICartItem[];
    items: Record<number, ICartItem>;
    setCart: (cart: State["cart"]) => void;
    addItem: (item: State["items"][number]) => void;
    removeItem: (item: State["items"][number]) => void;
    updateItem: (item: State["items"][number]) => void;
    onItemsChange: (
        item: State["items"][number],
        type: DocumentChangeType,
    ) => void;
    clearItems: () => void;
};

const useCartStore = create(
    immer<State>((set, get) => {
        return {
            cart: undefined,
            items: {},
            setCart: (cart) => {
                set(() => ({ cart }));
            },
            addItem: (item) => {
                set(({ items }) => {
                    items[item.variantId] = item;
                });
            },
            removeItem: (item) => {
                set(({ items }) => {
                    delete items[item.variantId];
                });
            },
            updateItem: (item) => {
                console.count("updating store item");
                const { variantId, quantity } = item;
                set(({ items }) => {
                    if (items[variantId]) {
                        items[variantId]!.quantity = quantity;
                    } else {
                        items[variantId] = item;
                    }
                });
            },
            onItemsChange: (item, type) => {
                switch (type) {
                    case "added":
                        get().addItem(item);
                        break;
                    case "modified":
                        get().updateItem(item);
                        break;
                    case "removed":
                        get().removeItem(item);
                        break;
                }
            },
            clearItems: () => set(() => ({ items: [] })),
        };
    }),
);

const useCartIdStore = create<{
    cartId?: string;
    setId: (id?: string) => void;
}>()(
    persist(
        (set) => ({
            cartId: undefined,
            setId: (id) => {
                set(() => ({ cartId: id }));
            },
        }),
        {
            name: "cid",
        },
    ),
);

export default useCart;
export { useCartStore, useCartIdStore };
export const useCartItems = () => useCartStore((state) => state.items);
