"use client";
import { AuthPage, ThemedTitleV2 } from "@refinedev/chakra-ui";
import { Laptop2Icon } from "lucide-react";

const LoginPage = () => {
    return (
        <AuthPage
            type="login"
            formProps={{
                defaultValues: {
                    email: "demo@refine.dev",
                    password: "demodemo",
                },
            }}
            providers={[{ name: "google", label: "withGoogle" }]}
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
