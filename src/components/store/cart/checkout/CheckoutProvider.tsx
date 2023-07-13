"use client";
import VisualWrapper from "@components/ui/VisualWrapper";
import { useCustomMutation } from "@refinedev/core";
import { UseFormReturnType, useForm } from "@refinedev/react-hook-form";
import { useRouter } from "next/navigation";
import { createContext, useContext, useRef } from "react";
import { ICartItem, ICheckout } from "types";
import { API_URL, RESOURCE_API } from "types/constants";
import { createStore, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import Checkout from ".";

type State = {
    items: ICartItem[];
};
type StoreState = State & UseFormReturnType<ICheckout>;
type CheckoutStore = ReturnType<typeof createCheckoutStore>;

const createCheckoutStore = (initProps: StoreState) => {
    const defaultProps = {};
    return createStore<StoreState>()(
        immer((set, get) => ({
            ...defaultProps,
            ...initProps,
        })),
    );
};

const Context = createContext<CheckoutStore | null>(null);

type ProviderProps = React.PropsWithChildren<{}>;
export const CheckoutProvider = ({ children }: ProviderProps) => {
    const router = useRouter();
    const formProps = useForm<ICheckout>({
        refineCoreProps: {
            action: "create",
        },
    });
    const {
        setValue,
        formState: { errors, isLoading, isSubmitting },
        refineCore: { formLoading, onFinish },
        saveButtonProps,
        register,
        reset,
        handleSubmit,
    } = formProps;
    const { mutateAsync } = useCustomMutation({
        mutationOptions: {},
    });
    const checkoutHandler = () => {
        console.log("checkout button clicked");
        const url = `${API_URL}/${RESOURCE_API.orders().checkout}`;
        console.log("url", url);
        handleSubmit(async (data) => {
            console.log("data", data);
            window.scrollTo({
                top: 0,
                behavior: "smooth", // Smooth scrolling animation
            });
            await new Promise((resolve) => setTimeout(resolve, 3000));
            mutateAsync(
                {
                    url,
                    method: "post",
                    values: {
                        ...data,
                        payment: {},
                    },
                },

                {
                    onSettled(data, error, variables, context) {
                        console.log("Done submitting the order");
                    },
                    onSuccess(data, variables, context) {
                        router.replace(
                            `/cart/checkout/success?oid=${data?.data}`,
                        );
                    },
                },
            );
            console.log("Last in handle submit");
        })();
        console.log("Outside handle submit");
    };
    const storeRef = useRef<CheckoutStore>();
    if (!!!storeRef.current) {
        storeRef.current = createCheckoutStore({ ...formProps, items: [] });
    }
    return (
        <VisualWrapper isRenderCount>
            <Context.Provider value={storeRef.current}>
                {children}
            </Context.Provider>
        </VisualWrapper>
    );
};

function useCheckoutContext<T>(
    selector: (state: StoreState) => T,
    equalityFn?: (left: T, right: T) => boolean,
): T {
    const store = useContext(Context);
    if (!store) throw new Error("Missing Context.Provider in the tree");
    return useStore(store, selector, equalityFn);
}

export default CheckoutProvider;
export { useCheckoutContext };
