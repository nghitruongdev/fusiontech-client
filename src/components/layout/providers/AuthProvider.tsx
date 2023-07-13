"use client";
import { firebaseAuth } from "@/providers/firebaseAuthProvider";
import { useEffect } from "react";

const unsub = firebaseAuth.auth.onAuthStateChanged(async (user) => {
    console.debug("onAuthStateChanged", new Date().getTime());
    // console.log("user", user);
});
console.log("Done adding onAuthState Changed", new Date().getTime());
console.count("code outside auth provider ran");
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        console.debug("Auth Provider rendered");
        return () => {
            console.debug("AUth provider unmounted");
        };
    });
    return <>{children}</>;
};
export default AuthProvider;
