"use client";
import Link from "next/link";
import Image from "next/image";
import { warningImg } from "@public/assets/images";
import { IoMdClose } from "react-icons/io";
import VisualWrapper from "@components/VisualWrapper";
import { CartOverview } from "./CheckoutOverview";
import { useSelectedCartItemStore } from "../useSelectedItemStore";

const Panel = () => {
    return (
        <VisualWrapper name="Checkout Panel">
            <div className="mr-2 py-8 px-4 mt-24 rounded-md flex flex-col justify-center gap-4 border-[1px] border-zinc-400">
                <Panel.Promotion />
                <Panel.Overview />
                <Panel.Login />
            </div>
        </VisualWrapper>
    );
};

Panel.Login = () => {
    // const isAuthenticated = useAuthClientCookie().isAuthenticated;
    const isAuthenticated = false;
    const isSelected = useSelectedCartItemStore((state) => state.items).length;
    return (
        <div className="mt-2">
            <Link
                href="/cart/checkout"
                className={`${
                    !isSelected && "pointer-events-none select-none"
                }`}
            >
                <p
                    className={`flex items-center justify-center mx-auto w-3/4 text-white h-10 font-semibold duration-300 rounded-full ${
                        isSelected
                            ? "bg-primaryBlue hover:bg-hoverBg"
                            : "bg-blue-400"
                    }`}
                >
                    {isSelected ? "Tiếp tục đến thanh toán" : "Chọn sản phẩm"}
                </p>
            </Link>
            {isAuthenticated && (
                <p className="text-sm text-center leading-none mt-1">
                    <span>
                        Bạn hãy{" "}
                        <span className="leading-normal text-md font-medium underline underline-offset-2 decoration-[1px]">
                            đăng nhập
                        </span>{" "}
                        để có trải nghiệm mua sắm tốt nhất
                    </span>
                </p>
            )}
        </div>
    );
};

Panel.Promotion = () => {
    return (
        <>
            <div className="bg-[#002d58] text-white p-2 rounded-lg flex items-center justify-between gap-4">
                <Image className="w-8" src={warningImg} alt="warningImg" />
                <p className="text-sm">
                    Đang có sản phẩm giảm giá trong giỏ hàng của bạn. Hãy đặt
                    mua ngay để nhận tối đa ưu đãi!
                </p>
                <IoMdClose
                    // onClick={() => setWarningMsg(false)}
                    className="text-3xl hover:text-red-400 cursor-pointer duration-200"
                />
            </div>
        </>
    );
};

Panel.Overview = CartOverview;

export { Panel as CartPanel };
