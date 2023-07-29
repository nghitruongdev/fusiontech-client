"use client";

import useCart, { useCartItems } from "@components/store/cart/useCart";
import { ShoppingBag, UserCircle } from "lucide-react";
import React, { useState, ChangeEvent } from "react";
import Link from "next/link";
import {
    Avatar,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
} from "@chakra-ui/react";
import { IoSearchOutline } from "react-icons/io5";
import { useAuthUser } from "@/hooks/useAuth/useAuthUser";
import dynamic from "next/dynamic";
import { Skeleton } from "@components/ui/Skeleton";
import { User } from "@firebase/auth";
// import useModals, { ModalProvider } from "@components/ui/AlertModals";
import { useLogout } from "@refinedev/core";
import useCallbackUrl from "@/hooks/useCallbackUrl";
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

export const UserInfoMenu = ({ user }: { user: User }) => {
    const { displayName, email, phoneNumber, photoURL } = user;
    const display = displayName ?? email ?? phoneNumber;
    // const { confirm } = useModals();
    const { mutate: logout } = useLogout();
    return (
        <>
            <Menu>
                <MenuButton
                    as={"div"}
                    className="cursor-pointer navBarHover max-w-[200px]"
                >
                    <div className="flex gap-2 items-center ">
                        <Avatar
                            src={photoURL ?? ""}
                            name={display ?? ""}
                            backdropBlur={"lg"}
                            bg={"blue.700"}
                            size="md"
                            scale={"80"}
                            boxSize={10}
                        />
                        <div className="text-start text-sm font-normal text-ellipsis overflow-hidden">
                            <p className="text-xs">Xin chào,</p>
                            <p className="font-semibold text-md ">
                                {displayName ??
                                    email ??
                                    phoneNumber ??
                                    "Tài khoản của tôi"}
                            </p>
                        </div>
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
                    <MenuItem
                        onClick={async () => {
                            const result = await confirm(
                                "Bạn có muốn đăng xuất khỏi hệ thống?",
                            );
                            if (!result) {
                                console.log("No longer want to logged out");
                                return;
                            }
                            logout(undefined, {
                                onSuccess() {
                                    console.log("log out successfully");
                                },
                            });
                        }}
                    >
                        Đăng xuất
                    </MenuItem>
                </MenuList>
            </Menu>
        </>
    );
};

const DynamicUserMenu = dynamic(
    () =>
        new Promise((res) => {
            setTimeout(() => {
                res(undefined);
            }, 300);
        })
            .then(() => import("./header-client"))
            .then((mod) => mod.UserInfoMenu),
    {
        loading: () => (
            <>
                <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[100px]" />
                        <Skeleton className="h-4 w-[100px]" />
                    </div>
                </div>
            </>
        ),
    },
);
export const UserInfo = () => {
    const { user } = useAuthUser();
    const { callbackUrl } = useCallbackUrl();

    if (user)
        return (
            // <ModalProvider>
            <DynamicUserMenu user={user} />
            // </ModalProvider>
        );
    return (
        <Link
            href={{
                pathname: "/auth/login",
                query: {
                    ...(callbackUrl && { callbackUrl }),
                },
            }}
            className="navBarHover"
        >
            {/* <div className="navBarHover"> */}
            <UserCircle className="text-lg" />
            <div className="">
                <p className="text-xs">Đăng nhập</p>
                <h2 className="text-base font-semibold -mt-1">Tài khoản</h2>
            </div>
            {/* </div> */}
        </Link>
    );
};

export const SearchInput = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Lấy giá trị nhập vào từ người dùng
        const inputValue: string = e.target.value; // Kiểu dữ liệu của inputValue cũng là string
        // Gán giá trị của inputValue vào searchTerm
        setSearchTerm(inputValue);
    };
    //Filter chữ cái đầu của keyword thành viết hoa
    const capitalizeFirstLetter = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    // khi người dùng enter sẽ chuyển trang
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            // Chuyển trang tới trang kết quả tìm kiếm khi nhấn phím "Enter"
            window.location.href = `/search?keyword=${capitalizeFirstLetter(
                searchTerm,
            )}`;
        }
    };
    return (
        <div className="h-10 flex flex-1 relative">
            <input
                value={searchTerm}
                onChange={handleSearch}
                onKeyDown={handleKeyPress} // Thêm sự kiện xử lý khi nhấn phím
                type="text"
                placeholder="Tìm kiếm thứ bạn cần ở FusionTech store"
                className="h-full w-full rounded-full px-4 text-black text-base outline-none border-[1px] border-transparent focus-visible:border-black duration-200"
            />
            {/* <Link href={`/search?keyword=${searchTerm}`}>
                <span className="absolute w-8 h-8 rounded-full flex items-center justify-center top-1 right-1 bg-yellow text-black text-xl">
                    <IoSearchOutline />
                </span>
            </Link> */}
            <Link href={`/search?keyword=${capitalizeFirstLetter(searchTerm)}`}>
                {/* Truyền searchTerm thông qua encodeURIComponent để đảm bảo chuỗi an toàn cho URL */}
                <span className="absolute w-8 h-8 rounded-full flex items-center justify-center top-1 right-1 bg-yellow text-black text-xl">
                    <IoSearchOutline />
                </span>
            </Link>
        </div>
    );
};
