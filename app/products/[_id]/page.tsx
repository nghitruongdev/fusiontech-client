import { IoMdHeartEmpty } from "react-icons/io";
import { BsStarFill, BsInfoCircle } from "react-icons/bs";
import { ship1Img, ship2Img, ship3Img } from "public/assets/images";
import Image from "next/image";
import { Product } from "@/interfaces";
import { use } from "react";

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
    return (
        <div className="w-full">
            <div className="max-w-contentContainer mx-auto flex items-center py-4">
                <div className="w-2/3 h-full flex items-center justify-center overflow-hidden relative">
                    <img
                        src={product?.image}
                        alt="product image"
                        className="w-[80%] transform-origin-top-left cursor-move duration-500"
                    />
                </div>
                <div className="w-1/3 h-full flex flex-col gap-2">
                    <p className="p-2 text-[#004f9a] text-sm font-semibold border border-gray-400 rounded-md">
                        500+ bought since yesterday
                    </p>
                    <div className="px-2 py-4 border border-gray-400 rounded-md flex flex-col gap-6">
                        <div className="flex justify-between items-center">
                            <div className="flex gap-2">
                                <button className="px-2 py-[1px] text-[#004f9a] text-sm border-[1px] border-[#004f9a] rounded-sm">
                                    Best Seller
                                </button>
                                <button className="px-2 py-[1px] text-red-600 text-sm border-[1px] border-red-600 rounded-sm">
                                    Rollback
                                </button>
                            </div>
                            <IoMdHeartEmpty className="text-gray-600 text-2xl" />
                        </div>
                        {/* Product Info */}
                        <div className="flex flex-col gap-1">
                            <p className="text-sm underline underline-offset-4 ">
                                {product.brand}
                            </p>
                            <p className="text-xl font-semibold">
                                {product.title}
                            </p>
                            <p className="text-base text-zinc-500">
                                {product.description}
                            </p>
                            <div className="flex items-center gap-2 text-yellow mt-2">
                                <div className="flex text-sm gap-1 items-center">
                                    <BsStarFill />
                                    <BsStarFill />
                                    <BsStarFill />
                                    <BsStarFill />
                                    <BsStarFill />
                                    <p className=" text-black">25</p>
                                </div>
                            </div>
                            {/* Product Price */}
                            <div className="flex items-end gap-3">
                                <p className="font-titleFont text-2xl text-green-700 font-semibold">
                                    Now ${product.price}
                                </p>
                                <p className="text-gray-500 text-base line-through decoration-[1px] flex gap-1 items-center">
                                    ${product.oldPrice}{" "}
                                    <span>
                                        <BsInfoCircle />
                                    </span>
                                </p>
                            </div>
                            {/* Add to cart  */}
                            <div className="border-b-[1px] border-b-zinc-300 pb-4">
                                <button className="w-32 h-10 bg-blue text-white rounded-full hover:bg-[#004f9a] duration-300">
                                    Add to cart
                                </button>
                            </div>
                            {/* Deliver <Option></Option> */}
                            <div>
                                <p className="text-base font-semibold">
                                    How do you want your item?
                                </p>
                                <div className="w-full grid grid-cols-3 gap-4 text-xs">
                                    <div className="w-full border border-zinc-400 rounded-md flex flex-col items-center justify-center p-2">
                                        <Image
                                            src={ship1Img}
                                            alt="shipping Img"
                                            className="w-10"
                                        />
                                        <p>Shipping</p>
                                        <p>Tomorrow</p>
                                        <p>Free</p>
                                    </div>
                                    <div className="w-full border border-zinc-400 rounded-md flex flex-col items-center justify-center p-2">
                                        <Image
                                            src={ship2Img}
                                            alt="shipping Img"
                                            className="w-10"
                                        />
                                        <p>Shipping</p>
                                        <p>Tomorrow</p>
                                        <p>Free</p>
                                    </div>
                                    <div className="w-full border border-zinc-400 rounded-md flex flex-col items-center justify-center p-2">
                                        <Image
                                            src={ship3Img}
                                            alt="shipping Img"
                                            className="w-10"
                                        />
                                        <p>Shipping</p>
                                        <p>Tomorrow</p>
                                        <p>Free</p>
                                    </div>
                                </div>
                                <p className="font-bold text-xs">
                                    HoChiMinh City, 59000
                                    <span className="font-normal underline underline-offset-2 ml-1">
                                        Change
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ProductDetails;
