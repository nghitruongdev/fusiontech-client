"use client";
import LoginForm from "../(form)/LoginForm";

const LoginPage = () => {
    return (
        // <AuthPage
        //     type="login"
        //     formProps={{
        //         defaultValues: {
        //             email: "demo@refine.dev",
        //             password: "demodemo",
        //         },
        //     }}
        //     providers={[{ name: "Google", label: "withGoogle" }]}
        //     title={
        //         <ThemedTitleV2
        //             collapsed={false}
        //             text="FusionTech Store"
        //             icon={<Laptop2Icon />}
        //         />
        //     }
        // />
        <LoginForm />
    );
};
export default LoginPage;
