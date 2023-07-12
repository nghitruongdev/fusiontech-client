"use client";
import { setUser } from "@/hooks/useAuth/useAuthUser";
import { firebaseAuth } from "@/providers/firebaseAuthProvider";
import { useEffectOnce } from "usehooks-ts";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    useEffectOnce(() => {
        const unsub = firebaseAuth.auth.onAuthStateChanged(async (user) => {
            console.debug("onAuthStateChanged");
            setUser(user);
            // console.log("user", user);
        });
        return unsub;
    });
    return <>{children}</>;
};
export default AuthProvider;
