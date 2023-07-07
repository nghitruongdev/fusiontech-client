"use client";
import { setUser } from "@/hooks/useAuthUser";
import { firebaseAuth } from "@/lib/firebase";
import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import { useEffectOnce } from "usehooks-ts";

const NextAuthProvider = ({ children }: { children: React.ReactNode }) => {
    useEffectOnce(() => {
        const unsub = firebaseAuth.onAuthStateChanged(async (user) => {
            console.debug("onAuthStateChanged");
            setUser(user);
        });
        return () => unsub();
    });
    return <SessionProvider>{children}</SessionProvider>;
};
export default NextAuthProvider;

// if (user) {
// const accessToken = await user.getIdTokenResult();
// const nextUser: AppUser = {
//     id: user.uid,
//     name: user.displayName,
//     email: user.email,
//     image: user.photoURL,
//     phone: user.phoneNumber,
//     isAnonymous: user.isAnonymous,
//     metadata: user.metadata,
//     providerId: user.providerId,
//     tokens: {
//         accessToken: accessToken,
//         refreshToken: user.refreshToken,
//     },
// };
// setCookie(null, "authenticated", "true");
// const result = await signIn("firebase", {
//     redirect: false,
//     user: JSON.stringify({ ...nextUser }),
// });
// console.log("sign in result", result);
// fbSignOut(auth);
// }

// if (!!!user) {
//     console.debug("user is logged out", "removing cart id");
//     window.localStorage.removeItem("cid");
// }
