import { GoogleAuthProvider } from "firebase/auth";

export type ILogin = {
    callbackUrl?: string;
} & (IGoogle | ICredentials);

export type IGoogle = {
    providerName: (typeof IAuthProvider)["google"];
};

export const IAuthProvider = {
    google: GoogleAuthProvider.PROVIDER_ID,
    credentials: "credentials",
};

export type ICredentials = {
    providerName: (typeof IAuthProvider)["credentials"];
    credentials: {
        email: string;
        password: string;
        username?: string;
        remember?: boolean;
    };
};

export type IRegister = CredentialsRegister | GoogleRegister;

export type CredentialsRegister = {
    providerName: (typeof IAuthProvider)["credentials"];
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    agree?: boolean;
    subscription?: boolean;
};
export type GoogleRegister = {
    providerName: (typeof IAuthProvider)["google"];
    firebaseId: string;
};
export type IUpdatePassword = {} & IResetPassword;

export type IResetPassword = {
    type: "reset";
    actionCode: string;
    password: string;
};

export type ICheck = {};