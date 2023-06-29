"use client";
import { authProvider } from "@/providers/authProvider";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/nextjs-router/app";
import { useSession } from "next-auth/react";
import {
    RefineThemes,
    notificationProvider,
    refineTheme,
} from "@refinedev/chakra-ui";
import { dataProvider } from "@/rest-data-provider";

const RefineProvider = ({ children }: { children: React.ReactNode }) => {
    const { data: session, status, update } = useSession();

    return (
        <ChakraProvider theme={RefineThemes.Blue}>
            <ColorModeScript
                initialColorMode={refineTheme.config.initialColorMode}
            />
            <Refine
                dataProvider={dataProvider}
                authProvider={authProvider({ session, status })}
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
