import { BoxProps } from "@chakra-ui/react";
import { UseFormProps } from "@refinedev/react-hook-form";
import React from "react";
import { AuthPageProps } from "@refinedev/core";
import {
    LoginPage,
    RegisterPage,
    ForgotPasswordPage,
    UpdatePasswordPage,
} from "./components";
import Image from "next/image";
import { loginImg } from "@public/assets/images";

export interface FormPropsType<TFormType> extends UseFormProps {
    onSubmit?: (values: TFormType) => void;
}

export type AuthProps = AuthPageProps<BoxProps, BoxProps, FormPropsType<any>>;

/**
 * **refine** has a default auth page form which is served on `/login` route when the `authProvider` configuration is provided.
 * @param title is not implemented yet.
 * @see {@link https://refine.dev/docs/api-reference/chakra-ui/components/chakra-auth-page/} for more details.
 */
export const AuthPage: React.FC<AuthProps> = (props) => {
    const { type } = props;
    const renderView = () => {
        switch (type) {
            case "register":
                return <RegisterPage {...props} />;
            case "forgotPassword":
                return <ForgotPasswordPage {...props} />;
            case "updatePassword":
                return <UpdatePasswordPage {...props} />;
            default:
                return <LoginPage {...props} />;
        }
    };

    return (
        <div className="">
            <Image
                src={loginImg}
                className=" w-40 h-auto mx-auto"
                alt="Login image"
            />
            {renderView()}
        </div>
    );
};
