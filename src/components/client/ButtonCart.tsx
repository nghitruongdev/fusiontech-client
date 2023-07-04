"use client";

import { IProduct } from "types";
import Link from "next/link";
import { GoPlus } from "react-icons/go";

const ButtonCart = ({ product }: { product: IProduct }) => {
    return (
        <>
            {/* <button className="w-20 h-9 bg-primaryBlue text-white rounded-full flex gap-1 items-center justify-center hover:bg-hoverPrimaryBlue duration-300">
                <span>
                    <GoPlus />
                </span>
                Add
            </button> */}
            <Link
                href={{
                    pathname: `/products/${product._id}`,
                    query: {
                        product: JSON.stringify(product),
                    },
                }}
                as={`/products/${product._id}`}
            >
                <button className="w-24 h-9 bg-white border-[1px] border-black text-black rounded-full flex items-center justify-center gap-1 hover:bg-black hover:text-white duration-300">
                    <span>
                        <GoPlus />
                    </span>
                    Details
                </button>
            </Link>
        </>
    );
};
export default ButtonCart;
