import Cart from "app/(store)/cart/Cart";
import { Suspense } from "react";

const CartPage = async () => {
    // await new Promise((res) => setTimeout(res, 3000));
    return (
        <div className="mx-4">
            <Suspense fallback={<>Your cart will be available in a minute</>}>
                <Cart />
            </Suspense>
        </div>
    );
};
export default CartPage;
