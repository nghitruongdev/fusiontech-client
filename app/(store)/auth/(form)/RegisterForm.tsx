import React, { createContext, useContext, useRef, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import AuthPage from "../AuthPage";
import {
    FormControl,
    FormErrorIcon,
    FormErrorMessage,
    Input,
} from "@chakra-ui/react";
import { ckMerge } from "@/lib/chakra-merge";
import PasswordInput from "@components/ui/PasswordInput";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { IRegister } from "types/auth";

const RegisterForm = () => {
    const formProps = useForm<IRegister>();

    //todo: sửa lại tất cả các field: register, placeholder, input name, input type,
    //todo: thêm validation rule
    //todo: thêm một cái errorState/ show toast thông báo lỗi
    //todo: viết code xử lý ở useRegisterFormContext ở cuối page
    //FIXME: -optional- fix layout form

    return (
        <AuthPage title={`Đăng ký thành viên FusionTech`}>
            <FormProvider {...formProps}>
                <div className="flex justify-center bg-white min-h-screen">
                    <div className="w-2/4 px-20">
                        <div className="mb-4">
                            <RegisterForm.Email />
                            <RegisterForm.FirstName />
                            <RegisterForm.LastName />
                            <RegisterForm.Phone />
                            <RegisterForm.Password />
                            <RegisterForm.ConfirmPassword />
                        </div>
                        <RegisterForm.Subscription />
                        <RegisterForm.SubmitButton />
                        <p className="text-center">Hoặc</p>
                        <hr className="my-4" />
                        <RegisterForm.GoogleSignup />
                        <RegisterForm.LoginLink />
                    </div>
                </div>
            </FormProvider>
        </AuthPage>
    );
};

RegisterForm.FirstName = () => {
    const {
        register,
        formState: { errors },
    } = useRegisterFormContext();
    return (
        <FormControl className="" isRequired isInvalid={!!errors.email}>
            <Input
                {...register("email", {
                    required: "Vui lòng nhập địa chỉ email.",
                })}
                type="email"
                placeholder="Nhập địa chỉ email"
                _placeholder={{ fontSize: "sm" }}
                className={ckMerge(`bg-gray-50 placeholder:text-sm`)}
            />
            {errors.email?.message && (
                <FormErrorMessage>
                    <FormErrorIcon />
                    {errors.email?.message}
                </FormErrorMessage>
            )}
        </FormControl>
    );
};

RegisterForm.LastName = () => {
    const {
        register,
        formState: { errors },
    } = useRegisterFormContext();
    return (
        <FormControl className="" isRequired isInvalid={!!errors.email}>
            <Input
                {...register("email", {
                    required: "Vui lòng nhập địa chỉ email.",
                })}
                type="email"
                placeholder="Nhập địa chỉ email"
                _placeholder={{ fontSize: "sm" }}
                className={ckMerge(`bg-gray-50 placeholder:text-sm`)}
            />
            {errors.email?.message && (
                <FormErrorMessage>
                    <FormErrorIcon />
                    {errors.email?.message}
                </FormErrorMessage>
            )}
        </FormControl>
    );
};

RegisterForm.Phone = () => {
    const {
        register,
        formState: { errors },
    } = useRegisterFormContext();
    return (
        <FormControl className="" isRequired isInvalid={!!errors.email}>
            <Input
                {...register("email", {
                    required: "Vui lòng nhập địa chỉ email.",
                })}
                type="email"
                placeholder="Nhập địa chỉ email"
                _placeholder={{ fontSize: "sm" }}
                className={ckMerge(`bg-gray-50 placeholder:text-sm`)}
            />
            {errors.email?.message && (
                <FormErrorMessage>
                    <FormErrorIcon />
                    {errors.email?.message}
                </FormErrorMessage>
            )}
        </FormControl>
    );
};

RegisterForm.Email = () => {
    const {
        register,
        formState: { errors },
    } = useRegisterFormContext();
    return (
        <FormControl className="" isRequired isInvalid={!!errors.email}>
            <Input
                {...register("email", {
                    required: "Vui lòng nhập địa chỉ email.",
                })}
                type="email"
                placeholder="Nhập địa chỉ email"
                _placeholder={{ fontSize: "sm" }}
                className={ckMerge(`bg-gray-50 placeholder:text-sm`)}
            />
            {errors.email?.message && (
                <FormErrorMessage>
                    <FormErrorIcon />
                    {errors.email?.message}
                </FormErrorMessage>
            )}
        </FormControl>
    );
};

RegisterForm.Password = () => {
    const {
        register,
        formState: { errors },
    } = useRegisterFormContext();
    return (
        <FormControl className="" isRequired isInvalid={!!errors.password}>
            <PasswordInput
                {...register("password", {
                    required: "Mật khẩu không được để trống",
                })}
                placeholder="Nhập mật khẩu"
                _placeholder={{ fontSize: "sm" }}
                className={ckMerge(`bg-gray-50 placeholder:text-sm`)}
            />
            {errors.password?.message && (
                <FormErrorMessage>
                    <FormErrorIcon />
                    {errors.password?.message}
                </FormErrorMessage>
            )}
        </FormControl>
    );
};

RegisterForm.ConfirmPassword = () => {
    const {
        register,
        formState: { errors },
    } = useRegisterFormContext();
    return (
        <FormControl className="" isRequired isInvalid={!!errors.password}>
            <PasswordInput
                {...register("password", {
                    required: "Mật khẩu không được để trống",
                })}
                placeholder="Nhập mật khẩu"
                _placeholder={{ fontSize: "sm" }}
                className={ckMerge(`bg-gray-50 placeholder:text-sm`)}
            />
            {errors.password?.message && (
                <FormErrorMessage>
                    <FormErrorIcon />
                    {errors.password?.message}
                </FormErrorMessage>
            )}
        </FormControl>
    );
};

RegisterForm.AgreeCheck = () => {
    const {
        register,
        formState: { errors },
    } = useRegisterFormContext();
    return (
        <label className="inline-flex items-center">
            <input type="checkbox" className="form-radio text-blue-500" />
            <span className="ml-2">
                Tôi đồng ý với các điều khoản bảo mật cá nhân
            </span>
        </label>
    );
};

RegisterForm.Subscription = () => {
    return (
        <div className="mb-4">
            <label className="inline-flex items-center">
                <input type="checkbox" className="form-radio text-blue-500" />
                <span className="ml-2">
                    Đăng ký nhận bản tin khuyến mãi qua email
                </span>
            </label>
        </div>
    );
};

RegisterForm.SubmitButton = () => {
    const { onFormSubmit, handleSubmit } = useRegisterFormContext();
    return (
        <div className="flex flex-col items-center mb-4">
            <button
                onClick={handleSubmit(onFormSubmit)}
                className="bg-blue-500 text-white font-semibold text-md px-4 py-2 rounded-md w-full h-12 shadow-md"
            >
                Đăng ký ngay
            </button>
        </div>
    );
};

RegisterForm.GoogleSignup = () => {
    const { onGoogleSignup } = useRegisterFormContext();

    return (
        <div className="flex my-4">
            <button
                onClick={onGoogleSignup}
                className="bg-white text-black px-4 py-2 rounded-lg w-full border border-gray-400 flex items-center justify-center"
            >
                <FcGoogle className="w-8 h-8 mr-2" />
                <span>Đăng ký bằng Google</span>
            </button>
        </div>
    );
};

RegisterForm.LoginLink = () => (
    <div className="flex justify-center mb-4">
        <p>Bạn đã có tài khoản? </p>
        <Link href="/login" className="text-red-500 font-semibold ml-2">
            Đăng nhập ngay
        </Link>
    </div>
);

const useRegisterFormContext = () => {
    const formMethods = useFormContext<IRegister>();
    const { formState } = formMethods;

    //todo: code đăng ký google here
    //todo: gọi firebaseAuthProvider.login()
    //!đăng ký với đăng nhập bằng google nó giống nhau
    const onGoogleSignup = () => {};

    //todo: code đăng ký bằng form here
    //todo: gọi firebaseAuthProvider.register()
    const onFormSubmit = (value: IRegister) => {};

    //todo: redirect page to callbackUrl when sign up successfully like login page
    const handlePostSuccess = () => {};

    return {
        ...formMethods,
        onGoogleSignup,
        onFormSubmit,
    };
};
export default RegisterForm;
