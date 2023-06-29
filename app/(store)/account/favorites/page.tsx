import React from "react";
import { FaHeart, FaStar } from "react-icons/fa";

const FavoriteProducts = () => {
    // Danh sách sản phẩm yêu thích
    const favoriteProducts = [
        {
            id: 1,
            name: "Iphone 14 Pro Max 128G",
            price: "29.999.000",
            image: "https://cdn2.cellphones.com.vn/358x/media/catalog/product/t/_/t_m_18.png",
        },
        {
            id: 2,
            name: "Iphone 14 Pro Max 128G",
            price: "29.999.000",
            image: "https://cdn2.cellphones.com.vn/358x/media/catalog/product/t/_/t_m_18.png",
        },
        {
            id: 3,
            name: "Iphone 14 Pro Max 128G",
            price: "29.999.000",
            image: "https://cdn2.cellphones.com.vn/358x/media/catalog/product/t/_/t_m_18.png",
        },
        {
            id: 4,
            name: "Iphone 14 Pro Max 128G",
            price: "29.999.000",
            image: "https://cdn2.cellphones.com.vn/358x/media/catalog/product/t/_/t_m_18.png",
        },
        {
            id: 5,
            name: "Iphone 14 Pro Max 128G",
            price: "29.999.000",
            image: "https://cdn2.cellphones.com.vn/358x/media/catalog/product/t/_/t_m_18.png",
        },
        {
            id: 6,
            name: "Iphone 14 Pro Max 128G",
            price: "29.999.000",
            image: "https://cdn2.cellphones.com.vn/358x/media/catalog/product/t/_/t_m_18.png",
        },
        {
            id: 7,
            name: "Iphone 14 Pro Max 128G",
            price: "29.999.000",
            image: "https://cdn2.cellphones.com.vn/358x/media/catalog/product/t/_/t_m_18.png",
        },
        {
            id: 8,
            name: "Iphone 14 Pro Max 128G",
            price: "29.999.000",
            image: "https://cdn2.cellphones.com.vn/358x/media/catalog/product/t/_/t_m_18.png",
        },
        {
            id: 9,
            name: "Iphone 14 Pro Max 128G",
            price: "29.999.000",
            image: "https://cdn2.cellphones.com.vn/358x/media/catalog/product/t/_/t_m_18.png",
        },
        // Thêm sản phẩm yêu thích khác tại đây
    ];

    return (
        <div className="mx-auto bg-white ">
            <h1 className="text-xl font-semibold mb-4">Sản phẩm yêu thích</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {favoriteProducts.map((product) => (
                    <div
                        key={product.id}
                        className="bg-white rounded-xl shadow-lg p-4"
                    >
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-fit object-cover mb-2"
                        />
                        <h2 className="text-sm font-semibold">
                            {product.name}
                        </h2>
                        <p className="text-sm font-semibold text-red-600 mt-4">
                            {product.price} VND
                        </p>
                        <div className="flex text-sm mt-3">
                            <FaStar className="text-yellow" />
                            <FaStar className="text-yellow " />
                            <FaStar className="text-yellow " />
                            <FaStar className="text-yellow " />
                            <FaStar className="text-yellow mr-1" />
                            <p className="text-xs">20 đánh giá</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FavoriteProducts;
