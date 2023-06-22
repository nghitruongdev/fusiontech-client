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
import CategoryDropdown from "./CategoryDropdown";
import { NavigationMenuTrigger } from "@radix-ui/react-navigation-menu";
import {
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
} from "@chakra-ui/react";
import { PopoverDemo } from "./TailwindMenu";

const Header = () => {
    return (
      <>
        <BannerNavbar />
        <div className="w-full bg-blue-600 text-white sticky top-0 z-50 overflow-auto">
          <div className="w-full h-full border-b-[1px] border-b-white p-2">
            <div className="mx-auto max-w-container px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <Link href="/">
                <div className="navBarHover">
                  <Image src={logo} alt="Website logo" className="w-44" />
                </div>
              </Link>
              <PopoverDemo />
              <div className="flex-auto h-10 relative">
                <input
                  type="text"
                  placeholder="Search everything at FusionTech store"
                  className="h-full w-full rounded-full px-4 text-black text-base outline-none border-[1px] border-transparent focus-visible:border-black duration-200"
                />
                <span className="absolute w-8 h-8 rounded-full flex items-center justify-center top-1 right-1 bg-yellow text-black text-xl">
                  <IoSearchOutline />
                </span>
              </div>
              <div className="navBarHover">
                <AiOutlineHeart className="text-lg" />
                <div className="">
                  <p className="text-xs">Reorder</p>
                  <h2 className="text-base font-semibold -mt-1">My Items</h2>
                </div>
              </div>
              <NavbarUserInfo />
              <Link href="/cart">
                <div className="flex flex-col justify-center items-center gap-2 h-12 px-5 rounded-full bg-transparent hover:bg-hoverBg duration-300 relative">
                  <BsCart2 className="text-2xl" />
                  <p className="text-[10px] -mt-2">$0.00</p>
                  <span className="absolute w-4 h-4 bg-yellow text-black top-0 right-4 rounded-full flex items-center justify-center font-bodyFont text-xs">
                    0
                  </span>
                </div>
              </Link>
            </div>
          </div>
          <NavbarBottom />
        </div>
      </>
    );
  };

const NavbarBottom = () => {
    return (
        <div className="max-w-container mx-auto py-2 px-6 flex flex-col sm:flex-row items-center justify-between overflow-auto">
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
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
            <ul className="flex flex-col sm:flex-row gap-6 text-sm font-semibold">
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

export default Header;
