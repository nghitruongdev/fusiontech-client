import { AuthBindings } from "@refinedev/core";
import {
    signInWithPopup,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut as fbSignOut,
    GoogleAuthProvider,
} from "firebase/auth";
import {
    AuthActionResponse,
    CheckResponse,
} from "@refinedev/core/dist/interfaces";
import { firebaseAuth } from "@/lib/firebase";
import { signIn, signOut } from "next-auth/react";
import { AppUser } from "types/next-auth";
import { useSsr } from "usehooks-ts";
import { getServerSession } from "next-auth";
import { setCookie } from "nookies";

export interface ILogin {
    providerName: typeof GoogleAuthProvider.PROVIDER_ID | "credentials";
    credentials?: {
        email?: string;
        username?: string;
        password: string;
        remember?: boolean;
    };
}

const auth = firebaseAuth;
const googleProvider = new GoogleAuthProvider();

auth.onAuthStateChanged(async (user) => {
    if (user) {
        const accessToken = await user.getIdTokenResult();

        const nextUser: AppUser = {
            id: user.uid,
            name: user.displayName,
            email: user.email,
            image: user.photoURL,
            phone: user.phoneNumber,
            isAnonymous: user.isAnonymous,
            metadata: user.metadata,
            providerId: user.providerId,
            tokens: {
                accessToken: accessToken,
                refreshToken: user.refreshToken,
            },
        };
        setCookie(null, "authenticated", "true");
        const result = await signIn("firebase", {
            redirect: false,
            user: JSON.stringify({ ...nextUser }),
        });
        console.log("sign in result", result);
        // fbSignOut(auth);
    }
});

export const firebaseAuthProvider = (): AuthBindings => {
    return {
        login: async ({ providerName, credentials }: ILogin) => {
            switch (providerName) {
                case "credentials":
                    handleCredentialLogin(credentials);
                    break;
                case "google.com":
                    handleGoogleLogin();
                    break;
            }
            return {
                success: true,
            };
        },

        check: async (params: any) => {
            const ssr = useSsr();
            console.log("ssr", ssr);
            if (ssr.isServer) {
                const session = await getServerSession();
                console.log("session check", session);
            }
            return {} as CheckResponse;
        },

        logout: async (params: any) => {
            const result = await signOut({
                redirect: false,
                // callbackUrl: ""
            });
            console.log("signOut result", result);
            return {
                success: true,
                // redirectTo: "",
                // error: ""
            };
        },

        onError: async (error) => {
            if (error && error.statusCode === 401) {
                return {
                    error: new Error("Unauthorized"),
                    logout: true,
                    redirectTo: "/login",
                };
            }
            console.error(error);
            return { error };
        },

        // optional methods
        // register: async ({ email, password }: any) => {
        //     const userCredentials = await createUserWithEmailAndPassword(
        //         auth,
        //         email,
        //         password,
        //     );
        // },

        forgotPassword: async (email: string) => {
            const response = await sendPasswordResetEmail(auth, email);
            console.log("response email", response);
            return {} as AuthActionResponse;
        },
        // updatePassword: async (params: any) => {
        //     return {} as AuthActionResponse;
        // },
        // getPermissions: async (params: any) => ({} as string[]),
        // getIdentity: async (params?: any) => ({}),
    };
};

const handleCredentialLogin = async (credentials: ILogin["credentials"]) => {
    if (!!!credentials) throw Error("Credentials not found");

    const { email = "", username, password, remember } = credentials;
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password,
        );
    } catch (err) {
        return err;
    }
};

const handleGoogleLogin = async () => {
    const userCred = await signInWithPopup(
        auth,
        googleProvider.addScope("profile"),
    );
    //todo: track if user is new, send request to save user data to back-end server
};
