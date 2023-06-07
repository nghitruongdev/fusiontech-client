import { bannerImg } from "public/assets/images";
import Image from "next/image";
import ButtonPrimary from "../ButtonPrimary";
import CaptionCarousel from "@components/Carousel";

const Banner = () => {
    return (
        <div className="w-full bg-white px-4 py-6 font-titleFont flex gap-4 border-b-[1px]">
            <div className="w-2/3 rounded-lg h-[410px] shadow-bannerShadow relative">
                <CaptionCarousel />
            </div>
            <div className="w-1/3 border-[1px] border-gray-200 rounded-lg shadow-bannerShadow p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-black">
                        Flash Pick of the day
                    </h2>
                    <p className="text-base text-zinc-600 underline underline-offset-2">
                        View all
                    </p>
                </div>
                <Image
                    src={bannerImg}
                    alt="flashable"
                    className="h-60 object-cover"
                />
                <ButtonPrimary btnText="Options" />
                <p className="text-lg text-black font-semibold">From $199.90</p>
                <p className="text-base text-gray-500 -mt-1 text-ellipsis">
                    {/* Lorem ipsum, dolor sit amet consectetur... */}
                </p>
            </div>
        </div>
    );
};
export default Banner;
