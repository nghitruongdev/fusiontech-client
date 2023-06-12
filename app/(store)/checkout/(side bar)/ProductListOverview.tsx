// "use client";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "components/ui/accordion";
import { TbReload } from "react-icons/tb";
import Image from "next/image";

const ProductListOverview = () => {
    const tags = Array.from({ length: 10 }).map(
        (_, i, a) => `v1.2.0-beta.${a.length - i}`,
    );

    return (
        <>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>
                        <h4 className=" font-semibold text-md text-zinc-700 py-0">
                            Xem chi tiết (16 sản phẩm)
                        </h4>
                    </AccordionTrigger>
                    <AccordionContent className="bg-transparent">
                        {Array.from({ length: 50 }).map((_, i, a) => (
                            <div
                                className="h-[100px] rounded-md bg-gray-50 mt-2"
                                key={i}
                            >
                                <ProductBox />
                            </div>
                        ))}

                        <div className="h-[100px] rounded-md bg-gray-50 mt-2">
                            <ProductBox />
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </>
    );
};

export default ProductListOverview;

const ProductBox = () => {
    return (
        <>
            <div className="flex gap-4 h-full px-2 py-2">
                <div className="flex items-center justify-center">
                    <Image
                        className="w-32"
                        width={500}
                        height={500}
                        alt="productImg"
                        src={"https://i.ibb.co/1r28gMk/1.webp"}
                    />
                </div>
                <div className="w-full">
                    <div className="flex justify-between items-center w-full">
                        <h2 className="text-base text-zinc-900 font-[500]">
                            Canon ABC 2023
                        </h2>
                        <p className="text-base text-zinc-900 font-[500]">
                            $240.00
                        </p>
                    </div>

                    <p className="text-sm text-zinc-500">Số lượng: 5</p>
                    <p className="text-sm text-zinc-500 flex items-center gap-1">
                        Free 30-day returns
                        <span className="bg-primaryBlue rounded-full text-white text-xs w-4 h-4 flex items-center justify-center">
                            <TbReload className="rotate-180" />
                        </span>
                    </p>
                </div>
                {/* Button */}
            </div>
        </>
    );
};
