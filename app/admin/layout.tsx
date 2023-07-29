"use client";

import { firestoreProvider } from "@/lib/firebase";
import { springDataProvider } from "@/providers/rest-data-provider";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { Breadcrumb } from "@components/breadcrumb";
import {
    RefineThemes,
    ThemedLayoutV2,
    notificationProvider,
    refineTheme,
} from "@refinedev/chakra-ui";
import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/nextjs-router/app";
import dynamic from "next/dynamic";

const DynamicDialogProvider = dynamic(
    () => import("@components/ui/DialogProvider"),
    { ssr: false },
);
export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <ChakraProvider theme={RefineThemes.Blue}>
            <ColorModeScript
                initialColorMode={refineTheme.config.initialColorMode}
            />
            <Refine
                dataProvider={{
                    default: springDataProvider,
                    firestore: firestoreProvider,
                }}
                // authProvider={authProvider({ session, status })}
                routerProvider={routerProvider}
                notificationProvider={notificationProvider}
                // i18nProvider={i18nProvider}
                options={{
                    syncWithLocation: true,
                    warnWhenUnsavedChanges: true,
                    mutationMode: "optimistic",
                    textTransformers: {
                        plural: (word) => word,
                        singular: (word) => word,
                        humanize: (word) => word,
                    },
                    disableTelemetry: true,
                    breadcrumb: <Breadcrumb />,
                }}
                resources={[
                    {
                        name: "categories",
                        list: "/admin/categories",
                        create: "/admin/categories/create",
                        edit: "/admin/categories/edit/:id",
                        show: "/admin/categories/show/:id",
                        meta: {
                            canDelete: true,
                            label: "Danh Mục",
                        },
                    },
                    {
                        name: "products",
                        list: "/admin/products",
                        create: "/admin/products/create",
                        edit: "/admin/products/edit/:id",
                        show: "/admin/products/show/:id",
                        meta: {
                            canDelete: false,
                            label: "Sản Phẩm",
                        },
                    },
                    {
                        name: "variants",
                        list: "/admin/variants",
                        create: "/admin/products/show/:id/variants/create",
                        edit: "/admin/variants/edit/:id",
                        show: "/admin/variants/show/:id",
                        meta: {
                            canDelete: false,
                        },
                    },
                    {
                        name: "orders",
                        list: "/admin/orders",
                        // create: "/admin/or/create",
                        // edit: "/admin/products/edit/:id",
                        show: "/admin/orders/show/:id",
                        meta: {
                            canDelete: false,
                        },
                    },
                    {
                        name: "inventories",
                        list: "/admin/inventories",
                        create: "/admin/inventories/create",
                        // edit: "/admin/inventories/edit/:id",
                        show: "/admin/inventories/show/:id",
                        meta: {
                            canDelete: false,
                        },
                    },
                    {
                        name: "inventory-details",
                        // list: "/admin/inventories",
                        // create: "/admin/inventories/create",
                        edit: "/admin/inventories/edit/:id",
                        // show: "/admin/inventories/show/:id",
                        meta: {
                            canDelete: false,
                        },
                    },
                ]}
            >
                <ThemedLayoutV2>{children}</ThemedLayoutV2>;
                <DynamicDialogProvider />;
            </Refine>
        </ChakraProvider>
    );
}
