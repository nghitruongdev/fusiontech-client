"use client";
import { ICartItem, IVariant } from "types";
import Image from "next/image";
import { useFetch, useUpdateEffect } from "usehooks-ts";
import VisualWrapper from "@components/VisualWrapper";
import { phoneImg } from "@public/assets/images";
import { Suspense, createContext, use, useContext, useRef } from "react";
import CartItem from "./CartItem";
import { useSelectedCartItemStore } from "./useSelectedItemStore";
import { Award, BadgeCheck } from "lucide-react";
import { useCartItems } from "./useCart";

const CartItemList = () => {
    const data = useFetch<IVariant[]>("/api/products", {});
    return (
        <div about="Cart Item List">
            <div className="flex flex-col gap-5">
                <CartItemList.Provider>
                    <CartItemList.Header />
                    <Suspense fallback="Loading items in cart....">
                        <CartItemList.Body />
                    </Suspense>
                </CartItemList.Provider>
            </div>
        </div>
    );
};

type ContextProps = {
    status: string;
};
const useCartContext = () => {
    const context = useContext(CartItemList.Context);
    if (!!!context) throw new Error("CartItemList.Context is not found");
    return context;
};

CartItemList.Context = createContext<ContextProps | undefined>(undefined);
CartItemList.Provider = ({ children }: React.PropsWithChildren<{}>) => {
    // const status = useCartStatus();
    const status = "success";
    return (
        <CartItemList.Context.Provider value={{ status }}>
            {children}
        </CartItemList.Context.Provider>
    );
};

CartItemList.Header = () => {
    const items = useCartItems();
    return (
        <>
            <h1 className="text-2xl font-bold text-black">
                <span>Giỏ hàng </span>
                <span className="text-lightText font-normal">
                    ({Object.keys(items).length ?? 0} sản phẩm)
                </span>
            </h1>
            {/* <div className="text-xl font-bold flex items-center gap-2 mb-2">
                <Image className="w-10" src={phoneImg} alt="phoneImage" />
                <p>Pickup and delivery options</p>
            </div> */}
        </>
    );
};

CartItemList.Body = () => {
    const items = Object.values(useCartItems()).reverse();
    const ctx = useCartContext();
    console.count("CartItemList Body rendered");

    // use(
    //     new Promise((res) => {
    //         if (ctx.status === "success") {
    //             res(undefined);
    //         }
    //     }),
    // );
    // if i use like this, will cause hydration failed
    // if (status === "loading") return <>Loading items in your cart...</>;
    return (
        <>
            <div className="w-full p-5 border-[1px] border-zinc-400 rounded-md flex flex-col gap-4">
                <div className="flex justify-between">
                    <CartItemList.SelectAllCheckbox items={items} />
                    <div className="flex">
                        {/* <Award color="#1e51c8" className="text-sm" /> */}
                        <p className="">
                            <span className="mx-1 font-medium text-xs text-zinc-500">
                                Hãng chính hãng được bán và phân phối bởi
                            </span>
                            <span className="text-sky-600 font-semibold text-md">
                                FusionTech
                            </span>
                        </p>
                    </div>
                </div>
                <div className="">
                    <div className="grid grid-cols-1 gap-4 border-b-[1px] border-b-zinc-200 mb-2">
                        {items.map((item) => (
                            <CartItem
                                item={item}
                                key={item.id ?? Math.random()}
                            />
                        ))}
                    </div>
                    <button className="w-44 bg-red-500 text-white h-10 rounded-full text-base font-semibold hover:bg-red-800 duration-300 mt-4">
                        Reset Cart
                    </button>
                </div>
            </div>
        </>
    );
};

CartItemList.SelectAllCheckbox = ({ items }: { items: ICartItem[] }) => {
    const allRef = useRef<HTMLInputElement>(null);
    const [selected, addAll, clearAll] = useSelectedCartItemStore((state) => [
        state.items,
        state.addAll,
        state.clearAll,
    ]);
    const toggleAll = () => {
        const isSelected = allRef.current?.checked;
        if (!isSelected) {
            clearAll();
            return;
        }
        addAll(items);
    };
    useUpdateEffect(() => {
        if (!!!allRef.current) return;
        if (selected.length === items.length && !!items.length) {
            allRef.current.checked = true;
        } else {
            allRef.current.checked = false;
        }
    }, [selected.length]);

    return (
        <>
            <label htmlFor="all" className="flex items-center">
                <input
                    type="checkbox"
                    ref={allRef}
                    onChange={toggleAll}
                    id="all"
                />
                <span className="text-muted-foreground text-sm mx-2">
                    Chọn tất cả
                </span>
            </label>
        </>
    );
};

export default CartItemList;
