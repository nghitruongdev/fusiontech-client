'use client'

import { firestoreProvider } from '@/lib/firebase'
import { firebaseAuth } from '@/providers/firebaseAuthProvider'
import { springDataProvider } from '@/providers/rest-data-provider'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { Breadcrumb } from '@components/breadcrumb'
import { ThemedLayoutV2 } from '@components/themedLayout'
import {
    RefineThemes,
    notificationProvider,
    refineTheme,
} from '@refinedev/chakra-ui'
import { Refine } from '@refinedev/core'
import routerProvider from '@refinedev/nextjs-router/app'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

const DynamicDialogProvider = dynamic(
    () => import('@components/ui/DialogProvider'),
    { ssr: false },
)
export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    return (
        <ChakraProvider theme={RefineThemes.Blue}>
            <ColorModeScript initialColorMode={refineTheme.config.initialColorMode} />
            <Refine
                authProvider={firebaseAuth.authProvider(router)}
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
                    mutationMode: 'optimistic',
                    textTransformers: {
                        plural: (word) => word,
                        singular: (word) => word,
                        humanize: (word) => word,
                    },
                    disableTelemetry: true,
                    breadcrumb: <Breadcrumb />,
                    redirect: {
                        afterCreate: 'show',
                        afterEdit: 'show',
                    },
                }}
                resources={[
                    {
                        name: 'categories',
                        list: '/admin/categories',
                        create: '/admin/categories/create',
                        edit: '/admin/categories/edit/:id',
                        show: '/admin/categories/show/:id',
                        meta: {
                            canDelete: true,
                            label: 'Danh mục sản phẩm',
                        },
                    },
                    {
                        name: 'brands',
                        list: '/admin/brands',
                        create: '/admin/brands/create',
                        edit: '/admin/brands/edit/:id',
                        show: '/admin/brands/show/:id',
                        meta: {
                            canDelete: true,
                            label: 'Thương hiệu',
                            onDeleteSuccess: (value: any) => {
                                console.log('deleted', value)
                            }
                        },
                    },
                    {
                        name: 'products',
                        list: '/admin/products',
                        create: '/admin/products/create',
                        edit: '/admin/products/edit/:id',
                        show: '/admin/products/show/:id',
                        meta: {
                            canDelete: false,
                            label: 'Sản phẩm',
                        },
                    },
                    {
                        name: 'variants',
                        list: '/admin/variants',
                        create: '/admin/products/show/:id/variants/create',
                        edit: '/admin/variants/edit/:id',
                        show: '/admin/variants/show/:id',
                        meta: {
                            canDelete: false,
                            label: 'Biến thể sản phẩm',
                        },
                    },
                    {
                        name: 'orders',
                        list: '/admin/orders',
                        // create: "/admin/or/create",
                        // edit: "/admin/products/edit/:id",
                        show: '/admin/orders/show/:id',
                        meta: {
                            canDelete: false,
                            label: 'Đơn hàng',
                        },
                    },
                    {
                        name: 'inventories',
                        list: '/admin/inventories',
                        create: '/admin/inventories/create',
                        // edit: "/admin/inventories/edit/:id",
                        show: '/admin/inventories/show/:id',
                        meta: {
                            canDelete: false,
                            label: 'Kho hàng',
                        },
                    },
                    {
                        name: 'inventory-details',
                        // list: "/admin/inventories",
                        // create: "/admin/inventories/create",
                        edit: '/admin/inventories/edit/:id',
                        // show: "/admin/inventories/show/:id",
                        meta: {
                            canDelete: false,
                            label: 'Chi tiết kho hàng',
                        },
                    },
                    {
                        name: 'users',
                        meta: {
                            label: 'Quản lý người dùng',
                        },
                    },
                    {
                        name: 'users',
                        identifier: 'user-staff',
                        list: '/admin/users?staff=true',
                        create: '/admin/users/create',
                        edit: '/admin/users/edit/:id',
                        show: '/admin/users/show/:id',
                        meta: {
                            label: 'Nhân viên',
                            parent: 'users',
                            canDelete: false,
                        },
                    },
                    {
                        name: 'users',
                        identifier: 'user-customer',
                        list: '/admin/users',
                        create: '/admin/users/create',
                        edit: '/admin/users/edit/:id',
                        show: '/admin/users/show/:id',
                        meta: {
                            label: 'Khách hàng',
                            parent: 'users',
                            canDelete: false,
                        },
                    },
                ]}
            >
                <ThemedLayoutV2>{children}</ThemedLayoutV2>
                <DynamicDialogProvider />
            </Refine>
        </ChakraProvider>
    )
}
