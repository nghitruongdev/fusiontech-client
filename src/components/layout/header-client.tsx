"use client";

import useCart, { useCartItems } from "@components/store/cart/useCart";
import { ShoppingBag, UserCircle } from "lucide-react";

import Link from "next/link";
import Image from "next/image";
import {
    Button,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
} from "@chakra-ui/react";
import { IoSearchOutline } from "react-icons/io5";
export const HeaderClient = () => {};

export const CartButton = () => {
    const {} = useCart();
    const items = useCartItems();
    return (
        <>
            <Link href="/cart">
                <div className="flex flex-col justify-center items-center gap-2 h-12 px-5 rounded-full bg-transparent hover:bg-hoverBg duration-300">
                    <div className="relative">
                        <ShoppingBag className="text-2xl" />
                        {/* <BsCart2 className="text-2xl" /> */}
                        <span className="absolute w-4 h-4 bg-yellow text-black -top-1 -right-1 rounded-full flex items-center justify-center font-bodyFont text-xs">
                            {Object.keys(items).length}
                        </span>
                    </div>

                    {/* <p className="text-[10px] -mt-2">$0.00</p> */}
                </div>
            </Link>
        </>
    );
};

export const UserInfo = () => {
    // const { data: session, status } = useSession();
    // const userInfo = session?.user;

    if (status === "authenticated") {
        return (
            <Menu>
                <MenuButton as={Button} variant="unstyled">
                    <div className="flex gap-2 items-center navBarHover">
                        <Image
                            width={500}
                            height={500}
                            className="w-10 rounded-full object-cover"
                            src={"" ?? ``}
                            alt="userImage"
                        />
                        <h2 className="text-base font-semibold -mt-1">
                            {/* {userInfo?.name} */}
                        </h2>
                    </div>
                </MenuButton>
                <MenuList
                    color="blackAlpha.700"
                    className="text-zinc-700 text-sm"
                >
                    <MenuItem>Quản lý tài khoản</MenuItem>
                    <MenuItem>
                        <Link href="/account/orders">Quản lý đơn hàng</Link>
                    </MenuItem>

                    <MenuDivider />
                    {/* <MenuItem onClick={() => signOut()}>Log out</MenuItem> */}
                </MenuList>
            </Menu>
            // <div className="navBarHover">
            // </div>
        );
    }
    return (
        <div className="navBarHover">
            <UserCircle className="text-lg" />
            <div className="">
                <p className="text-xs">Sign In</p>
                <h2 className="text-base font-semibold -mt-1">Account</h2>
            </div>
        </div>
    );
};

export const SearchInput = () => {
    return (
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
    );
};
