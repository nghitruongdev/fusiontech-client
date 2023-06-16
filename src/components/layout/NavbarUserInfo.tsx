"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { AiOutlineUser } from "react-icons/ai";
import { Spinner } from "@chakra-ui/react";
import { User } from "next-auth";

const NavbarUserInfo = () => {
    const { data: session, status } = useSession();
    const userInfo = session?.user;

    if (status === "loading") {
        return (
            <>
                <div className="navBarHover">
                    <Spinner />
                </div>
            </>
        );
    }
    if (status === "unauthenticated") {
        <div className="navBarHover" onClick={() => signIn()}>
            <AiOutlineUser className="text-lg" />
            <div className="">
                <p className="text-xs">Sign In</p>
                <h2 className="text-base font-semibold -mt-1">Account</h2>
            </div>
        </div>;
    }
    if (status === "authenticated") {
        return (
            <div className="navBarHover" onClick={() => signOut()}>
                {/* <AiOutlineUser className='text-lg' /> */}
                <Image
                    width={500}
                    height={500}
                    className="w-10 rounded-full object-cover"
                    src={userInfo?.image ?? ``}
                    alt="userImage"
                />
                <div className="">
                    <p className="text-xs">Sign out</p>
                    <h2 className="text-base font-semibold -mt-1">
                        {userInfo?.name}
                    </h2>
                </div>
            </div>
        );
    }
};
export default NavbarUserInfo;
