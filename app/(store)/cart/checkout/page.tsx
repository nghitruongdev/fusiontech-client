"use client";
import CheckoutForm from "./(form)/index";
import { useForm } from "@refinedev/react-hook-form";
import { ICartItem, ICheckout } from "@/interfaces";
import { HttpError, useCustom, useCustomMutation } from "@refinedev/core";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import OrderOverview from "./(side bar)/OrderOverview";
import { API_URL, RESOURCE_API } from "@/constants";
import { Spinner } from "@chakra-ui/react";

// const getShippingAddress = async (): Promise<ShippingAddress[]> => {
//     // const res = await fetch(`http://localhost:3000/api/products/${_id}`);
//     // The return value is *not* serialized
//     // You can return Date, Map, Set, etc.

//     // Recommendation: handle errors
//     const res = await fetch(`${APP_API.shippingAddress}`);
//     if (!res.ok) {
//         // This will activate the closest `error.js` Error Boundary
//         throw new Error("Failed to fetch data");
//     }

//     return res.json();
// };

const CheckoutPage = () => {
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //     redirect("/api/auth/signin?to=/cart/checkout");
    // }
    const { data: session, status } = useSession({
        required: true,
    });

    const { data } = useCustom({
        url: "http://localhost:3000/api/cart/items",
        method: "get",
    });
    const cartItems = (data?.data ?? []) as ICartItem[];

    const {
        setValue,
        formState: { errors, isLoading, isSubmitting },
        refineCore: { formLoading, onFinish },
        saveButtonProps,
        register,
        reset,
        handleSubmit,
    } = useForm<ICheckout, HttpError, ICheckout>({
        refineCoreProps: {
            action: "create",
        },
    });
    const { mutateAsync } = useCustomMutation({
        mutationOptions: {},
    });
    useEffect(() => setValue("items", cartItems), []);

    const checkoutHandler = () => {
        console.log("checkout button clicked");
        const url = `${API_URL}/${RESOURCE_API.orders().checkout}`;
        handleSubmit(async (data) => {
            console.log("data", data);
            await new Promise((resolve) => setTimeout(resolve, 3000));
            // mutateAsync(
            //     {
            //         url,
            //         method: "post",
            //         values: {
            //             data,
            //         },
            //     },
            //     {
            //         onSettled(data, error, variables, context) {
            //             console.log("Done submitting the order");
            //         },
            //     },
            // );
            console.log("Last in handle submit");
        })();

        console.log("Outside handle submit");
    };
    return (
        <div className="min-h-[600px] flex bg-gray-50 w-4/5 mx-auto max-w-7xl">
            {!isSubmitting && (
                <>
                    <div className=" w-3/4 p-4">
                        <CheckoutForm setValue={setValue} register={register} />
                    </div>
                    <div className="w-2/5  p-4">
                        <OrderOverview
                            cartItems={cartItems ?? []}
                            isSubmitting={isSubmitting}
                            checkoutHandler={checkoutHandler}
                        />
                    </div>
                </>
            )}
            {isSubmitting && (
                <div className="pt-[200px] gap-4 w-full">
                    <div className="w-full flex justify-center items-center gap-4">
                        <h1>Đang tiến hành đặt hàng</h1>
                        <Spinner
                            size="xl"
                            thickness="3px"
                            color="blue.500"
                            speed={"0.45s"}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
export default CheckoutPage;
