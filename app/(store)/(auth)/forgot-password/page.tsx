"use client";
import { AuthPage, ThemedTitleV2 } from "@refinedev/chakra-ui";
import { Laptop2Icon } from "lucide-react";
import ForgotPasswordForm from "../(form)/ForgotPasswordForm";

const LoginPage = () => {
    return (
        // <AuthPage
        //     type="forgotPassword"
        //     title={
        //         <ThemedTitleV2
        //             collapsed={false}
        //             text="FusionTech Store"
        //             icon={<Laptop2Icon />}
        //         />
        //     }
        // />
        <ForgotPasswordForm />
    );
};
export default LoginPage;
