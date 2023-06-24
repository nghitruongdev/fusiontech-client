"use client";

import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { AiOutlineUser } from "react-icons/ai";
import {
    Button,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
} from "@chakra-ui/react";
import Link from "next/link";

const NavbarUserInfo = () => {
    const { data: session, status } = useSession();
    const userInfo = session?.user;

    if (status === "authenticated") {
        return (
            <Menu>
                <MenuButton as={Button} variant="unstyled">
                    <div className="flex gap-2 items-center navBarHover">
                        <Image
                            width={500}
                            height={500}
                            className="w-10 rounded-full object-cover"
                            src={userInfo?.image ?? ``}
                            alt="userImage"
                        />
                        <h2 className="text-base font-semibold -mt-1">
                            {userInfo?.name}
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
                    <MenuItem onClick={() => signOut()}>Log out</MenuItem>
                </MenuList>
            </Menu>
            // <div className="navBarHover">
            // </div>
        );
    }
    return (
        <div className="navBarHover" onClick={() => signIn()}>
            <AiOutlineUser className="text-lg" />
            <div className="">
                <p className="text-xs">Sign In</p>
                <h2 className="text-base font-semibold -mt-1">Account</h2>
            </div>
        </div>
    );
};
export default NavbarUserInfo;
