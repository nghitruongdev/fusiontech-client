import { GoogleAuthProvider } from "firebase/auth";

export type ILogin = {
    callbackUrl?: string;
} & (IGoogle | ICredentials);

export type IGoogle = {
    providerName: typeof GoogleAuthProvider.PROVIDER_ID;
};

export type ICredentials = {
    providerName: "credentials";
    credentials: {
        email: string;
        password: string;
        username?: string;
        remember?: boolean;
    };
};

export type IUpdatePassword = {} & IResetPassword;

export type IResetPassword = {
    type: "reset";
    actionCode: string;
    password: string;
};

export type ICheck = {};
