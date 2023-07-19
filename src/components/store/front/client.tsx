"use client";

import { useBoolean } from "@chakra-ui/react";
import { Heart } from "lucide-react";
import { createContext, useContext, PropsWithChildren } from "react";
import { IProduct } from "types";

type ContextState = {
    product: IProduct;
};
const ProductContext = createContext<ContextState | null>(null);
const useProductCardContext = () => {
    const ctx = useContext(ProductContext);
    if (!ctx) throw new Error("ProductContext.Provider is missing");
    return ctx;
};

export const ProductCardProvider = ({
    children,
    product,
}: PropsWithChildren<{ product: IProduct }>) => {
    return (
        <ProductContext.Provider value={{ product }}>
            {children}
        </ProductContext.Provider>
    );
};

export const FavoriteButton = () => {
    const [isFavorited, { toggle }] = useBoolean(Math.random() > 0.5);
    const [isBouncing, { on: startBouncing, off: stopBouncing }] = useBoolean();
    const { product } = useProductCardContext();
    const onClick = () => {
        if (isFavorited) return;
        startBouncing();
        setTimeout(() => {
            toggle();
            stopBouncing();
        }, 5000);
    };
    return (
        <div
            onClick={onClick}
            className={`absolute ${
                !isFavorited ? "opacity-0 group-hover:opacity-100" : ""
            } ${isBouncing ? "animate-pulse !duration-1000" : ""}
            ${"active:animate-ping"} top-1 right-2 group-hover:bg-white rounded-full p-1 duration-300 ease-in-out`}
        >
            <Heart
                className={`text-sm w-5 h-5 font-bold text-rose-500  ${
                    isFavorited ? "fill-current" : ""
                }`}
            />
        </div>
    );
};
