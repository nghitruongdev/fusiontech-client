"use client";
import React, { createContext, useEffect, useState } from "react";
import { loginImg } from "@public/assets/images";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { useLogin } from "@refinedev/core";
import { useRouter, useSearchParams } from "next/navigation";
import {
    FormControl,
    FormErrorIcon,
    FormErrorMessage,
    Input,
    Stack,
} from "@chakra-ui/react";
import { AlertCircle } from "lucide-react";
import { ckMerge } from "@/lib/chakra-merge";
import { AuthActionResponse } from "@refinedev/core/dist/interfaces";
import { PrefetchKind } from "next/dist/client/components/router-reducer/router-reducer-types";
import { ICredentials, ILogin } from "types/auth";
import AuthPage from "../AuthPage";
import { PasswordInput } from "@components/ui/PasswordInput";

const LoginForm = () => {
    const { mutateAsync: login, isLoading } = useLogin<ILogin>({});
    const [errorState, setErrorState] = useState("");
    const [isRedirecting, setIsRedirecting] = useState<boolean>(false);
    const formMethods = useForm<ICredentials["credentials"]>({});
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, touchedFields },
        reset,
    } = formMethods;
    const router = useRouter();
    const params = useSearchParams();
    // let errorParam = params.get("error");
    const callbackUrl = params.get("callbackUrl") ?? "/";

    useEffect(() => {
        if (callbackUrl)
            router.prefetch(callbackUrl, {
                kind: PrefetchKind.AUTO,
            });
    }, []);

    useEffect(() => {
        if (touchedFields.email || touchedFields.password) {
            setErrorState("");
        }
    }, [touchedFields.email, touchedFields.password]);

    const onGoogleLogin = async () => {
        reset(undefined, {
            keepDirtyValues: true,
            keepErrors: false,
        });
        login(
            {
                providerName: "google.com",
                callbackUrl,
            },
            {
                onSuccess(data) {
                    handlePostLogin(data);
                },
            },
        );
    };

    const onCredentialsLogin = async (
        credentials: ICredentials["credentials"],
    ) => {
        await login(
            {
                providerName: "credentials",
                credentials: credentials,
                callbackUrl,
            },
            {
                onSuccess(data) {
                    handlePostLogin(data);
                },
            },
        );
    };

    const handlePostLogin = (data: AuthActionResponse) => {
        const { success, error } = data as AuthActionResponse;
        if (success) {
            setIsRedirecting(true);
            return;
        }
        if (error) {
            setErrorState(`${error?.message}`);
        }
    };
    //todo: have not validate email field
    //todo: have not validate password field

    return (
        <AuthPage title="Đăng nhập vào FusionTech">
            <FormProvider {...formMethods}>
                <div className="w-full md:w-4/5">
                    <Stack gap={4}>
                        <LoginForm.Email />
                        <LoginForm.Password />
                        <div
                            className={`flex gap-2 items-center ${"justify-between"}`}
                        >
                            {!isLoading && errorState && (
                                <p className="flex items-center text-center text-sm font-normal text-red-600">
                                    <AlertCircle
                                        fill="#f02424"
                                        fillOpacity="90%"
                                        className="w-5 text-white mr-1"
                                    />
                                    {errorState}
                                </p>
                            )}
                            <Link
                                href={"/auth/forgot-password"}
                                className="text-zinc-700 text-sm hover:underline underline-offset-2"
                            >
                                Quên mật khẩu?
                            </Link>
                        </div>
                        <button
                            disabled={isLoading}
                            onClick={handleSubmit(onCredentialsLogin)}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg w-full h-12 shadow-sm checked:bg-blue-700"
                        >
                            {isSubmitting || isRedirecting
                                ? "Đang đăng nhập"
                                : "Đăng nhập"}
                        </button>
                        <div className="flex gap-4 items-center">
                            <hr className="flex-grow" />
                            <p className="text-center text-sm">Hoặc</p>
                            <hr className="flex-grow" />
                        </div>
                        <button
                            onClick={onGoogleLogin}
                            className=" bg-white text-zinc-700 px-4 py-2 rounded-lg w-full border border-zinc-200 shadow-sm flex items-center justify-center hover:bg-gray-50"
                        >
                            <FcGoogle className="w-8 h-8 mr-2" />
                            <span>Đăng nhập bằng Google</span>
                        </button>
                        <div className="flex justify-center ">
                            <p>Bạn chưa có tài khoản? </p>
                            <Link
                                href="/register"
                                className="text-red-500 font-semibold ml-2 underline underline-offset-2"
                            >
                                Đăng ký ngay
                            </Link>
                        </div>
                    </Stack>
                </div>
            </FormProvider>
        </AuthPage>
    );
};

const useLoginFormContext = () => {
    return useFormContext<ICredentials["credentials"]>();
};

LoginForm.Email = () => {
    const {
        register,
        formState: { errors },
    } = useLoginFormContext();
    return (
        <FormControl className="" isRequired isInvalid={!!errors.email}>
            <Input
                {...register("email", {
                    required: "Vui lòng nhập địa chỉ email.",
                })}
                type="email"
                placeholder="Nhập địa chỉ email"
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

LoginForm.Password = () => {
    const {
        register,
        formState: { errors },
    } = useLoginFormContext();
    return (
        <FormControl className="" isRequired isInvalid={!!errors.password}>
            <PasswordInput
                {...register("password", {
                    required: "Mật khẩu không được để trống",
                })}
                placeholder="Nhập mật khẩu"
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
export default LoginForm;
