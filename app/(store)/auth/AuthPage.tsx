import { Heading, useColorModeValue } from "@chakra-ui/react";
import { PropsWithChildren, ReactNode, Suspense } from "react";

type Props = PropsWithChildren<{ title: string | ReactNode }>;
const AuthPage = ({ children, title }: Props) => {
    return (
        <>
            <Heading
                fontSize={"2xl"}
                color={useColorModeValue("gray.800", "gray.200")}
                textAlign="center"
            >
                {title}
            </Heading>
            {children}
        </>
    );
};
export default AuthPage;
