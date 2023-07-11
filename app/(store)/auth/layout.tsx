"use client";
import { ReactNode } from "react";
import Image from "next/image";
import { Flex, Stack, useColorModeValue } from "@chakra-ui/react";
import { loginImg } from "@public/assets/images";
type Props = {
    children: ReactNode;
};

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <div className="relative">
                <Flex
                    align={"center"}
                    justify={"center"}
                    minH={"500px"}
                    py={12}
                    bg={useColorModeValue("gray.50", "gray.800")}
                >
                    <Stack
                        align="center"
                        bg="white"
                        width="lg"
                        rounded="xl"
                        spacing={2}
                        p={8}
                    >
                        <Image src={loginImg} alt="Login icon" width="150" />
                        <>{children}</>
                    </Stack>
                </Flex>
            </div>
        </>
    );
}

// export const getServerSideProps = async (context) => {
// We've handled the SSR case in our `check` function by sending the `context` as parameter.
//     const { authenticated, redirectTo } = await authProvider.check(context);

//     if (!authenticated) {
//         context.res.statusCode = 401;
//         context.res.end();
//     }

//     if (!authenticated && redirectTo) {
//         return {
//             redirect: {
//                 destination: redirectTo,
//                 permanent: false,
//             },
//         };
//     }

//     return {
//         props: {
//             authenticated,
//         },
//     };
// };
