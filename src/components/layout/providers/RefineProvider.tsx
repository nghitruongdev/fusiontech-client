"use client";
import { ChakraProvider } from "@chakra-ui/react";
import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/nextjs-router/app";
import { useSession } from "next-auth/react";
import {
    RefineThemes,
    notificationProvider,
    refineTheme,
} from "@refinedev/chakra-ui";
import { dataProvider } from "@/providers/rest-data-provider";
import dynamic from "next/dynamic";

const RefineProvider = ({ children }: { children: React.ReactNode }) => {
    const { data: session, status, update } = useSession();
    const DynamicColorScript = dynamic(
        () => import("@chakra-ui/react").then((mod) => mod.ColorModeScript),
        {
            ssr: false,
        },
    );
    return (
        <ChakraProvider theme={RefineThemes.Blue}>
            <DynamicColorScript
                initialColorMode={refineTheme.config.initialColorMode}
            />
            <Refine
                dataProvider={dataProvider}
                // authProvider={authProvider({ session, status })}
                routerProvider={routerProvider}
                notificationProvider={notificationProvider}
                // i18nProvider={i18nProvider}
                options={{
                    syncWithLocation: true,
                    warnWhenUnsavedChanges: true,
                }}
            >
                {children}
            </Refine>
        </ChakraProvider>
    );
};

export default RefineProvider;
