import { AuthBindings } from "@refinedev/core";
import {
    signInWithPopup,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut as fbSignOut,
    GoogleAuthProvider,
    browserLocalPersistence,
    AuthError,
    verifyPasswordResetCode,
    confirmPasswordReset,
} from "firebase/auth";
import {
    AuthActionResponse,
    CheckResponse,
} from "@refinedev/core/dist/interfaces";
import { firebaseAuth } from "@/lib/firebase";
import { useSsr } from "usehooks-ts";
import { getServerSession } from "next-auth";
import { signOut } from "next-auth/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { ICredentials, ILogin, IUpdatePassword } from "types/auth";
import { authOptions } from "@/lib/nextAuthOptions";

const auth = firebaseAuth;
const googleProvider = new GoogleAuthProvider();
firebaseAuth.setPersistence(browserLocalPersistence);
firebaseAuth.useDeviceLanguage();

const authProvider = (router?: AppRouterInstance): AuthBindings => {
    return {
        login: async (props: ILogin) => {
            const { providerName, callbackUrl } = props;
            try {
                switch (providerName) {
                    case "credentials":
                        await handleCredentialLogin(props.credentials);
                        break;
                    case "google.com":
                        await handleGoogleLogin();
                        break;
                }
                return {
                    success: true,
                    redirectTo: callbackUrl ?? "/",
                };
            } catch (err) {
                const error = err as Error;
                console.debug(err);
                if (error.message.includes("auth/popup-closed-by-user"))
                    return {
                        success: false,
                    };
                return {
                    success: false,
                    error: error,
                };
            }
        },
        check: async (params: any) => {
            const ssr = useSsr();
            console.log("ssr", ssr);
            if (ssr.isServer) {
                const session = await getServerSession(authOptions);
                console.log("session check", session);
                return {
                    authenticated: true,
                };
            }
            return {} as CheckResponse;
        },

        logout: async (params: any) => {
            const result = await fbSignOut(firebaseAuth);
            console.log("signOut result", result);
            signOut();
            router?.refresh();
            return {
                success: true,
            };
        },

        onError: async (error) => {
            console.debug("Handling error inside on error");
            if (error && error.statusCode === 401) {
                return {
                    error: new Error("Unauthorized"),
                    logout: true,
                    redirectTo: "/login",
                };
            }
            // console.error(error);
            return {
                error: error,
            };
            // return { error };
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
            try {
                const response = await sendPasswordResetEmail(auth, email);
                console.log("response sending email", response);
                return {
                    success: true,
                };
            } catch (error) {
                return {
                    success: false,
                    error: error as Error,
                };
            }
        },
        updatePassword: async (props: IUpdatePassword) => {
            const { type } = props;
            if (type === "reset") {
                const { actionCode, password } = props;
                try {
                    const result = await confirmPasswordReset(
                        auth,
                        actionCode,
                        password,
                    );
                    // Password reset has been confirmed and new password updated.
                    // TODO: Display a link back to the app, or sign-in the user directly
                    // if the page belongs to the same domain as the app:
                    // auth.signInWithEmailAndPassword(accountEmail, newPassword);
                    // TODO: If a continue URL is available, display a button which on
                    // click redirects the user back to the app via continueUrl with
                    // additional state determined from that URL's parameters.
                    return {
                        success: true,
                        response: result,
                    };
                } catch (error) {
                    return {
                        success: false,
                        error: error as Error,
                    };
                }
            }
            throw new Error("Operation is not supported");
        },
        // getPermissions: async (params: any) => ({} as string[]),
        // getIdentity: async (params?: any) => ({}),
    };
};

const handleCredentialLogin = async (
    credentials: ICredentials["credentials"],
) => {
    const { email, username, password, remember } = credentials;
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        console.log("result", result);
        return result;
    } catch (err) {
        console.debug(err);
        throw new Error("Email hoặc mật khẩu không trùng khớp.");
    }
};

const handleGoogleLogin = async () => {
    const result = await signInWithPopup(
        auth,
        googleProvider.addScope("profile"),
    );
    return result;

    //todo: track if user is new, send request to save user data to back-end server
};

export { authProvider as firebaseAuthProvider };
