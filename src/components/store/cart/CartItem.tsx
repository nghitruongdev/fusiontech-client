"use client";

import {
    PropsWithChildren,
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import { HiMinusSm } from "react-icons/hi";
import { MdOutlineAdd } from "react-icons/md";
import { TbReload } from "react-icons/tb";
import { ICartItem } from "types";
import Image from "next/image";
import { useSelectedCartItemStore } from "./useSelectedItemStore";
import { Tooltip } from "@chakra-ui/react";
import { useDebounce } from "usehooks-ts";
import useCart from "./useCart";
import { formatPrice } from "../../../lib/utils";

const CartItem = ({ item }: { item: ICartItem }) => {
    console.count(`CartItem ${item.variantId} rendered`);
    return (
        <>
            <div className="w-full flex p-2 gap-2 border-t-[1px] border-zinc-200">
                <CartItem.Provider item={item}>
                    <CartItem.SelectedCheckbox />
                    <CartItem.ProductInfo />
                </CartItem.Provider>
            </div>
        </>
    );
};
const ItemContext = createContext<ICartItem | null>(null);

CartItem.Provider = ({
    children,
    item,
}: {
    children: ReactNode;
    item: ICartItem;
}) => {
    return <ItemContext.Provider value={item}>{children}</ItemContext.Provider>;
};

CartItem.SelectedCheckbox = () => {
    const [selectedItems, add, remove] = useSelectedCartItemStore((state) => [
        state.items,
        state.addSelectedItem,
        state.removeSelectedItem,
    ]);
    const item = useContext(ItemContext);
    const isSelected = selectedItems.some(
        (selected) => selected.variantId === item?.variantId,
    );
    const changeHandler = () => {
        if (item === null) return;
        if (isSelected) {
            remove(item);
        } else {
            add(item);
        }
    };
    return (
        <input type="checkbox" checked={isSelected} onChange={changeHandler} />
    );
};

CartItem.ProductInfo = () => {
    const item = useContext(ItemContext);

    return (
        <div className="flex flex-grow justify-between gap-2">
            <div className="w-3/4 flex items-center gap-4">
                <Image
                    className="w-32"
                    width={500}
                    height={500}
                    alt="productImg"
                    src={"https://i.ibb.co/1r28gMk/1.webp"}
                />
                <div className="mx-4">
                    <h2 className="text-base text-zinc-900">
                        {item?.variantId} Canon ABC 2023{" "}
                    </h2>
                    <p className="text-sm text-zinc-500">Price: $240.00</p>
                    <p className="text-sm text-zinc-500 flex items-center gap-1">
                        <span className="bg-primaryBlue rounded-full text-white text-xs w-4 h-4 flex items-center justify-center">
                            <TbReload className="rotate-180" />
                        </span>
                        Free 30-day returns
                    </p>
                    <div className="mt-2 flex items-center gap-6">
                        <CartItem.ProductInfoButton />
                    </div>
                </div>
                {/* Button */}
            </div>
            <div className="w-1/4 text-right flex flex-col items-end gap-1">
                <CartItem.ProductInfoPrice />
            </div>
        </div>
    );
};

CartItem.ProductInfoPrice = () => {
    return (
        <>
            <p className="font-semibold text-xl text-green-500">
                {formatPrice(3 * 5)}
            </p>
            <p className="text-sm line-through text-zinc-500">
                {formatPrice(3 * 5)}
            </p>
            <div className="flex items-center text-xs gap-2">
                <p className="bg-green-200 text-[8px] uppercase px-2 py-[1px]">
                    You save
                </p>
                <p className="text-[#2a8703] font-semibold">
                    {formatPrice(3 * 5)}
                </p>
            </div>
        </>
    );
};
CartItem.ProductInfoButton = () => {
    const { removeItem, updateItem } = useCart();
    const item = useContext(ItemContext);
    if (!!!item)
        throw new Error("Use Context is called outside Item Context Provider");
    // const quantity = item.quantity;
    const [quantity, setQuantity] = useState<number>(item.quantity);
    const debounceValue = useDebounce(quantity, 300);

    const isAddOk = quantity < 10;
    const isMinusOk = quantity > 1;

    const removeItemHandler = () => {
        if (!!!item?.id) {
            console.error("ID item not found");
            return;
        }
        const result = confirm("Do you really want to delete items?");
        if (result) {
            removeItem(item.id);
        }
    };

    const updateQuantityHandler = (isPlus: boolean) => {
        if (isPlus) {
            setQuantity((prev) => prev + 1);
        } else {
            if (quantity <= 1) {
                removeItemHandler();
                return;
            }
            setQuantity((prev) => prev - 1);
        }
    };

    useEffect(() => {
        console.count(`debounce effect ran ${debounceValue}`);
        if (debounceValue !== item.quantity) {
            updateItem({ ...item, quantity: debounceValue });
        }
    }, [debounceValue]);

    useEffect(() => {
        setQuantity(item.quantity);
    }, [item.quantity]);
    return (
        <>
            <button
                onClick={removeItemHandler}
                className="text-sm underline underline-offset-2 decoration-[1px] text-zinc-600 hover:no-underline hover:text-primaryBlue duration-300"
            >
                Xoá
            </button>

            <div className="w-28 h-9 border border-zinc-400 rounded-full text-base font-semibold text-black flex items-center justify-between px-3">
                <button
                    onClick={updateQuantityHandler.bind(this, false)}
                    className={`text-base w-5 h-5 text-zinc-600 hover:-bg[#74767c] hover:text-zinc-400 rounded-full flex items-center justify-center cursor-pointer duration-200`}
                >
                    <HiMinusSm />
                </button>

                <span className="select-none">{quantity}</span>

                <ConditionTooltip
                    condition={!isAddOk}
                    label="Số lượng đặt tối đa là 10 sản phẩm"
                >
                    <button
                        onClick={updateQuantityHandler.bind(this, true)}
                        {...(!isAddOk && { disabled: true })}
                        className={`text-base w-5 h-5 text-zinc-600 hover:-bg[#74767c] hover:text-zinc-400 rounded-full flex items-center justify-center cursor-pointer duration-200  ${
                            !isAddOk &&
                            "opacity-50 cursor-not-allowed cursor-event-none"
                        }`}
                    >
                        <MdOutlineAdd />
                    </button>
                </ConditionTooltip>
            </div>
        </>
    );
};

const ConditionTooltip = ({
    children,
    condition,
    label,
}: PropsWithChildren<{ condition?: boolean; label: string }>) => {
    if (condition)
        return (
            <Tooltip
                hasArrow
                label={label}
                bg="gray.100"
                color="blackAlpha.700"
            >
                {children}
            </Tooltip>
        );
    return <>{children}</>;
};
export default CartItem;
