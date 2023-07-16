import Image from "next/image";
import { loginImg } from "@public/assets/images";
const LoadingCart = () => {
    // return <div>Loading your cart....</div>;
    <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
            <Image
                src={loginImg}
                alt="Login icon"
                className="w-32 h-32 animate-spin"
            />
            <div className="mt-4 text-lg font-semibold">
                Loading homepage....
            </div>
        </div>
    </div>;
};
export default LoadingCart;
