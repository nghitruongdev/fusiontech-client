"use client";
import { AuthPage, ThemedTitleV2 } from "@refinedev/chakra-ui";
import { Laptop2Icon } from "lucide-react";
import RegisterForm from "../(form)/RegisterForm";

const RegisterPage = () => {
    return (
        // <AuthPage
        //     type="register"
        //     formProps={{
        //         defaultValues: {
        //             email: "demo@refine.dev",
        //             password: "demodemo",
        //         },
        //     }}
        //     title={
        //         <ThemedTitleV2
        //             collapsed={false}
        //             text="FusionTech Store"
        //             icon={<Laptop2Icon />}
        //         />
        //     }
        // />
        <RegisterForm />
    );
};
export default RegisterPage;
