"use client";
import { AuthPage, ThemedTitleV2 } from "@refinedev/chakra-ui";
import { Laptop2Icon } from "lucide-react";

const LoginPage = () => {
    return (
        <AuthPage
            type="forgotPassword"
            title={
                <ThemedTitleV2
                    collapsed={false}
                    text="FusionTech Store"
                    icon={<Laptop2Icon />}
                />
            }
        />
    );
};
export default LoginPage;
