"use client";
import { setAuthUser } from "@/hooks/useAuth/useAuthUser";
import { firebaseAuth } from "@/providers/firebaseAuthProvider";
import { useEffect } from "react";

const unsub = firebaseAuth.auth.onIdTokenChanged(async (user) => {
    console.debug("onAuthStateChanged", new Date().getTime());
    setAuthUser(user);
});

console.log("Done adding onAuthState Changed", new Date().getTime());
console.count("code outside auth provider ran");
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        console.debug("Auth Provider rendered");
        return () => {
            console.debug("Auth provider unmounted");
        };
    });
    return <>{children}</>;
};
export default AuthProvider;
