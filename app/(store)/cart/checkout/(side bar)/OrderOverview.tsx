import { Input } from "@components/ui/shadcn//input";
import ProductListOverview from "./ProductListOverview";
import { Button } from "@components/ui/shadcn/button";

const OrderOverview = () => {
    return (
        <>
            <p className="mx-8 flex justify-between items-center">
                Thông tin đơn hàng{" "}
                <a
                    className="text-blue-500 text-sm font-medium text-end leading-none"
                    href="/"
                >
                    {" "}
                    Chỉnh sửa
                </a>
            </p>
            <div className="bg-white p-4 mx-4 rounded-lg shadow-md">
                <ProductListOverview />
                <div className="flex justify-between">
                    <p className="">Tổng tạm tính</p>
                    <p className="">60.000.000 VNĐ</p>
                </div>
                <div className="flex justify-between">
                    <p className="">Phí vận chuyển</p>
                    <p className="">Miễn phí</p>
                </div>
                <div className="flex justify-between">
                    <p className="">Mã giảm giá</p>
                    <p className="">ABCDEF</p>
                    <p className="">-500.000 VNĐ</p>
                </div>
                <hr />
                <div className="flex justify-between">
                    <p className="">Thành tiền</p>
                    <p className="text-center">
                        50.500.000 VNĐ <br />
                        <span className="text-muted text-sm text-zinc-500">
                            (Đã bao gồm VAT)
                        </span>
                    </p>
                </div>
                <button className="w-full rounded-md bg-blue-600 hover:bg-blue-700 px-4 py-3 mt-3 text-white text-base font-[500]">
                    Xác nhận đặt hàng
                </button>
            </div>

            <div className="p-4 m-5 rounded-lg bg-white shadow-md">
                <Discount />
            </div>
        </>
    );
};

const Discount = () => {
    return (
        <>
            <div className="flex justify-between items-center">
                {" "}
                <p className="">Mã giảm giá</p>
                <span className="text-zinc-500 text-sm text-muted">
                    Nhập mã để được nhận giảm giá
                </span>
            </div>
            <hr className="my-2" />
            <div className="flex gap-2 mt-4">
                <Input placeholder="Mã giảm giá" className="outline-none" />
                <Button className="bg-blue-600 hover:bg-blue-700 px-8">
                    Thêm
                </Button>
            </div>
        </>
    );
};
export default OrderOverview;
