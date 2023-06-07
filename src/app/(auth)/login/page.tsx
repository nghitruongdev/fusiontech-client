"use client";
import { AuthPage } from "@refinedev/chakra-ui";

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
        />
    );
};
export default LoginPage;
