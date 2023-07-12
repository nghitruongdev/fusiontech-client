"use client";
import Image from "next/image";
import { Box, Flex, Stack, useColorModeValue } from "@chakra-ui/react";
import { loginImg } from "@public/assets/images";
import { ErrorBoundary } from "react-error-boundary";

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative">
            <Flex
                align={"center"}
                justify={"center"}
                minH={{ sm: "500px" }}
                py={{ sm: "12" }}
                bg={useColorModeValue("gray.50", "gray.800")}
            >
                <Stack
                    align="center"
                    // w="lg"
                    bg="white"
                    rounded="xl"
                    p={{ base: 4, sm: 8 }}
                >
                    <ErrorBoundary fallback={<>Hello there</>}>
                        {children}
                    </ErrorBoundary>
                </Stack>
            </Flex>
        </div>
    );
}
