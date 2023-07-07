"use client";

import useCart, { useCartItems } from "@components/store/cart/useCartStore";
import Link from "next/link";
import { BsCart2 } from "react-icons/bs";

const HeaderCartButton = () => {
    const {} = useCart();
    const items = useCartItems();
    return (
        <>
            <Link href="/cart">
                <div className="flex flex-col justify-center items-center gap-2 h-12 px-5 rounded-full bg-transparent hover:bg-hoverBg duration-300">
                    <div className="relative">
                        <BsCart2 className="text-2xl" />
                        <span className="absolute w-4 h-4 bg-yellow text-black -top-1 -right-1 rounded-full flex items-center justify-center font-bodyFont text-xs">
                            {items.length}
                        </span>
                    </div>

                    {/* <p className="text-[10px] -mt-2">$0.00</p> */}
                </div>
            </Link>
        </>
    );
};
export default HeaderCartButton;
