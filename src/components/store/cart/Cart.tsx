import { ReactNode } from "react";
import VisualWrapper from "@components/ui/VisualWrapper";
import CartItemList from "./CartItemList";
import { CartPanel } from "./panel";

type Props = {
    children: ReactNode;
};

const Cart = () => {
    return (
        <VisualWrapper name="Cart">
            <div className="w-full py-10 bg-white text-black">
                <div className="w-full flex gap-10">
                    <div className="w-2/3">
                        <CartItemList />
                    </div>

                    <div className="w-1/3 min-h-[500px]">
                        <CartPanel />
                    </div>
                </div>
            </div>
        </VisualWrapper>
    );
};

export default Cart;
