"use client";

import { Product } from "@/interfaces";
import Image from "next/image";
import Link from "next/link";
import { BsStarFill } from "react-icons/bs";
import { GoPlus } from "react-icons/go";
import useCart from "./CartHander";
import { useEffect, useState } from "react";

const ProductList = ({ products }: { products: Product[] }) => {
    return (
        <div className="py-6 px-4 grid grid-cols-4 gap-4">
            {products.map((product: Product) => {
                const { handleAddToCart } = useCart();

                return (
                    <div
                        key={product._id}
                        className="border-[1px] border-gray-200 mb-6 group"
                    >
                        <div className="w-full h-[350px] overflow-hidden p-1">
                            <Image
                                width={300}
                                height={250}
                                src={product.image}
                                alt="itemImage"
                            />
                        </div>
                        {/* Description Start */}
                        <div className="px-2 py-4 flex flex-col justify-center">
                            <div className="flex justify-between py-2">
                                <button
                                    className="w-20 h-9 bg-primaryBlue text-white rounded-full flex gap-1 items-center justify-center hover:bg-hoverPrimaryBlue duration-300"
                                    onClick={() => handleAddToCart(product)}
                                >
                                    <span>
                                        <GoPlus />
                                    </span>{" "}
                                    Add
                                </button>
                                <Link
                                    href={{
                                        pathname: `/products/${product._id}`,
                                        query: {
                                            product: JSON.stringify(product),
                                        },
                                    }}
                                    as={`/products/${product._id}`}
                                >
                                    <button className="w-24 h-9 bg-white border-[1px] border-black text-black rounded-full flex items-center justify-center gap-1 hover:bg-black hover:text-white duration-300">
                                        <span>
                                            <GoPlus />
                                        </span>
                                        Details
                                    </button>
                                </Link>
                            </div>
                            <div className="flex items-center gap-3">
                                <p className="font-titleFont text-lg text-green-700 font-semibold">
                                    Now ${product.price}
                                </p>
                                <p className="text-gray-500 text-base line-through decoration-[1px]">
                                    ${product.oldPrice}
                                </p>
                            </div>
                            <p className="text-lg font-semibold py-2 text-black">
                                {product.title}
                            </p>
                            <p className="text-base text-zinc-500">
                                {product.description.substring(0, 80)}...
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
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ProductList;
