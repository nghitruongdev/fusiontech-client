"use client";
import React, { useEffect, useState } from "react";
import favoriteApi from "src/api/favoriteAPI";
import { GoPlus } from "react-icons/go";
import { BsStarFill } from "react-icons/bs";
import useMyToast from "@/hooks/useToast";
import { IoMdHeartEmpty } from "react-icons/io";
const FavoriteProducts = () => {
    const [products, setProducts] = useState<product[]>([]);

    interface product {
        id: number;
        name: string;
        description: string;
        image: null;
        // ...các thuộc tính khác
    }

    // dữ liệu mẫu
    const pid = [1, 2, 3, 4];
    const uid = "2534684b-8fc6-485b-994a-07ed72ce83e6";
    const imageUrl =
        "https://lh3.googleusercontent.com/1S6Ltn5pJWSMWh0U6V4w80Di1Lq8AVQhuDOzVHbQPmxwcztwofrF_3gyuy7Pk8AJ73MVFCYDgm4r1orx6eh88iwVj9nDyXk=w230-rw";

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productPromises = pid.map((id) =>
                    favoriteApi.getProductId(id),
                );
                const responses = await Promise.all(productPromises);
                const fetchedProducts = responses.map(
                    (response) => response.data,
                );
                setProducts(fetchedProducts);
            } catch (error) {
                console.log("Failed to fetch products", error);
            }
        };
        fetchProducts();
    }, []);
    const addFavoriteProduct = async (productId: any, index: number) => {
        try {
            // Gọi API để thêm sản phẩm yêu thích
            await favoriteApi.create(productId, uid);

            // thể hiện thông báo nhỏ khi thực thi
            toast
                .ok({
                    title: "Thành công",
                    message: "Yêu thích sản phẩm thành công",
                })
                .fire();
        } catch (error) {
            console.log("Failed to toggle favorite", error);
            toast
                .fail({
                    title: "Thất bại",
                    message: "Yêu thích sản phẩm thất bại",
                })
                .fire();
        }
    };

    // Tạo một instance của useToast()
    const toast = useMyToast();

    return (
        <div className="mx-auto bg-white rounded">
            <h1 className="text-xl font-semibold pt-2 pl-4">
                Sản phẩm đã xem gần đây
            </h1>
            <div className="mx-auto">
                <div className="py-6 px-4 grid grid-cols-4 gap-4">
                    {products.map((product, index) => (
                        <div
                            key={product.id}
                            className="border-[1px] border-gray-200 mb-6 group rounded-xl shadow-lg"
                        >
                            <div className="flex justify-end p-2">
                                <button
                                    className="hover:scale-125 duration-3000"
                                    onClick={() =>
                                        addFavoriteProduct(product.id, index)
                                    }
                                >
                                    <IoMdHeartEmpty className="text-gray-600 text-xl" />
                                </button>
                            </div>
                            <div className="w-full h-[150px] overflow-hidden p-1">
                                <img src={imageUrl} alt="itemImage" />
                            </div>
                            {/* Description Start */}
                            <div className="px-2 py-4 flex flex-col justify-center">
                                <div className="flex justify-between py-2">
                                    <button className="w-20 h-9 bg-primaryBlue text-white rounded-full flex gap-1 items-center justify-center hover:bg-hoverPrimaryBlue duration-300">
                                        <span>
                                            <GoPlus />
                                        </span>{" "}
                                        Add
                                    </button>
                                    {/* <Link
                                href={{
                                    pathname: `/products/${item._id}`,
                                    query: {
                                        product: JSON.stringify(item),
                                    },
                                }}
                                as={`/products/${item._id}`}
                            > */}
                                    <button className="w-24 h-9 bg-white border-[1px] border-black text-black rounded-full flex items-center justify-center gap-1 hover:bg-black hover:text-white duration-300">
                                        <span>
                                            <GoPlus />
                                        </span>
                                        Details
                                    </button>
                                    {/* </Link> */}
                                </div>
                                <div className="flex items-center gap-3">
                                    <p className="font-titleFont text-lg text-green-700 font-semibold">
                                        Now 999$
                                    </p>
                                    <p className="text-gray-500 text-base line-through decoration-[1px]">
                                        1500$
                                    </p>
                                </div>
                                <p className="text-lg font-semibold py-2 text-black">
                                    {product.name}
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
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FavoriteProducts;