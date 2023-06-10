"use client";
import Image from "next/image";
import { logo } from "public/assets/images/index";
import { IoSearchOutline } from "react-icons/io5";
import { AiOutlineHeart } from "react-icons/ai";
import { BsCart2 } from "react-icons/bs";
import Link from "next/link";
import { phoneImg } from "public/assets/images";
import { FiChevronDown } from "react-icons/fi";
import { FaPlaceOfWorship } from "react-icons/fa";
import { MdOutlineLocationOn } from "react-icons/md";
import NavbarUserInfo from "./NavbarUserInfo";
import BannerNavbar from "./BannerNavbar";
import FlyoutMenu from "@components/ui/FlyoutMenu";

const Header = () => {
    return (
        <>
            <BannerNavbar />
            <div className="w-full bg-primaryBlue text-white sticky top-0 z-50">
                <div className="w-full h-full border-b-[1px] border-b-white">
                    <div className="mx-auto max-w-container px-4 h-20 flex items-center justify-between gap-2 ">
                        {/* ==================== Logo Start ==================== */}
                        <Link href="/">
                            <div className="navBarHover">
                                <Image
                                    src={logo}
                                    alt="Website logo"
                                    className="w-44"
                                />
                            </div>
                        </Link>

                        {/* ==================== Logo End ==================== */}

                        {/* ==================== Departments Start ==================== */}
                        <Departments />
                        {/* <Menu>
                            <MenuButton className="navBarHover">
                                <div className="flex items-center gap-2 ">
                                    <div className="w-4 grid grid-cols-2 gap-[2px]">
                                        <span className="w-1.5 h-1.5 border-[1px] border-white inline-flex"></span>
                                        <span className="w-1.5 h-1.5 border-[1px] border-white inline-flex"></span>
                                        <span className="w-1.5 h-1.5 border-[1px] border-white inline-flex"></span>
                                        <span className="w-1.5 h-1.5 border-[1px] border-white inline-flex"></span>
                                    </div>
                                    <p className="font-semibold ">
                                        Departments
                                    </p>
                                </div>
                            </MenuButton>
                            <div className="bg-red-400">Hello there</div> */}
                        {/* <MenuList rounded={"lg"} mt={2} className="">
                                <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                                    {[
                                        "Download",
                                        "Create a Copy",
                                        "Mark as Draft",
                                        "Delete",
                                        "Attend a Workshop",
                                    ].map((item) => (
                                        <MenuItem
                                            key={item}
                                            borderLeft="3px solid transparent"
                                            _hover={{
                                                bg: "gray.50",
                                                borderLeft: " 3px solid purple",
                                            }}
                                            className="hover:font-semibold"
                                        >
                                            <span className="text-gray-900 text-sm my-1">
                                                {item}
                                            </span>
                                        </MenuItem>
                                    ))}
                                </div>
                            </MenuList>
                        </Menu> */}
                        {/* ==================== Departments End ==================== */}

                        {/* ==================== Services Start ==================== */}

                        {/* ==================== Services End ==================== */}

                        {/* ==================== SearchBox Start ==================== */}
                        <div className="h-10 flex flex-1 relative">
                            <input
                                type="text"
                                placeholder="Search everything at FusionTech store"
                                className="h-full w-full rounded-full px-4 text-black text-base outline-none border-[1px] border-transparent focus-visible:border-black duration-200"
                            />
                            <span className="absolute w-8 h-8 rounded-full flex items-center justify-center top-1 right-1 bg-yellow text-black text-xl">
                                <IoSearchOutline />
                            </span>
                        </div>
                        {/* ==================== SearchBox End ==================== */}

                        {/* ==================== MyItems Start ==================== */}
                        <div className="navBarHover">
                            <AiOutlineHeart className="text-lg" />
                            <div className="">
                                <p className="text-xs">Reorder</p>
                                <h2 className="text-base font-semibold -mt-1">
                                    My Items
                                </h2>
                            </div>
                        </div>
                        {/* ==================== MyItems End ==================== */}

                        {/* ==================== Account Start ==================== */}
                        <NavbarUserInfo />

                        {/* ==================== Account End ==================== */}

                        {/* ==================== Cart Start ==================== */}
                        <Link href="/cart">
                            <div className="flex flex-col justify-center items-center gap-2 h-12 px-5 rounded-full bg-transparent hover:bg-hoverBg duration-300 relative">
                                <BsCart2 className="text-2xl" />
                                <p className="text-[10px] -mt-2">$0.00</p>
                                <span className="absolute w-4 h-4 bg-yellow text-black top-0 right-4 rounded-full flex items-center justify-center font-bodyFont text-xs">
                                    0
                                </span>
                            </div>
                        </Link>

                        {/* ==================== Cart End ==================== */}

                        {/* ==================== MyItems Start ==================== */}

                        {/* ==================== MyItems End ==================== */}
                    </div>
                </div>
                <NavbarBottom />
            </div>
        </>
    );
};

