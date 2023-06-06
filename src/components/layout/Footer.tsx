const Footer = () => {
    return (
        <>
            <FooterTop />
            <div className="w-full bg-hoverBg text-white pt-4 pb-6">
                <div className="max-w-contentContainer mx-auto">
                    <ul className="w-full flex flex-wrap gap-1 justify-center text-sm text-zinc-200">
                        <li className="hover:text-white duration-200 ml-2 cursor-pointer">
                            All Departments
                        </li>
                        <li className="hover:text-white duration-200 ml-2 cursor-pointer">
                            All Departments
                        </li>
                        <li className="hover:text-white duration-200 ml-2 cursor-pointer">
                            All Departments
                        </li>
                        <li className="hover:text-white duration-200 ml-2 cursor-pointer">
                            All Departments
                        </li>
                        <li className="hover:text-white duration-200 ml-2 cursor-pointer">
                            All Departments
                        </li>
                        <li className="hover:text-white duration-200 ml-2 cursor-pointer">
                            All Departments
                        </li>
                        <li className="hover:text-white duration-200 ml-2 cursor-pointer">
                            All Departments
                        </li>
                        <li className="hover:text-white duration-200 ml-2 cursor-pointer">
                            All Departments
                        </li>
                        <li className="hover:text-white duration-200 ml-2 cursor-pointer">
                            All Departments
                        </li>
                    </ul>
                    <p className="text-sm text-zinc-300 text-center mt-4">
                        © 2023 FusionTech.com.vn All rights Reserved
                    </p>
                </div>
            </div>
        </>
    );
};

const FooterTop = () => {
    return (
        <div className="w-full bg-lightBlue">
            <div className="py-10 flex flex-col gap-4 justify-center items-center"></div>
            <p className="font-medium">We love to hear what you think!</p>
            <button className="w-36 h-9 border-[1px] border-black bg-white rounded-full hover:border-[2px] transition-all duration-200">
                Give feedback
            </button>
        </div>
    );
};

export default Footer;
