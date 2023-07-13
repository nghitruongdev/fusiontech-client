"use client";
import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Box,
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
import { ICredentials } from "types/auth";
import AuthPage from "../AuthPage";
import PasswordInput from "@components/ui/PasswordInput";
import { firebaseAuth } from "@/providers/firebaseAuthProvider";

const LoginForm = () => {
    const [errorState, setErrorState] = useState("");
    const [isRedirecting, setIsRedirecting] = useState<boolean>(false);
    const formMethods = useForm<ICredentials["credentials"]>({});
    const {
        handleSubmit,
        formState: { isSubmitting, touchedFields },
        reset,
    } = formMethods;
    const router = useRouter();
    const params = useSearchParams();
    const callbackUrl = params.get("callbackUrl") ?? "/";
    const isLoading = isSubmitting;
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
            keepValues: true,
            keepIsValid: true,
            keepErrors: false,
        });
        const result = await firebaseAuth.login({
            providerName: "google.com",
        });
        handlePostLogin(result);
    };

    const onCredentialsLogin = async (
        credentials: ICredentials["credentials"],
    ) => {
        reset(undefined, {
            keepDirtyValues: true,
            keepValues: true,
            keepIsValid: true,
            keepErrors: false,
            keepTouched: false,
        });
        const result = await firebaseAuth.login({
            providerName: "credentials",
            credentials: credentials,
        });
        handlePostLogin(result);
    };

    const handlePostLogin = (data: AuthActionResponse) => {
        console.log("data", data);
        const { success, error } = data as AuthActionResponse;
        if (success) {
            setIsRedirecting(true);
            router.push(callbackUrl);
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
                <div className="w-full sm:w-4/5">
                    <Stack gap={4}>
                        <form className="grid gap-4">
                            <LoginForm.Email />
                            <LoginForm.Password />
                        </form>

                        <div className={`grid gap-2`}>
                            {!isLoading && errorState && (
                                <p className="flex sm:items-start items-center text-center text-sm font-normal text-red-600">
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
                                className="text-zinc-700 text-sm hover:underline underline-offset-2 text-end"
                            >
                                Quên mật khẩu?
                            </Link>
                        </div>
                        <button
                            disabled={isLoading}
                            onClick={handleSubmit(onCredentialsLogin)}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg w-full h-12 shadow-sm checked:bg-blue-700"
                        >
                            {isLoading || isRedirecting
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
export default LoginForm;
