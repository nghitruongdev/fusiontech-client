import Image from "next/image";
import { loginImg } from "@public/assets/images";
import { loadingImg } from "@public/assets/images";
const Loading = () => {
    // return <div>Loading homepage....</div>;
    let circleCommonClasses = " h-4 w-4 bg-current   rounded-full";

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="relative my-6">
                <Image
                    src={loginImg}
                    alt="Login icon"
                    className="w-40 h-40 animate-pulse"
                />
                <div className=" ">
                    <svg
                        aria-hidden="true"
                        className="w-40 h-44 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 absolute inset-0 flex items-center justify-center"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                        />
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                        />
                    </svg>
                </div>
            </div>
            <div className="flex space-x-2">
                {/* <style>
                    {`
        @keyframes wave-animation {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
          100% {
            transform: translateY(0);
          }
        }
  
        .wave-text__letter {
          animation: wave-animation 0.6s ease-in-out infinite;
          display: inline-block;
        }
      `}
                </style> */}
                <div
                    className={`${circleCommonClasses} bg-blue mr-2 animate-bounce`}
                ></div>
                <div
                    className={`${circleCommonClasses} bg-green mr-2 animate-bounce200`}
                ></div>
                <div
                    className={`${circleCommonClasses} bg-red animate-bounce400`}
                ></div>

                {/* <div className="wave-text font-size: 8rem">
                    <span className="wave-text__letter">Đ</span>
                    <span className="wave-text__letter">a</span>
                    <span className="wave-text__letter">n</span>
                    <span className="wave-text__letter">g</span>
                    <span className=""> </span>
                    <span className="wave-text__letter">t</span>
                    <span className="wave-text__letter">ả</span>
                    <span className="wave-text__letter">i</span>
                    <span className=""> </span>
                    <span className="wave-text__letter">t</span>
                    <span className="wave-text__letter">r</span>
                    <span className="wave-text__letter">a</span>
                    <span className="wave-text__letter">n</span>
                    <span className="wave-text__letter">g</span>
                    <span className=""> </span>
                    <span className="wave-text__letter">c</span>
                    <span className="wave-text__letter">h</span>
                    <span className="wave-text__letter">ủ</span>
                </div> */}
            </div>
        </div>
    );
};
export default Loading;
