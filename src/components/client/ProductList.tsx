import { IProduct } from "types";
import Image from "next/image";
import Link from "next/link";
import { BsStarFill } from "react-icons/bs";
import { GoPlus } from "react-icons/go";
import { useIsClient, useSsr } from "usehooks-ts";
import ButtonCart from "./ButtonCart";

async function getProducts(): Promise<IProduct[]> {
    const res = await fetch("http://localhost:3000/api/products");
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.

    // Recommendation: handle errors
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error("Failed to fetch product");
    }

    return res.json();
}

const ProductList = async () => {
    const products: IProduct[] = await getProducts();

    return (
        <>
            <div className="py-6 px-4 grid grid-cols-4 gap-4">
                {products.map((item: IProduct) => (
                    <div
                        key={item._id}
                        className="border-[1px] border-gray-200 mb-6 group"
                    >
                        <div className="w-full h-[350px] overflow-hidden p-1">
                            <Image
                                width={300}
                                height={250}
                                src={item.image}
                                alt="itemImage"
                            />
                        </div>
                        {/* Description Start */}
                        <div className="px-2 py-4 flex flex-col justify-center">
                            <div className="flex justify-between py-2">
                                <ButtonCart product={item} />
                            </div>
                            <div className="flex items-center gap-3">
                                <p className="font-titleFont text-lg text-green-700 font-semibold">
                                    Now ${item.price}
                                </p>
                                <p className="text-gray-500 text-base line-through decoration-[1px]">
                                    ${item.oldPrice}
                                </p>
                            </div>
                            <p className="text-lg font-semibold py-2 text-black">
                                {item.name || item?.title}
                            </p>
                            {/* <p className="text-base text-zinc-500">
                                {item.description.substring(0, 80)}...
                            </p> */}
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
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default ProductList;
