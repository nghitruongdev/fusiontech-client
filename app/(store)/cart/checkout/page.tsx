// import { useSsr } from "usehooks-ts";
import Checkout from "@components/store/cart/checkout";
import CheckoutProvider from "@components/store/cart/checkout/CheckoutProvider";

const CheckoutPage = async () => {
    const {} = {
        options: {
            required: true,
            callbackUrl: "/auth/signin",
        },
    };

    // const cartItems = (data?.data ?? []) as ICartItem[];

    // useEffect(() => setValue("items", cartItems), [data?.data]);
    // useEffect(() => {
    //     setValue("userId", fakeUserId);
    //     // router.prefetch("/cart/checkout/success");
    // }, []);
    return (
        <CheckoutProvider>
            <Checkout />
        </CheckoutProvider>
    );
};

export default CheckoutPage;
