import { BsStarFill, BsInfoCircle } from "react-icons/bs";
import ProductSpecification from "./ProductSpecification";
import ReviewComponent from "./(review)/Review";
import Description from "./Description";
import { getOneProduct } from "@/lib/data/products";
import dynamic from "next/dynamic";
import {
    ProductCartButton,
    ProductFavoriteDetails,
    ProductFrequentBoughtTogether,
    ProductImages,
    ProductPrice,
    ProductRating,
    ProductViewRecently,
} from "./product-client";
import { getOneBrand } from "@/lib/data/brands";
import { Suspense } from "react";
import { ProductOptions } from "./ProductOptions";
import { getProductVariants } from "@/lib/data/variants";

type Props = {
    params: {
        id: string;
    };
};
const DynamicContextProvider = dynamic(() => import("./product-client"), {
    ssr: false,
});

const Product = async ({ params: { id } }: Props) => {
    Product.Id = id;
    const product = await getOneProduct(id);
    return (
        <DynamicContextProvider product={product}>
            <section className="bg-white">
                <div className="w-[90%] mx-auto p-4">
                    {/* mx-auto flex items-center py-4 */}
                    <div className="flex">
                        <div className="w-2/3 relative">
                            <ProductImages />
                            <ProductFrequentBoughtTogether />
                        </div>
                        <div className="w-1/3 flex flex-col gap-2 mt-4">
                            <div className="p-4 pt-0 rounded-lg flex flex-col gap-6 shadow-lg border">
                                <ProductFavoriteDetails />
                                <Product.Info />
                            </div>
                        </div>
                    </div>
                    <div className="flex border-t shadow-lg rounded-md p-4 mt-4">
                        <div className="w-2/3">
                            <Description />

                            <div className="">
                                <ReviewComponent />
                            </div>
                        </div>
                        <div className="w-1/3">
                            <ProductSpecification />
                        </div>
                    </div>
                    <ProductViewRecently />
                </div>
            </section>
        </DynamicContextProvider>
    );
};
Product.Id = "";
Product.Info = async () => {
    const { name } = await getOneProduct(Product.Id);
    return (
        <>
            <div className="flex flex-col gap-1">
                <Product.Brand />
                <p className="text-2xl font-bold">{name}</p>
                {/* <p className="text-base text-zinc-500">
                                {product.description}
                            </p> */}
                {/* <div className="flex items-center space-x-2 text-zinc-950 mt-2"> */}
                <ProductRating />
                {/* </div> */}
                {/* Product Price */}
                <ProductPrice />
                <Product.StoreInfo />

                <Suspense fallback={<>Đang tìm kiếm tuỳ chọn...</>}>
                    <ProductOptions />
                </Suspense>
                {/* Add to cart  */}
                <ProductCartButton />
                <Product.KeyFeatures />
            </div>
        </>
    );
};

Product.Brand = async () => {
    const { brand } = await getOneProduct(Product.Id);
    let name = "OEM";
    if (brand && brand.id) {
        const brandDb = await getOneBrand(brand?.id || "");
        name = brandDb?.name ?? name;
    }
    return (
        <>
            <p className="text-sm underline underline-offset-4 ">{name}</p>
        </>
    );
};

Product.StoreInfo = () => {
    return (
        <p className="text-gray-500 text-sm font-medium flex gap-1 items-center ">
            Hàng chính hãng được bán bởi FusionTech
            <span>
                <BsInfoCircle />
            </span>
        </p>
    );
};

Product.KeyFeatures = () => {
    return (
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
    );
};

export default Product;