const NavbarBottom = () => {
    return (
        <div className="max-w-container mx-auto py-2 px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Image className="w-6" src={phoneImg} alt="phoneImg" />
                    <p className="text-sm font-semibold">
                        How do you want your items?
                    </p>
                    <FiChevronDown />
                    <span className="w-[1px] h-4 bg-white inline-flex ml-2"></span>
                </div>
                <div className="flex items-center gap-2">
                    <MdOutlineLocationOn />
                    <p className="text-sm text-zinc-100">Sacramento, 95829</p>
                    <FaPlaceOfWorship />
                    <p className="text-sm text-zinc-100">
                        Sacramento Supercenter
                    </p>
                </div>
            </div>
            <ul className="flex gap-6 text-sm font-semibold">
                <li className="bottomNavLi">Deals</li>
                <li className="bottomNavLi">Deals</li>
                <li className="bottomNavLi">Deals</li>
                <li className="bottomNavLi">Deals</li>
                <li className="bottomNavLi">Deals</li>
                <li className="bottomNavLi">Deals</li>
                <li className="bottomNavLi">Deals</li>
            </ul>
        </div>
    );
};

const Departments = () => {
    return (
        // <>
        //     <Popover isLazy placement="top-start">
        //         <PopoverTrigger>
        //             <div className="flex items-center gap-2 navBarHover">
        //                 <div className="w-4 grid grid-cols-2 gap-[2px]">
        //                     <span className="w-1.5 h-1.5 border-[1px] border-white inline-flex"></span>
        //                     <span className="w-1.5 h-1.5 border-[1px] border-white inline-flex"></span>
        //                     <span className="w-1.5 h-1.5 border-[1px] border-white inline-flex"></span>
        //                     <span className="w-1.5 h-1.5 border-[1px] border-white inline-flex"></span>
        //                 </div>
        //                 <p className="font-semibold ">Departments</p>
        //             </div>
        //         </PopoverTrigger>

        //         <PopoverContent
        //             overflow={"hidden"}
        //             className=" text-black"
        //             w="50%"
        //         >
        //             {/* <PopoverHeader fontWeight="semibold">
        //                 Popover placement
        //             </PopoverHeader> */}
        //             {/* <PopoverArrow /> */}
        //             {/* <PopoverCloseButton /> */}
        //             <PopoverBody className="text-black bg-red-400">
        //                 {/* <div className="w-screen max-w-max flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
        //                     Lorem ipsum dolor sit amet, consectetur adipisicing
        //                     elit, sed do eiusmod tempor incididunt ut labore et
        //                     dolore.
        //                 </div> */}
        //                 <div className="w-full">
        //                     Lorem ipsum dolor sit, amet consectetur adipisicing
        //                     elit. Dolorem nesciunt alias perspiciatis rerum,
        //                     atque cum consequuntur iusto accusamus porro impedit
        //                     molestias ut eius architecto quasi quisquam a
        //                     praesentium eum voluptatem.
        //                 </div>
        //             </PopoverBody>
        //         </PopoverContent>
        //     </Popover>
        // </>
        <>
            <FlyoutMenu />
        </>
    );
};
export default Header;
