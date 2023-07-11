"use client";
import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    useBoolean,
} from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useTranslate, useUpdatePassword } from "@refinedev/core";
import { firebaseAuth } from "../../../../src/lib/firebase";
import { AuthError, verifyPasswordResetCode } from "firebase/auth";
import { useEffect } from "react";
import { firebaseAuthProvider } from "@/providers/firebaseAuthProvider";
import { signOut } from "next-auth/react";
import Link from "next/link";

type PasswordForm = {
    password: string;
    confirmPassword: string;
};
const UpdatePasswordPage = () => {
    const params = useSearchParams();
    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm<PasswordForm>({});

    const translate = useTranslate();

    const mode = params.get("mode");
    const actionCode = params.get("oobCode");
    const continueUrl = params.get("continueUrl");
    const lang = params.get("lang") || "en";
    const router = useRouter();
    const auth = firebaseAuth;
    const [showError, { on: showErrorOn }] = useBoolean();
    const [showSuccess, { on: showSuccessOn }] = useBoolean();

    // Handle the user management action.

    // function handleResetPassword(auth, actionCode, continueUrl, lang) {}
    //todo: if not auth or no action code, redirect to the home page
    if (!!!actionCode || !!!mode) {
        router.replace("/");
        return;
    }

    useEffect(() => {
        const verifyAction = async () => {
            try {
                const result = await verifyPasswordResetCode(auth, actionCode);
                //show the login form
            } catch (error) {
                console.log("error", error);
                showErrorOn();
                // throw error;
            }
        };
        verifyAction();
    }, []);

    const submitHandler = async (data: PasswordForm) => {
        console.log("data", data);
        const result = await firebaseAuthProvider().updatePassword?.({
            type: "reset",
            actionCode: actionCode,
            password: data.password,
        });

        if (result?.success) {
            showSuccessOn();
        }

        console.log("update result", result);
    };

    if (showError)
        return (
            <>
                Yêu cầu không hợp lệ hoặc đã hết hạn. Vui lòng tạo lại yêu cầu
                mới.
            </>
        );
    if (showSuccess) {
        return (
            <>
                Đã cập nhật mật khẩu mới thành công. Bây giờ bạn có thể sử dụng
                mật khẩu mới để đăng nhập.
                <Link href="/auth/login">Quay trở lại đăng nhập</Link>
            </>
        );
    }
    return (
        <>
            <form onSubmit={handleSubmit(submitHandler)}>
                <FormControl mb="3" isInvalid={!!errors?.password}>
                    <FormLabel htmlFor="password">
                        {translate(
                            "pages.updatePassword.fields.password",
                            "New Password",
                        )}
                    </FormLabel>
                    <Input
                        id="password"
                        type="password"
                        placeholder="Password"
                        {...register("password", {
                            required: true,
                        })}
                    />
                    <FormErrorMessage>
                        {`${errors.password?.message}`}
                    </FormErrorMessage>
                </FormControl>

                <FormControl mb="3" isInvalid={!!errors?.confirmPassword}>
                    <FormLabel htmlFor="confirmPassword">
                        {translate(
                            "pages.updatePassword.fields.confirmPassword",
                            "Confirm New Password",
                        )}
                    </FormLabel>
                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        {...register("confirmPassword", {
                            required: true,
                            validate: (val: any) => {
                                if (watch("password") != val) {
                                    return translate(
                                        "pages.updatePassword.errors.confirmPasswordNotMatch",
                                        "Passwords do not match",
                                    );
                                }
                                return;
                            },
                        })}
                    />
                    <FormErrorMessage>
                        {`${errors.confirmPassword?.message}`}
                    </FormErrorMessage>
                </FormControl>

                <Button mt="6" type="submit" width="full" colorScheme="brand">
                    {translate("pages.updatePassword.buttons.submit", "Update")}
                </Button>
            </form>
        </>
    );
};
export default UpdatePasswordPage;
