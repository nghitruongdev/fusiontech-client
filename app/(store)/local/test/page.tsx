"use client";
import { firebaseAuthProvider } from "@/providers/firebaseAuthProvider";
import { signIn } from "next-auth/react";

const page = () => {
    const clickHandler = async () => {
        const result = await signIn("firebase", {
            redirect: false,
        });
        console.log("signed in clicked");
    };
    return <div onClick={clickHandler}>{JSON.stringify(null)}</div>;
};
export default page;
