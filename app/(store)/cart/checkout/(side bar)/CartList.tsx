// "use client";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@components/ui/shadcn/accordion";
import { TbReload } from "react-icons/tb";
import Image from "next/image";
import { ICartItem } from "@/interfaces";

const CartList = ({ items }: { items: ICartItem[] }) => {
    const tags = Array.from({ length: 10 }).map(
        (_, i, a) => `v1.2.0-beta.${a.length - i}`,
    );

    return (
        <>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>
                        <h4 className=" font-semibold text-md text-zinc-700 py-0">
                            Xem chi tiết ({items.length} sản phẩm)
                        </h4>
                    </AccordionTrigger>
                    <AccordionContent className="bg-transparent">
                        {items.map((item) => (
                            <CartItemBox
                                item={item}
                                key={`${item.variantId}-${Math.random()}`}
                            />
                        ))}

                        {/* <div className="h-[100px] rounded-md bg-gray-50 mt-2">
                            <ProductBox />
                        </div> */}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </>
    );
};

export default CartList;

const CartItemBox = ({
    item: { variantId, quantity, price },
}: {
    item: ICartItem;
}) => {
    return (
        <>
            <div className="flex gap-2 px-2 py-2 min-h-[100px] rounded-md bg-gray-50 mt-3 border-[1px] border-gray-100">
                <div className="flex items-center justify-center">
                    <Image
                        className="w-32"
                        width={500}
                        height={500}
                        alt="productImg"
                        src={"https://i.ibb.co/1r28gMk/1.webp"}
                    />
                </div>
                <div className="w-full flex flex-col gap-1">
                    <div className="w-full">
                        <h2 className="text-base text-zinc-900 font-[500]">
                            Canon ABC 2023
                        </h2>
                        <p className="text-sm text-zinc-500">${price}</p>
                    </div>

                    <p className="text-sm text-zinc-500">
                        Số lượng: {quantity}
                    </p>
                    <p className="text-sm text-zinc-500 flex items-center gap-1">
                        Free 30-day returns
                        <span className="bg-primaryBlue rounded-full text-white text-xs w-4 h-4 flex items-center justify-center">
                            <TbReload className="rotate-180" />
                        </span>
                    </p>
                </div>
            </div>
        </>
    );
};
