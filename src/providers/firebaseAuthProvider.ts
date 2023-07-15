import { AuthBindings } from "@refinedev/core";
import {
    signInWithPopup,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut as fbSignOut,
    GoogleAuthProvider,
    browserLocalPersistence,
    confirmPasswordReset,
    getAuth,
    UserCredential,
    AuthError,
    createUserWithEmailAndPassword,
    updateCurrentUser,
    updateProfile,
} from "firebase/auth";
import {
    AuthActionResponse,
    CheckResponse,
    HttpError,
    OnErrorResponse,
} from "@refinedev/core/dist/interfaces";
import { useSsr } from "usehooks-ts";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { ILogin, IRegister, IUpdatePassword } from "types/auth";
import { getServerSession } from "@/lib/server";
import { firebaseApp } from "@/lib/firebase";

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();
auth.setPersistence(browserLocalPersistence);
auth.useDeviceLanguage();

const login = async (props: ILogin): Promise<AuthActionResponse> => {
    const { providerName, callbackUrl } = props;
    let result: UserCredential;
    try {
        switch (providerName) {
            case "google.com":
                result = await signInWithPopup(
                    auth,
                    googleProvider.addScope("profile"),
                );
                //todo: track if user is new, send request to save user data to back-end server

                break;
            case "credentials": {
                const { email, password } = props.credentials;
                try {
                    result = await signInWithEmailAndPassword(
                        auth,
                        email,
                        password,
                    );
                } catch (err) {
                    throw new Error("Email hoặc mật khẩu không trùng khớp.");
                }
                break;
            }
        }
        return {
            success: true,
            redirectTo: callbackUrl ?? "/",
        };
    } catch (err) {
        const error = err as AuthError;
        console.error(error.code);

        if (error.message.includes("auth/popup-closed-by-user"))
            return {
                success: false,
            };
        return {
            success: false,
            error: error,
        };
    }
};

const check = async (): Promise<CheckResponse> => {
    const ssr = useSsr();
    console.log("ssr", ssr);

    if (ssr.isServer) {
        const result = await getServerSession();
        console.log("result", result);
        return {
            authenticated: true,
        };
    }

    const user = auth.currentUser;
    if (user) {
        return {
            authenticated: true,
        };
    }
    return {
        authenticated: false,
    };
};

const logout =
    (router?: AppRouterInstance) =>
    async (params: any): Promise<AuthActionResponse> => {
        const result = await fbSignOut(auth);
        console.log("signOut result", result);
        router?.refresh();
        return {
            success: true,
        };
    };

const onError = async (error: HttpError): Promise<OnErrorResponse> => {
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
};

const register = async (formValues: IRegister) => {
    //todo: gửi info lên back-end api
    //todo: đợi backend trả về response là token
    //todo: gọi firebase và settoken nếu success
    //todo: throw error nếu có lỗi
};

const forgotPassword = async (email: string): Promise<AuthActionResponse> => {
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
};
const updatePassword = async (
    props: IUpdatePassword,
): Promise<AuthActionResponse> => {
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
};
// getPermissions: async (params: any) => ({} as string[]),
// getIdentity: async (params?: any) => ({}),

const firebaseAuth = {
    auth: auth,
    login,
    logout: logout(),
    check,
    onError,
    forgotPassword,
    updatePassword,
    authProvider: (router?: AppRouterInstance): AuthBindings => ({
        login,
        logout: logout(router),
        check,
        onError,
        forgotPassword,
        updatePassword,
    }),
};
export { firebaseAuth };
