"use client";
import { authProvider } from "@/providers/authProvider";
import { API_URL } from "@/constants";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { Refine } from "@refinedev/core";
import dataProvider from "@refinedev/simple-rest";
import routerProvider from "@refinedev/nextjs-router/app";
import { useSession } from "next-auth/react";
import {
    RefineThemes,
    notificationProvider,
    refineTheme,
} from "@refinedev/chakra-ui";

const RefineProvider = ({ children }: { children: React.ReactNode }) => {
    // const { t, i18n } = useTranslation();
    // const i18nProvider = {
    //     translate: (key: string, params: object) => t(key, params),
    //     changeLocale: (lang: string) => i18n.changeLanguage(lang),
    //     getLocale: () => i18n.language,
    // };
    const { data: session, status, update } = useSession();
    return (
        <ChakraProvider theme={RefineThemes.Blue}>
            <ColorModeScript
                initialColorMode={refineTheme.config.initialColorMode}
            />
            <Refine
                dataProvider={dataProvider(API_URL)}
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
