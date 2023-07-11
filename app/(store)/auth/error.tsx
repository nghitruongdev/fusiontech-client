"use client";
import { ReactNode } from "react";
import { Box, Flex, Heading, Icon, Text } from "@chakra-ui/react";

import Error from "next/error";
import { ShieldCloseIcon } from "lucide-react";
type Props = {
    children: ReactNode;
};

export default function ErrorBondary({
    error,
}: {
    error: Error;
    reset: () => void;
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
                    {/* <ShieldCloseIcon  /> */}
                </Flex>
            </Box>
            <Heading as="h2" size="xl" mt={6} mb={2}>
                This is the headline
            </Heading>
            <Text color={"gray.500"}>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                diam nonumy eirmod tempor invidunt ut labore et dolore magna
                aliquyam erat, sed diam voluptua.
            </Text>
        </Box>
    );
}
