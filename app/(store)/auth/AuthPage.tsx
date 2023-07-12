"use client";
import { Heading, Stack, useColorModeValue } from "@chakra-ui/react";
import { PropsWithChildren, ReactNode, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Image from "next/image";
import { loginImg } from "@public/assets/images";
type Props = PropsWithChildren<{ title: string | ReactNode }>;
const AuthPage = ({ children, title }: Props) => {
    return (
        <Stack w="lg" spacing={2} align={"center"}>
            <>
                <Image src={loginImg} alt="Login icon" width="150" />
                <Heading
                    fontSize={"2xl"}
                    color={useColorModeValue("gray.800", "gray.200")}
                    textAlign="center"
                >
                    {title}
                </Heading>
                {children}
            </>
        </Stack>
    );
};
export default AuthPage;
