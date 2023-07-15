"use client";
import { LinkBox, LinkBoxProps, LinkOverlay } from "@chakra-ui/react";
import Link from "next/link";
import { ReactNode } from "react";

const NextLinkContainer = ({
    href,
    children,
    containerProps,
}: {
    href: string;
    children: ReactNode;
    containerProps?: LinkBoxProps;
}) => {
    return (
        <LinkBox as="div" {...containerProps}>
            <LinkOverlay as={Link} href={href} />
            {children}
        </LinkBox>
    );
};
export default NextLinkContainer;
