"use client";
import CheckoutForm from "./(form)/index";
import { useForm } from "@refinedev/react-hook-form";
import { ICartItem, ICheckout } from "@/interfaces";
import { HttpError, useCustom, useCustomMutation } from "@refinedev/core";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import OrderOverview from "./(side bar)/OrderOverview";
import { API_URL, RESOURCE_API, fakeUserId } from "@/constants";
import { Spinner } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

const CheckoutPage = () => {
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //     redirect("/api/auth/signin?to=/cart/checkout");
    // }
    const router = useRouter();
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
    useEffect(() => setValue("items", cartItems), [data?.data]);
    useEffect(() => {
        setValue("userId", fakeUserId);
        router.prefetch("/cart/checkout/success");
    }, []);

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
