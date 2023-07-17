"use client";

import { springDataProvider } from "@/providers/rest-data-provider";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import {
    RefineThemes,
    ThemedLayoutV2,
    notificationProvider,
    refineTheme,
} from "@refinedev/chakra-ui";
import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/nextjs-router/app";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <ChakraProvider theme={RefineThemes.Blue}>
            <ColorModeScript
                initialColorMode={refineTheme.config.initialColorMode}
            />
            <Refine
                dataProvider={springDataProvider}
                // authProvider={authProvider({ session, status })}
                routerProvider={routerProvider}
                notificationProvider={notificationProvider}
                // i18nProvider={i18nProvider}
                options={{
                    syncWithLocation: true,
                    warnWhenUnsavedChanges: true,
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
            </Refine>
        </ChakraProvider>
    );
}
