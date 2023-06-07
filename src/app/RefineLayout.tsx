"use client";

import { authProvider } from "@/authProvider";
import { API_URL } from "@/constants";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { Refine } from "@refinedev/core";
import dataProvider from "@refinedev/simple-rest";
import routerProvider from "@refinedev/nextjs-router/app";
import { ReactNode } from "react";
import {
    RefineThemes,
    notificationProvider,
    refineTheme,
} from "@refinedev/chakra-ui";
import { appWithTranslation, useTranslation } from "next-i18next";

type Props = {
    children: ReactNode;
};

const RefineLayout = ({ children }: Props) => {
    const { t, i18n } = useTranslation();
    const i18nProvider = {
        translate: (key: string, params: object) => t(key, params),
        changeLocale: (lang: string) => i18n.changeLanguage(lang),
        getLocale: () => i18n.language,
    };
    return (
        <ChakraProvider theme={RefineThemes.Purple}>
            <ColorModeScript
                initialColorMode={refineTheme.config.initialColorMode}
            />
            <Refine
                dataProvider={dataProvider(API_URL)}
                authProvider={authProvider}
                routerProvider={routerProvider}
                notificationProvider={notificationProvider}
                i18nProvider={i18nProvider}
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
export default RefineLayout;
