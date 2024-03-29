"use client";
import { ReactNode } from "react";
import { Box, Flex, Heading, Icon, Text } from "@chakra-ui/react";

import { ShieldCloseIcon } from "lucide-react";
import { AppError } from "types/error";
type Props = {
    children: ReactNode;
};

export default function AuthErrorCatch({
    error,
}: {
    error: Error | AppError;
    reset?: () => void;
}) {
    return (
        <Box textAlign="center" py={10} px={6}>
            <Box display="inline-block">
                <Flex
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    bg={"red.500"}
                    rounded={"50px"}
                    w={"55px"}
                    h={"55px"}
                    textAlign="center"
                >
                    <Icon
                        as={ShieldCloseIcon}
                        boxSize={"20px"}
                        color={"white"}
                    />
                </Flex>
            </Box>
            <Heading as="h2" size="xl" mt={6} mb={2}>
                {error.name}
            </Heading>
            <Text color={"gray.500"}>{error.message}</Text>
        </Box>
    );
}
