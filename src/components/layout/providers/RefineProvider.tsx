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
import { springDataProvider } from "@/providers/rest-data-provider";
import dynamic from "next/dynamic";
import { QueryClient } from "@tanstack/react-query";
import { firestoreProvider } from "@/lib/firebase";
import { firebaseAuthProvider } from "@/providers/firebaseAuthProvider";
import { useRouter } from "next/navigation";

const DynamicColorScript = dynamic(
    () => import("@chakra-ui/react").then((mod) => mod.ColorModeScript),
    {
        ssr: false,
    },
);
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            suspense: true,
        },
    },
});
const RefineProvider = ({ children }: { children: React.ReactNode }) => {
    const { data: session, status, update } = useSession();
    const router = useRouter();
    console.count("Refine Provider rendered");
    return (
        <ChakraProvider theme={RefineThemes.Blue}>
            <DynamicColorScript
                initialColorMode={refineTheme.config.initialColorMode}
            />
            <Refine
                dataProvider={{
                    default: springDataProvider,
                    firestore: firestoreProvider,
                }}
                authProvider={firebaseAuthProvider(router)}
                // authProvider={authProvider({ session, status })}
                routerProvider={routerProvider}
                notificationProvider={notificationProvider}
                // i18nProvider={i18nProvider}
                options={{
                    syncWithLocation: true,
                    warnWhenUnsavedChanges: true,
                    // reactQuery: {
                    //     clientConfig: queryClient,
                    // },
                }}
            >
                {children}
            </Refine>
        </ChakraProvider>
    );
};

export default RefineProvider;
