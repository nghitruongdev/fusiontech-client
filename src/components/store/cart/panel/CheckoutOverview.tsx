"use client";
import FormatPrice from "@components/client/FormatPrice";
import { useSelectedCartItemStore } from "../useSelectedItemStore";
const useSelectedItems = () => useSelectedCartItemStore((state) => state.items);

const Overview = () => {
    const [items] = useSelectedCartItemStore((state) => [state.items]);

    return (
        <>
            {/* <CheckoutOverview.Provider items={items}> */}
            <Overview.Price />
            <Overview.Shipping />
            <Overview.Total />
            {/* </CheckoutOverview.Provider> */}
        </>
    );
};

Overview.Price = () => {
    const items = useSelectedItems();
    return (
        <div className="w-full flex flex-col gap-4 border-b-[1px] border-b-zinc-200">
            <div className="flex flex-col gap-1">
                <div className="text-sm flex justify-between">
                    <p className="font-semibold">
                        Thành tiền <span>({items.length} sản phẩm)</span>
                    </p>

                    <p className="line-through text-zinc-500 text-base">
                        <FormatPrice amount={400} />
                    </p>
                </div>

                <div className="text-sm flex justify-between mb-1">
                    <p className="font-semibold">Bạn tiết kiệm được</p>
                    <p className="text-[#2a8703] font-bold bg-green-100 px-[2px] rounded-lg inline-flex">
                        -<FormatPrice amount={200} />
                    </p>
                </div>
                {/* <div className="text-sm flex justify-between">
                        <p className="font-semibold">Thành tiền tạm tính</p>
                        <p className="text-zinc-800 font-normal text-base">
                            <FormatPrice amount={500} />
                        </p>
                    </div> */}
            </div>
        </div>
    );
};
Overview.Shipping = () => {
    return (
        <div className="w-full flex flex-col gap-4 border-b-[1px] border-b-zinc-200 mb-1">
            <div className="flex flex-col gap-1">
                <div className="text-sm flex justify-between">
                    <p className="font-semibold">Phí vận chuyển</p>
                    <p className="text-[#2a8703]">Miễn phí</p>
                </div>
                <p className="text-xs text-muted-foreground">
                    Chính sách vận chuyển tại FusionTech
                </p>

                {/* <div className="text-sm flex justify-between">
                        <p className="text-sm font-semibold">Thuế VAT</p>
                        <p className="text-zinc-800">Đã bao gồm</p>
                    </div> */}
            </div>
        </div>
    );
};

Overview.Total = () => {
    return (
        <div className="flex items-center justify-between border-b-[1px] border-b-zinc-200">
            <p className="text-xl font-semibold">Thành tiền</p>
            <p className="text-zinc-800 font-bold text-lg">
                <FormatPrice amount={1000} />
            </p>
        </div>
    );
};

export { Overview as CartOverview };
