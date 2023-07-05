import VisualWrapper from "@components/VisualWrapper";
import Cart from "@components/store/cart/Cart";
import { Suspense } from "react";

const CartPage = async () => {
    return (
        <div className="mx-4">
            <Cart />
        </div>
    );
};
export default CartPage;
