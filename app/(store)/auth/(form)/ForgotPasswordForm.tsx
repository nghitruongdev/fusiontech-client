import { loginImg } from "@public/assets/images";
import Image from "next/image";
import { useForm } from "react-hook-form";
import {
    Button,
    Flex,
    FormControl,
    FormErrorIcon,
    FormErrorMessage,
    Heading,
    Text,
    Input,
    Stack,
    useColorModeValue,
    useBoolean,
    Box,
} from "@chakra-ui/react";
import Link from "next/link";
import AuthPage from "../AuthPage";
import { firebaseAuth } from "@/providers/firebaseAuthProvider";
const ForgotPasswordForm = () => {
    const [showResult, { on }] = useBoolean();
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<{ email: string }>({});
    const onResetMail = async ({ email }: any) => {
        const result = await firebaseAuth.forgotPassword(email);
        on();
    };
    return (
        <AuthPage
            title={
                <>
                    Đặt lại mật khẩu{" "}
                    {showResult && (
                        <span className="text-green-600">thành công</span>
                    )}
                </>
            }
        >
            {!showResult && (
                <>
                    <Stack align={"center"} spacing={2}>
                        <Text fontSize={"sm"} color={"gray.500"}>
                            Khôi phục mật khẩu sử dụng địa chỉ email đã đăng ký
                            tại FusionTech
                        </Text>
                    </Stack>
                    <Stack
                        spacing={4}
                        direction={{ base: "column", md: "row" }}
                        w={"full"}
                    >
                        <FormControl
                            className="flex gap-2"
                            isRequired
                            isInvalid={!!errors.email}
                            onSubmit={handleSubmit(onResetMail)}
                            as="form"
                        >
                            <Input
                                {...register("email", {
                                    required: "Vui lòng nhập địa chỉ email.",
                                })}
                                type={"email"}
                                placeholder={"Địa chỉ email"}
                                color={useColorModeValue(
                                    "gray.800",
                                    "gray.200",
                                )}
                                bg={useColorModeValue("gray.100", "gray.600")}
                                rounded={"full"}
                                border={0}
                                _focus={{
                                    bg: useColorModeValue(
                                        "gray.200",
                                        "gray.800",
                                    ),
                                    outline: "none",
                                }}
                            />
                            {errors.email?.message && (
                                <FormErrorMessage>
                                    <FormErrorIcon />
                                    {errors.email?.message}
                                </FormErrorMessage>
                            )}

                            <Button
                                type="submit"
                                bg={"blue.400"}
                                rounded={"full"}
                                color={"white"}
                                flex={"1 0 auto"}
                                _hover={{ bg: "blue.500" }}
                                _focus={{ bg: "blue.500" }}
                            >
                                Tiếp tục
                            </Button>
                        </FormControl>
                    </Stack>
                </>
            )}
            {showResult && (
                <>
                    <Stack textAlign="center" align="center">
                        <Box color={"gray.500"}>
                            <p>
                                Email đã được gửi đến{" "}
                                <Text
                                    as="span"
                                    color="gray.700"
                                    fontWeight="semibold"
                                >
                                    {getValues("email")}
                                </Text>
                            </p>
                            <p>
                                Vui lòng kiểm tra email và làm theo hướng dẫn để
                                có thể khôi phục mật khẩu.
                            </p>
                        </Box>
                        <Button
                            as={Link}
                            href="/"
                            variant="solid"
                            colorScheme="blue"
                            mt="2"
                        >
                            Trở lại trang chủ
                        </Button>
                    </Stack>
                </>
            )}
        </AuthPage>
    );
};

const SuccessResult = () => {};
export default ForgotPasswordForm;
