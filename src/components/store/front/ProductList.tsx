import { IProduct } from "types";
import Image from "next/image";
import { BsStarFill } from "react-icons/bs";
import { getProductsWithDetails } from "../../../lib/data/products";
import Link from "next/link";
import { Heart, Plus } from "lucide-react";
import { formatPrice } from "../../../lib/utils";
import { FavoriteButton } from "@components/store/front/client";

const ProductList = async () => {
    const products = await getProductsWithDetails();
    return (
        <>
            <div className="flex justify-between">
                <h3>Sản phẩm nổi bật</h3>
                <p>Xem tất cả</p>
            </div>
            <div aria-label="product-list" className="flex overflow-x-auto">
                {Object.values(products.data).map((item: IProduct) => (
                    <Product key={item.id} item={item} />
                ))}
            </div>
        </>
    );
};

const Product = ({
    item: { id, name, slug, thumbnail },
}: {
    item: IProduct;
}) => {
    return (
        <div
            aria-label={`Product Item:${name}`}
            className="p-1 group cursor-pointer lg:min-w-[16.666667%] md:min-w-[25%] sm:min-w-[33.333333%] min-w-[50%]"
        >
            <Product.Image thumbnail={thumbnail} />
            <div className="px-2 flex flex-col justify-center">
                <div className="flex justify-between">
                    {/* <Product.DetailButton id={id} slug={slug} /> */}
                </div>
                <Product.Brand />
                <Product.Price />
                <Product.Name name={name} />
            </div>
            {/* <Product.Review /> */}
        </div>
    );
};

Product.Image = ({ thumbnail }: { thumbnail: IProduct["thumbnail"] }) => {
    return (
        <div className="relative w-full min-h-[200px] ease-in-out duration-300 scale-90 hover:scale-95">
            <Image
                src={thumbnail}
                alt="Product image"
                fill
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNMz4irBwAEGQGuUtJ+VQAAAABJRU5ErkJggg=="
                className="w-full rounded-md max-w-[200px] mx-auto object-contain"
            />
            <Product.FavoriteButton />
        </div>
    );
};
Product.Brand = () => {
    return (
        <p className="py-2 text-sm font-bold text-muted-foreground leading-tight">
            ASUS
        </p>
    );
};
Product.Name = ({ name }: { name: IProduct["name"] }) => {
    return (
        <p className="text-sm leading-normal text-zinc-700 line-clamp-2">
            {/* {
                "Laptop ACER Nitro 5 Eagle AN515-57-54MV (i5-11400H/RAM 8GB/RTX 3050/512GB SSD/ Windows 11)"
            } */}
            {name}
        </p>
    );
};

Product.Price = () => {
    return (
        <div className="grid gap-2">
            <p className="font-titleFont text-md font-bold text-sky-800">
                {formatPrice(25_000_000)}
            </p>
            <p className="text-gray-500 text-sm leading-tight line-through decoration-[1px]">
                {formatPrice(29_000_000)}
            </p>
        </div>
    );
};

Product.Review = () => {
    return (
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
    );
};

Product.DetailButton = ({
    id,
    slug,
}: {
    id: IProduct["id"];
    slug: IProduct["slug"];
}) => {
    return (
        <Link href={`/products/${id}`}>
            <button className="w-24 h-9 bg-white border-[1px] border-secondaryBlue text-blue-600 font-semibold text-sm rounded-full flex items-center justify-center gap-1 hover:bg-primaryBlue hover:text-white duration-150">
                <span>
                    <Plus />
                </span>
                Chi tiết
            </button>
        </Link>
    );
};

Product.FavoriteButton = FavoriteButton;

export default ProductList;
