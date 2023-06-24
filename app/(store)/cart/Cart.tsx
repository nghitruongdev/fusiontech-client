import {
    phoneImg,
    ship1Img,
    ship2Img,
    ship3Img,
    warningImg,
} from "public/assets/images";
import Image from "next/image";
import { MdOutlineAdd } from "react-icons/md";
import { TbReload } from "react-icons/tb";
import { HiMinusSm } from "react-icons/hi";
import FormatPrice from "@/components/client/FormatPrice";
import { ReactNode } from "react";
import { IoMdClose } from "react-icons/io";
import Link from "next/link";
type Props = {
    children: ReactNode;
};
const Cart = () => {
    // const [warningMsg, setWarningMsg] = useState(false);

    // useEffect(() => {
    //     setWarningMsg(true);
    //     let oldPrice = 0;
    //     let savings = 0;
    //     let amt = 0;
    // }, []);

    return (
        <div className="w-full py-10 bg-white text-black">
            <div className="w-full flex gap-10">
                <div className="w-2/3 flex flex-col gap-5">
                    <h1 className="text-2xl font-bold text-black">
                        Cart{" "}
                        <span className="text-lightText font-normal">
                            (48 items)
                        </span>
                    </h1>
                    {/* Pickup details */}
                    <div>
                        <div className="text-xl font-bold flex items-center gap-2 mb-2">
                            <Image
                                className="w-10"
                                src={phoneImg}
                                alt="phoneImage"
                            />
                            <p>Pickup and delivery options</p>
                        </div>

                        <div>
                            <div className="w-full grid grid-cols-3 gap-4 text-xs">
                                <div className="w-full border border-zinc-400 rounded-md flex flex-col items-center justify-center p-2">
                                    <Image
                                        src={ship1Img}
                                        alt="shipping Img"
                                        className="w-10"
                                    />
                                    <p>All items available</p>
                                </div>
                                <div className="w-full border border-zinc-400 rounded-md flex flex-col items-center justify-center p-2">
                                    <Image
                                        src={ship2Img}
                                        alt="shipping Img"
                                        className="w-10"
                                    />
                                    <p>All items available</p>
                                </div>
                                <div className="w-full border border-zinc-400 rounded-md flex flex-col items-center justify-center p-2">
                                    <Image
                                        src={ship3Img}
                                        alt="shipping Img"
                                        className="w-10"
                                    />
                                    <p>All items available</p>
                                </div>
                            </div>
                        </div>
                        {/* Cart Product */}
                        <div className="w-full p-5 border-[1px] border-zinc-400 rounded-md flex flex-col gap-4">
                            <p className="font-semibold text-sm text-zinc-500">
                                Sold and shipped by{" "}
                                <span className="text-black font-semibold">
                                    FushionTech Store
                                </span>
                            </p>
                            {/* Cart Items */}
                            <div>
                                <div className="flex items-center justify-between gap-4 border-b-[1px] border-b-zinc-200 pb-4">
                                    <div className="w-3/4 flex items-center gap-4">
                                        <Image
                                            className="w-32"
                                            width={500}
                                            height={500}
                                            alt="productImg"
                                            src={
                                                "https://i.ibb.co/1r28gMk/1.webp"
                                            }
                                        />
                                        <div className="mx-4">
                                            <h2 className="text-base text-zinc-900">
                                                Canon ABC 2023{" "}
                                            </h2>
                                            <p className="text-sm text-zinc-500 text-clip">
                                                Lorem ipsum dolor, sit amet
                                                consectetur adipisicing elit.
                                                Doloremque natus autem excepturi
                                                quibusdam dicta recusandae, vero
                                                earum eius, quo quam magni
                                                dolorem tenetur hic nisi laborum
                                                pariatur placeat vitae! Tempore.
                                            </p>
                                            <p className="text-sm text-zinc-500">
                                                Price: $240.00
                                            </p>
                                            <p className="text-sm text-zinc-500 flex items-center gap-1">
                                                <span className="bg-primaryBlue rounded-full text-white text-xs w-4 h-4 flex items-center justify-center">
                                                    <TbReload className="rotate-180" />
                                                </span>
                                                Free 30-day returns
                                            </p>
                                            <div className="mt-2 flex items-center gap-6">
                                                <button className="text-sm underline underline-offset-2 decoration-[1px] text-zinc-600 hover:no-underline hover:text-primaryBlue duration-300">
                                                    Remove
                                                </button>
                                                <div className="w-28 h-9 border border-zinc-400 rounded-full text-base font-semibold text-black flex items-center justify-between px-3">
                                                    <button className="text-base w-5 h-5 text-zinc-600 hover:-bg[#74767c] hover:text-white rounded-full flex items-center justify-center cursor-pointer duration-200">
                                                        <HiMinusSm />
                                                    </button>
                                                    <span className="">5</span>
                                                    <button className="text-base w-5 h-5 text-zinc-600 hover:-bg[#74767c] hover:text-white rounded-full flex items-center justify-center cursor-pointer duration-200">
                                                        <MdOutlineAdd />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Button */}
                                    </div>
                                    <div className="w-1/4 text-right flex flex-col items-end gap-1">
                                        <p className="font-semibold text-xl text-green-500">
                                            <FormatPrice amount={3 * 5} />
                                        </p>
                                        <p className="text-sm line-through text-zinc-500">
                                            <FormatPrice amount={3 * 5} />
                                        </p>
                                        <div className="flex items-center text-xs gap-2">
                                            <p className="bg-green-200 text-[8px] uppercase px-2 py-[1px]">
                                                You save
                                            </p>
                                            <p className="text-[#2a8703] font-semibold">
                                                <FormatPrice amount={0} />
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <button className="w-44 bg-red-500 text-white h-10 rounded-full text-base font-semibold hover:bg-red-800 duration-300 mt-4">
                                    Reset Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-1/3 p-4 mt-24 h-[500px] border-[1px] border-zinc-400 rounded-md flex flex-col justify-center gap-4">
                    <div className="w-full flex flex-col gap-4 border-b-[1px] border-b-zinc-200 pb-4">
                        <Link href="/cart/checkout">
                            <p className="flex items-center justify-center bg-primaryBlue hover:bg-hoverBg w-full text-white h-10 font-semibold duration-300 rounded-full">
                                Continue to checkout
                            </p>
                        </Link>

                        <p className="text-sm text-center text-red-500 -mt-4 font-normal">
                            Bạn cần đăng nhập để đặt hàng
                        </p>
                        {true && (
                            <div className="bg-[#002d58] text-white p-2 rounded-lg flex items-center justify-between gap-4">
                                <Image
                                    className="w-8"
                                    src={warningImg}
                                    alt="warningImg"
                                />
                                <p className="text-sm">
                                    Items in your cart have reduced price.
                                    Checkout now for extra savings!
                                </p>
                                <IoMdClose
                                    // onClick={() => setWarningMsg(false)}
                                    className="text-3xl hover:text-red-400 cursor-pointer duration-200"
                                />
                            </div>
                        )}
                        <p className="text-sm text-center">
                            For the best shopping experience,
                            <span className="underline underline-offset-2 decoration-[1px]">
                                sign in
                            </span>
                        </p>
                    </div>
                    {/* checkout price */}
                    <div className="w-full flex flex-col gap-4 border-b-[1px] border-b-zinc-200 pb-4">
                        <div className="flex flex-col gap-1">
                            <div className="text-sm flex justify-between">
                                <p className="font-semibold">
                                    Subtotal <span>(5 items)</span>
                                </p>
                                <p className="line-through text-zinc-500 text-base">
                                    <FormatPrice amount={400} />
                                </p>
                            </div>
                            <div className="text-sm flex justify-between">
                                <p className="font-semibold">Savings</p>
                                <p className="text-[#2a8703] font-bold bg-green-100 py-1 px-[2px] rounded-lg inline-flex">
                                    -<FormatPrice amount={200} />
                                </p>
                            </div>
                            <div className="text-sm flex justify-between">
                                <p className="font-semibold">Total amount</p>
                                <p className="text-zinc-800 font-normal text-base">
                                    <FormatPrice amount={500} />
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex flex-col gap-4 border-b-[1px] border-b-zinc-200 pb-4">
                        <div className="flex flex-col gap-1">
                            <div className="text-sm flex justify-between">
                                <p>Shipping</p>
                                <p className="text-[#2a8703]">Free</p>
                            </div>
                            <div className="text-sm flex justify-between">
                                <p className="font-semibold">Taxes</p>
                                <p className="text-zinc-800">
                                    Calculated at checkout
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <p>Estimated total</p>
                        <p className="text-zinc-800 font-bold text-lg">
                            <FormatPrice amount={1000} />
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Cart;
