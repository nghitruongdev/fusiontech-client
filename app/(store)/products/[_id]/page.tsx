import { IoMdHeartEmpty } from "react-icons/io";
import { BsStarFill, BsInfoCircle } from "react-icons/bs";
import { Product } from "@/interfaces";
import { Badge } from "components/ui/badge";
import ProductSpecification from "./ProductSpecification";
import Review from "./(review)/Review";
import Description from "./Description";

async function getData(_id: number): Promise<Product[]> {
    // const res = await fetch(`http://localhost:3000/api/products/${_id}`);
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.

    // Recommendation: handle errors
    const res = await fetch(`http://localhost:3000/api/products`);
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error("Failed to fetch data");
    }

    return res.json();
}

type Props = {
    params: {
        _id: number;
    };
};
const ProductDetails = async ({ params: { _id } }: Props) => {
    const products = await getData(_id);
    const product = products.find(
        (product: Product) => product._id == _id,
    ) as Product;
    const isDiscount = false;
    return (
        <section className="bg-white">
            <div className="w-[90%] mx-auto p-4">
                {/* mx-auto flex items-center py-4 */}
                <div className="flex">
                    <div className="w-2/3 relative">
                        <div className="flex">
                            <div className="w-1/5 flex flex-col space-y-2 overflow-auto items-center">
                                {Array.from({ length: 5 }).map(
                                    (_, idx, arr) => (
                                        <div
                                            key={idx}
                                            className="p-2 w-1/2 hover:border "
                                        >
                                            <img
                                                src={product?.image}
                                                alt="product image"
                                                className="cursor-move duration-500"
                                            />
                                        </div>
                                    ),
                                )}
                            </div>
                            <div className="w-4/5">
                                <img
                                    src={product?.image}
                                    alt="product image"
                                    className="w-[80%] transform-origin-top-left cursor-move duration-500"
                                />
                            </div>
                        </div>
                        <div className="">
                            <p className="">Sản phẩm thường được mua cùng</p>
                        </div>
                    </div>
                    <div className="w-1/3 flex flex-col gap-2 mt-4">
                        <div className="p-4 pt-0 rounded-lg flex flex-col gap-6 shadow-lg border">
                            <div className="flex gap-2 relative border-b mt-2">
                                <p className="p-2 text-blue-700 text-sm font-semibold">
                                    500+ bought since yesterday
                                </p>
                                {/* <div className="flex gap-2">
                                <button className="px-2 py-[1px] text-[#004f9a] text-sm border-[1px] border-[#004f9a] rounded-sm">
                                    Best Seller
                                </button>
                                <button className="px-2 py-[1px] text-red-600 text-sm border-[1px] border-red-600 rounded-sm">
                                    Rollback
                                </button>
                            </div> */}
                                <IoMdHeartEmpty className="text-gray-600 text-2xl absolute top-2 right-2" />
                            </div>

                            {/* Product Info */}
                            <div className="flex flex-col gap-1">
                                <p className="text-sm underline underline-offset-4 ">
                                    {product.brand}
                                </p>
                                <p className="text-2xl font-bold">
                                    {product.title}
                                </p>
                                {/* <p className="text-base text-zinc-500">
                                {product.description}
                            </p> */}
                                {/* <div className="flex items-center space-x-2 text-zinc-950 mt-2"> */}
                                <div className="flex gap-1 text-sm items-center text-zinc-950 mt-2">
                                    <BsStarFill />
                                    <BsStarFill />
                                    <BsStarFill />
                                    <BsStarFill />
                                    <BsStarFill />
                                    <p className="">(5.0)</p>
                                    <p className="underline leading-none text-sm">
                                        11 reviews
                                    </p>
                                </div>
                                {/* </div> */}
                                {/* Product Price */}
                                {isDiscount && (
                                    <div className="flex items-end gap-2 my-2">
                                        <p className="text-3xl text-green-700 font-bold leading-none">
                                            Now ${product.price}
                                        </p>
                                        <p className="text-gray-500 text-md font-normal line-through decoration-[1px] flex gap-1 items-center">
                                            ${product.oldPrice}{" "}
                                            <span>
                                                <BsInfoCircle />
                                            </span>
                                        </p>
                                    </div>
                                )}
                                {!isDiscount && (
                                    <div className="my-2">
                                        <p className="text-3xl text-zinc-950 font-bold leading-none">
                                            ${product.price}
                                        </p>
                                    </div>
                                )}
                                <p className="text-gray-500 text-sm font-medium flex gap-1 items-center ">
                                    Hàng chính hãng được bán bởi FusionTech
                                    <span>
                                        <BsInfoCircle />
                                    </span>
                                </p>

                                <div className="mt-1">
                                    <div className="mb-2">
                                        <p className="font-medium text-sm mb-2">
                                            Màu sắc:{" "}
                                        </p>
                                        <div className="flex gap-2 flex-wrap">
                                            {[
                                                "Đỏ",
                                                "Trắng",
                                                "Xanh",
                                                "Vàng",
                                                "Tím",
                                            ].map((item, idx) => (
                                                <>
                                                    <Badge
                                                        key={item}
                                                        variant={"outline"}
                                                        className="p-2 text-sm rounded-md font-medium min-w-[100px] border-zinc-300 text-zinc-700 flex justify-center cursor-pointer  hover:bg-blue-50 hover:text-blue-700 hover:border-blue-600"
                                                    >
                                                        {item}
                                                    </Badge>
                                                </>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {/* Add to cart  */}
                                <div className="border-b-[1px] border-b-zinc-300 pb-4 my-2">
                                    <button className="w-32 h-10 text-sm font-medium bg-blue-600 hover:bg-blue-700 shadow-md text-zinc-50 rounded-full hover:bg-primaryHoverColor duration-300">
                                        Add to cart
                                    </button>
                                </div>
                                <div className="">
                                    <p className="text-lg font-semibold leading-none">
                                        Tính năng nổi bật
                                    </p>
                                    <p> - Chính hãng, Mới 100%, Nguyên seal</p>
                                    <p>- Màn hình: Super Retina XDR OLED</p>
                                    <p>- Camera sau: 2 x 12MP</p>
                                    <p>- Camera trước: 12MP</p>
                                    <p>- CPU: Apple A15 Bionic</p>
                                    <p>- Bộ nhớ: 512GB</p>
                                    <p>- RAM: 6GB</p>
                                    <p>- Hệ điều hành: IOS</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex border-t shadow-lg rounded-md p-4 mt-4">
                    <div className="w-2/3">
                        <div className="h-[600px]">
                            <p className="font-bold text-xl mb-2">
                                Mô tả sản phẩm
                            </p>
                            <Description />
                        </div>
                        <div className="">
                            <p className="font-bold text-2xl mb-2">
                                Đánh giá sản phẩm
                            </p>
                            <Review />
                        </div>
                    </div>
                    <div className="w-1/3">
                        <p className="font-bold text-xl mb-2">
                            Thông số kỹ thuật
                        </p>
                        <div className="border shadow-lg rounded-b-md">
                            <ProductSpecification />
                        </div>
                    </div>
                </div>
                <div className="">
                    <p className="text-2xl font-bold mt-4">
                        Sản phẩm đã xem gần đây
                    </p>
                    <div className=""></div>
                </div>
            </div>
        </section>
    );
};
export default ProductDetails;
