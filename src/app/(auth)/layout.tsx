"use client";
import { Authenticated } from "@refinedev/core";
import { NavigateToResource } from "@refinedev/nextjs-router/app";
import { ReactNode } from "react";

type Props = {
    children: ReactNode;
};

const ProtectedLayout = ({ children }: Props) => {
    return (
        <Authenticated fallback={children}>
            <NavigateToResource />
        </Authenticated>
    );
};
export default ProtectedLayout;
