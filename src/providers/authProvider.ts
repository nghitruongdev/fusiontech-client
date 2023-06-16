import { AuthBindings } from "@refinedev/core";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import nookies from "nookies";

const mockUsers = [
    {
        name: "John Doe",
        email: "johndoe@mail.com",
        roles: ["admin"],
        avatar: "https://i.pravatar.cc/150?img=1",
    },
    {
        name: "Jane Doe",
        email: "janedoe@mail.com",
        roles: ["editor"],
        avatar: "https://i.pravatar.cc/150?img=1",
    },
    {
        email: "admin@refine.dev",
        roles: ["admin"],
    },
    {
        email: "editor@refine.dev",
        roles: ["editor"],
    },
    {
        email: "demo@refine.dev",
        roles: ["user"],
    },
];
export const authProvider: AuthBindings = {
    login: async ({ providerName, email, username, password, remember }) => {
        if (providerName) {
            signIn(providerName, {
                redirect: true,
            });
            return {
                success: true,
            };
        }

        signIn("credentials", {
            email,
            password,
            callbackUrl: "/",
            redirect: true,
        });
        return { success: true };

        // Suppose we actually send a request to the back end here.
        // const user = mockUsers.find((item) => item.email === email);

        // if (user) {
        //     nookies.set(null, "auth", JSON.stringify(user), {
        //         maxAge: 30 * 24 * 60 * 60,
        //         path: "/",
        //     });
        //     return {
        //         success: true,
        //         redirectTo: "/",
        //     };
        // }

        // return {
        //     success: false,
        //     error: {
        //         name: "LoginError",
        //         message: "Invalid username or password",
        //     },
        // };
    },
    register: async (params) => {
        // Suppose we actually send a request to the back end here.
        const user = mockUsers.find((item) => item.email === params.email);

        if (user) {
            nookies.set(null, "auth", JSON.stringify(user), {
                maxAge: 30 * 24 * 60 * 60,
                path: "/",
            });
            return {
                success: true,
                redirectTo: "/",
            };
        }
        return {
            success: false,
            error: {
                message: "Register failed",
                name: "Invalid email or password",
            },
        };
    },
    forgotPassword: async (params) => {
        // Suppose we actually send a request to the back end here.
        const user = mockUsers.find((item) => item.email === params.email);

        if (user) {
            //we can send email with reset password link here
            return {
                success: true,
            };
        }
        return {
            success: false,
            error: {
                message: "Forgot password failed",
                name: "Invalid email",
            },
        };
    },
    updatePassword: async (params) => {
        // Suppose we actually send a request to the back end here.
        const isPasswordInvalid =
            params.password === "123456" || !params.password;

        if (isPasswordInvalid) {
            return {
                success: false,
                error: {
                    message: "Update password failed",
                    name: "Invalid password",
                },
            };
        }

        return {
            success: true,
        };
    },
    logout: async () => {
        // nookies.destroy(null, "auth");
        signOut({
            redirect: true,
            callbackUrl: "/login",
        });
        return {
            success: true,
            // redirectTo: "/login",
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
    //check from refine-with-next-app-dir
    check: async (authCookie) => {
        if (authCookie) {
            return {
                authenticated: true,
            };
        } else {
            const cookies = nookies.get(null);

            if (cookies.auth) {
                return {
                    authenticated: true,
                };
            }
        }

        return {
            authenticated: false,
            error: {
                message: "Check failed",
                name: "Unauthorized",
            },
            logout: true,
            redirectTo: "/login",
        };
    },
    // check: async (ctx: any) => {
    //     const cookies = nookies.get(ctx);
    //     if (cookies["auth"]) {
    //         return {
    //             authenticated: true,
    //         };
    //     }

    //     return {
    //         authenticated: false,
    //         logout: true,
    //         redirectTo: "/login",
    //     };
    // },
    getPermissions: async () => {
        const auth = nookies.get()["auth"];
        if (auth) {
            const parsedUser = JSON.parse(auth);
            return parsedUser.roles;
        }
        return null;
    },
    // getIdentity: async () => {
    //     const auth = nookies.get()["auth"];
    //     if (auth) {
    //         const parsedUser = JSON.parse(auth);
    //         return parsedUser;
    //     }
    //     return null;
    // },
    //getIdentity from refine-next-with-app-dir
    getIdentity: async () => {
        const cookies = nookies.get(null);
        if (!cookies.auth) return null;

        return {
            id: 1,
            name: "Jane Doe",
            avatar: "https://unsplash.com/photos/IWLOvomUmWU/download?force=true&w=640",
        };
    },
};
