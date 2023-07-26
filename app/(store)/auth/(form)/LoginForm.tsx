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
    Spinner,
    Stack,
    useBoolean,
} from "@chakra-ui/react";
import { AlertCircle, Loader } from "lucide-react";
import { ckMerge } from "@/lib/chakra-merge";
import { AuthActionResponse } from "@refinedev/core/dist/interfaces";
import { PrefetchKind } from "next/dist/client/components/router-reducer/router-reducer-types";
import { ICredentials } from "types/auth";
import AuthPage from "../AuthPage";
import PasswordInput from "@components/ui/PasswordInput";
import { firebaseAuth } from "@/providers/firebaseAuthProvider";
import { waitPromise } from "@/lib/promise";
import { cn } from "components/lib/utils";
import { useAuthUser } from "@/hooks/useAuth/useAuthUser";
import userAPI from "src/api/userAPI";

const LoginForm = () => {
    const [errorState, setErrorState] = useState("");
    const [isRedirecting, { on: onRedirecting }] = useBoolean();
    const formMethods = useForm<ICredentials["credentials"]>({});
    const {
        handleSubmit,
        formState: { isSubmitting: formSubmitting, touchedFields },
        reset,
        setFocus,
    } = formMethods;
    const router = useRouter();
    const params = useSearchParams();
    const callbackParam = params.get("callbackUrl");
    const callbackUrl = callbackParam ? decodeURIComponent(callbackParam) : "/";
    const isLoading = formSubmitting;
    useEffect(() => {
        if (callbackUrl)
            router.prefetch(callbackUrl, {
                kind: PrefetchKind.AUTO,
            });
    }, []);

    useEffect(() => {
        console.log("touch field effect ran");
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
        console.log(
            "isSubmitting, isLoading, isRedirecting",
            formSubmitting,
            isLoading,
            isRedirecting,
        );

        await waitPromise(0.3 * 1000);
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
            onRedirecting();
            router.push(callbackUrl);
            return;
        }
        if (error) {
            setErrorState(`${error?.message}`);
            reset(undefined, {
                keepValues: true,
                keepTouched: false,
            });
            setFocus("email");
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

                        <div
                            className={`flex ${
                                !errorState ? "justify-end" : ""
                            }`}
                        >
                            {errorState && (
                                <p className="flex flex-grow h-6 sm:items-start items-center text-center text-sm font-normal text-red-600">
                                    <AlertCircle
                                        fill="#f02424"
                                        fillOpacity="90%"
                                        className="w-5 text-white mr-1"
                                    />
                                    {errorState}
                                </p>
                            )}
                            <Link
                                href={{
                                    pathname: "/auth/forgot-password",
                                    query: {
                                        ...(callbackUrl && { callbackUrl }),
                                    },
                                }}
                                className=" text-zinc-700 text-sm hover:underline underline-offset-2 text-end"
                            >
                                Quên mật khẩu?
                            </Link>
                        </div>
                        <button
                            disabled={isLoading || !!errorState}
                            onClick={handleSubmit(onCredentialsLogin)}
                            className={cn(
                                "bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg w-full h-12 shadow-sm",
                                "disabled:cursor-not-allowed",
                            )}
                        >
                            {isLoading || isRedirecting ? (
                                <p className="flex gap-2 justify-center">
                                    Đang đăng nhập <Spinner speed="0.5s" />
                                </p>
                            ) : (
                                "Đăng nhập"
                            )}
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
                                href={{
                                    pathname: "/auth/register",
                                    query: {
                                        ...(callbackUrl && { callbackUrl }),
                                    },
                                }}
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
        setError,
        clearErrors,
        formState: { errors },
    } = useLoginFormContext();

    const onEmailChange = async (email: String) => {

        // Kiểm tra sự tồn tại của email
        const exists = await userAPI.checkExistsByEmail(email);
        console.log(exists);
        if (exists.data == false) {
            setError("email", {
                type: "manual",
                message: "Email không tồn tại.",
            });
            console.log('ko tồn tại')
        } else {
            clearErrors("email");
        }
        
    };
    return (
        <FormControl className="" isRequired isInvalid={!!errors.email}>
            <Input
                {...register("email", {
                    required: "Vui lòng nhập địa chỉ email.",
                    validate:(value) => {
                         onEmailChange(value);
                        return true;
                    },
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
