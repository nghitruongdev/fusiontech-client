import { useAuthStore } from "@/hooks/useAuthUser";
import useStore from "@/hooks/useStore";
import { firestoreDB } from "@/lib/firebase";
import { firebaseAuthProvider } from "@/providers/firebaseAuthProvider";
import { useCreate, useDelete, useOne, useUpdate } from "@refinedev/core";
import { FieldValue, arrayRemove, arrayUnion } from "firebase/firestore";
import { ICart, ICartItem } from "types";
import { useLocalStorage, useUpdateEffect } from "usehooks-ts";
import { create } from "zustand";

type State = {
    cart: ICart | null | undefined;
    status: "error" | "success" | "loading" | "";
    items: ICartItem[];
};

type Action = {
    addItem: (item: ICartItem) => void;
    removeItem: (item: ICartItem) => void;
};

const useCartStore = create<
    State & {
        setCart: (cart: State["cart"]) => void;
        setStatus: (status: State["status"]) => void;
    }
>((set, get) => {
    return {
        cart: undefined,
        items: [],
        status: "",

        setCart(cart) {
            set({ cart });
        },
        setStatus(status) {
            set({ status });
        },
    };
});

const useCart = (): State & Action => {
    const user = useAuthStore((state) => state.user);
    const resource = {
        resource: "carts",
        dataProviderName: "firestore",
    };

    const [cartId, setCartId] = useLocalStorage<undefined | string>(
        "cid",
        undefined,
    );
    const { data, status, isFetched } = useOne<ICart>({
        ...resource,
        id: cartId,
        queryOptions: {
            enabled: !!cartId,
            suspense: false,
        },
    });

    const { mutate: create } = useCreate<ICart>({});

    const { mutate: update } = useUpdate<ICart>({});

    const { mutate: deleteOne } = useDelete<ICart>({});

    const [cart, setCart, setStatus] = useCartStore((state) => [
        state.cart,
        state.setCart,
        state.setStatus,
    ]);

    const createCart = (item?: ICartItem) => {
        console.debug("Creating new cart");
        create(
            {
                ...resource,
                values: {
                    uid: user?.uid ?? null,
                    items: [item],
                    updatedAt: Date.now(),
                },
                successNotification: false,
            },
            {
                onSuccess(data, variables, context) {
                    setCartId(data.data.id);
                },
            },
        );
    };

    const updateCart = (
        updateCart: ICart,
        items?: ICartItem[] | FieldValue,
        uid?: string,
    ) => {
        firebaseAuthProvider().login({
            providerName: "",
        });

        console.debug("Updating cart");
        update(
            {
                ...resource,
                id: updateCart.id,
                values: {
                    ...(!!items && { items }),
                    ...(!!uid && { uid }),
                    updatedAt: Date.now(),
                },
                successNotification: false,
                errorNotification(error, values, resource) {
                    return {
                        type: "error",
                        description: `${error?.statusCode} - ${error?.message}`,
                        message: "Cập nhật giỏ hàng không thành công",
                    };
                },
            },
            {
                onError(error, variables, context) {
                    console.error("hello error", error);
                },
            },
        );
    };

    const mergeCart = (userCart: ICart, localCart: ICart) => {
        console.log("start to merge cart");
        localCart.items.forEach((item) => {
            const idx = userCart.items.findIndex(
                (userItem) => userItem.variantId === item.variantId,
            );
            if (idx === -1) {
                userCart.items.push(item);
            } else {
                const userItem = userCart.items[idx];
                const updatedItem = {
                    ...userItem,
                    quantity: item.quantity + userItem.quantity,
                };

                userCart.items[idx] = updatedItem;
            }
            update(
                {
                    ...resource,
                    id: userCart.id,
                    values: {
                        items: userCart.items,
                    },
                    successNotification: false,
                },
                {
                    onSuccess(data, variables, context) {
                        console.log("done merge cart");
                        deleteOne({
                            ...resource,
                            id: localCart.id,
                            successNotification: false,
                        });
                    },
                },
            );
        });
    };

    useUpdateEffect(() => {
        setStatus(status);
        if (!!cartId && status !== "loading") {
            console.debug("Setting cart data to store");
            setCart(data?.data);
            return;
        }
        setCart(null);
    }, [data?.data, cartId, status]);

    //update when user changes
    useUpdateEffect(() => {
        const checkCartWhenLoggedIn = async () => {
            if (!!!user) {
                return;
            }

            const cartData = await firestoreDB.getList({
                ...resource,
                filters: [
                    {
                        field: "uid",
                        value: user?.uid || null,
                        operator: "eq",
                    },
                ],
                pagination: {
                    pageSize: 1,
                },
            });
            const userCart = (cartData.data as ICart[])?.[0];
            if (cartId === userCart?.id) return;
            if (!!userCart) {
                if (!!cartId) {
                    await new Promise((resolve) => {
                        if (!!data?.data) {
                            resolve(mergeCart(userCart, data.data));
                        }
                    });
                }
                setCartId(userCart.id);
                return;
            }
            if (!!cartId) {
                //todo: update localcartid with userId
                update({
                    ...resource,
                    id: cartId,
                    values: {
                        uid: user.uid,
                    },
                    successNotification: false,
                });
            }
        };
        const checkCartWhenNotLoggedIn = async () => {
            // console.log("cart?.uid", cart?.uid);
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
        cart,
        items: cart?.items || [],
        status,
        addItem: async (item) => {
            if (!!!cartId) {
                createCart(item);
                return;
            }

            if (!!!cart) {
                if (isFetched) console.error("Cart not found");
                return;
            }

            const filtered = cart.items.filter(
                (cartItem) => cartItem.variantId !== item.variantId,
            );

            updateCart(
                cart,
                filtered.length === cart.items.length
                    ? arrayUnion(item)
                    : [...filtered, item],
            );
        },

        removeItem: (item: ICartItem) => {
            if (!!!cart) {
                console.error("Cart not found - Cannot remove item");
                return;
            }
            updateCart(cart, arrayRemove(item));
        },
    };
};
export default useCart;

export const useCartItems = () =>
    useStore(useCartStore, (state) => state.cart)?.items ?? [];
export const useCartStatus = () => useCartStore((state) => state.status);
// export const useCartItems = () => useCart().items;
// export { useCartStore };
