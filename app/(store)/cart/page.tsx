import Cart from "app/(store)/cart/(cart)/Cart";
import { Suspense } from "react";

const CartPage = async () => {
    // await new Promise((res) => setTimeout(res, 3000));
    return (
        <div className="mx-4">
            <Cart />
        </div>
    );
};
export default CartPage;
