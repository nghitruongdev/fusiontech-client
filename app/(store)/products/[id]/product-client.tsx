"use client";

import { Rating } from "@smastrom/react-rating";
import { CarrotIcon, Heart } from "lucide-react";
import { PropsWithChildren, createContext, useContext } from "react";
import { IProduct, IVariant } from "types";
import { projection as variantProjections } from "@/lib/data/variants";
import { useCustom } from "@refinedev/core";
import { cleanUrl } from "@/lib/utils";
import { useOptionStore } from "./ProductOptions";
import useCart, {
    ALLOW_QUANTITY,
    useCartItems,
} from "@components/store/cart/useCart";
import { cn } from "components/lib/utils";
import useNotification from "@/hooks/useNotification";
type ContextState = {
    product: IProduct;
    variants: {
        data: IVariant[] | undefined;
        status: "loading" | "success" | "error";
    };
};
const ProductContext = createContext<ContextState | null>(null);
const useProductContext = () => {
    const ctx = useContext(ProductContext);
    if (!ctx) throw new Error("ProductContext is missing");
    return ctx;
};

const ProductContextProvider = ({
    product,
    children,
}: PropsWithChildren<{ product: IProduct }>) => {
    const { _links } = product;
    const projection = variantProjections.withAttributes;
    const { data, status } = useCustom<IVariant[]>({
        url: `${cleanUrl(_links?.variants.href ?? "")}`,
        meta: {
            resource: "variants",
            projection,
        },
        config: {
            query: { projection },
        },

        method: "get",
        queryOptions: {
            enabled: !!_links,
        },
    });

    return (
        <ProductContext.Provider
            value={{ product, variants: { data: data?.data, status } }}
        >
            {children}
        </ProductContext.Provider>
    );
};

export const ProductImages = () => {
    const {
        product: { thumbnail },
    } = useProductContext();
    return (
        <div className="flex">
            <div className="w-1/5 flex flex-col space-y-2 overflow-auto items-center">
                {Array.from({ length: 5 }).map((_, idx, arr) => (
                    <div key={idx} className="p-2 w-1/2 hover:border ">
                        <img
                            src={thumbnail}
                            alt="product image"
                            className="cursor-move duration-500"
                        />
                    </div>
                ))}
            </div>
            <div className="w-4/5">
                <img
                    src={thumbnail}
                    alt="product image"
                    className="w-[80%] transform-origin-top-left cursor-move duration-500"
                />
            </div>
        </div>
    );
};

export const ProductRating = async () => {
    const {
        product: { avgRating, reviewCount },
    } = useProductContext();
    return (
        <div className="flex gap-1 text-sm items-center text-zinc-950 mt-2">
            <div className="rating gap-1">
                <Rating
                    style={{ maxWidth: 180 }}
                    value={3.45}
                    readOnly
                    className="h-5"
                />
            </div>
            <p className="">({avgRating})</p>
            <p className="underline leading-none text-sm">
                {reviewCount} nhận xét
            </p>
        </div>
    );
};
export const ProductCartButton = () => {
    const {
        variants: { data: variants, status },
    } = useProductContext();
    const [groups, selected] = useOptionStore((state) => [
        state.groups,
        state.selected,
    ]);
    const { addItem, updateItem } = useCart();
    const cartItems = useCartItems();
    const { open: show } = useNotification();
    const groupLength = Object.keys(groups).length;
    const selectedLength = Object.keys(selected).length;
    const isAddable = groupLength === selectedLength;
    const addToCartHandler = () => {
        if (!variants) {
            show({
                type: "warning",
                title: "Đang chờ tải các tuỳ chọn sản phẩm",
                colorScheme: "orange",
                position: "top",
            });
            return;
        }
        if (groupLength !== selectedLength) {
            show({
                type: "warning",
                title: "Bạn chưa chọn các tuỳ chọn",
                colorScheme: "teal",
                position: "top",
            });
            return;
        }
        const variant = variants.find((variant) =>
            variant.attributes?.every(
                ({ value, name }) => selected[name] === value,
            ),
        );
        if (variant) {
            const item = cartItems[variant.id];
            if (item) {
                if (item?.quantity === ALLOW_QUANTITY) {
                    show({
                        type: "warning",
                        title: `Chỉ được thêm tối đa 10 sản phẩm vào giỏ hàng`,
                    });
                    return;
                }
                updateItem({ ...item, quantity: item.quantity + 1 });
            } else {
                addItem({ variantId: variant.id, quantity: 1 });
            }

            show({
                type: "success",
                title: `Thêm sản phẩm với phiên bản ${variant.id} vào giỏ hàng`,
            });

            return;
        }
        show({
            type: "error",
            title: `Không tìm thấy phiên bản sản phẩm tương ứng`,
            description: (
                <>
                    <p>{JSON.stringify(selected)}</p>
                </>
            ),
        });
    };

    return (
        <div className="border-b-[1px] border-b-zinc-300 pb-4 my-2">
            <button
                onClick={addToCartHandler}
                disabled={!isAddable}
                className={cn(
                    `
                mx-auto w-32 h-10 flex items-center justify-center gap-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-md text-zinc-50 rounded-full duration-300
                `,
                    "disabled:cursor-not-allowed disabled:bg-blue-400",
                )}
            >
                <span>Thêm</span>{" "}
                <span>
                    <CarrotIcon />
                </span>
            </button>
        </div>
    );
};

export const ProductFrequentBoughtTogether = () => {
    return (
        <div className="">
            <p className="">Sản phẩm thường được mua cùng</p>
        </div>
    );
};

export const ProductViewRecently = () => {
    return (
        <div className="">
            <p className="text-2xl font-bold mt-4">Sản phẩm đã xem gần đây</p>
            <div className=""></div>
        </div>
    );
};

export const ProductFavoriteDetails = () => {
    return (
        <>
            <div className="flex gap-2 relative border-b mt-2">
                <p className="p-2 text-blue-700 text-sm font-semibold">
                    500+ khách hàng đã mua sản phẩm
                </p>
                <Heart className="text-gray-600 text-2xl absolute top-2 right-2" />
            </div>
        </>
    );
};

export default ProductContextProvider;
export { useProductContext };
