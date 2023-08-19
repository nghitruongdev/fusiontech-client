/** @format */

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
import { Refine, useCustom } from '@refinedev/core'
import routerProvider from '@refinedev/nextjs-router/app'
import AuthenticatedPage from 'app/(others)/authenticated'
import { BarChart3, UserCircle, Users } from 'lucide-react'
import { Cpu, LucideLaptop2, MemoryStick, ShoppingCart } from 'lucide-react'
import { Warehouse } from 'lucide-react'
import { Monitor, Ticket } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { ROLES } from 'types'

const DynamicDialogProvider = dynamic(
  () => import('@components/ui/DialogProvider'),
  { ssr: false },
)
export default function LayoutPage({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthenticatedPage
      redirect={`/auth/login?callbackUrl=/admin`}
      permissions={[ROLES.STAFF]}>
      <Layout>{children}</Layout>
    </AuthenticatedPage>
  )
}

function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  return (
    <div className='font-roboto'>
      <ChakraProvider theme={RefineThemes.Blue}>
        <ColorModeScript
          initialColorMode={refineTheme.config.initialColorMode}
        />
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
            mutationMode: 'pessimistic',
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
                icon: <MemoryStick size={18} />,
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
                icon: <LucideLaptop2 size={18} />,
              },
            },
            {
              name: 'vouchers',
              list: '/admin/vouchers',
              create: '/admin/vouchers/create',
              edit: '/admin/vouchers/edit/:id',
              show: '/admin/vouchers/show/:id',
              meta: {
                canDelete: true,
                label: 'Mã giảm giá',
                icon: <Ticket size={18} />,
              },
            },
            {
              name: 'products',
              list: '/admin/products',
              create: '/admin/products/create',
              edit: '/admin/products/edit/:id',
              show: '/admin/products/show/:id',
              meta: {
                label: 'Sản phẩm',
                icon: <Cpu size={18} />,
              },
            },
            {
              name: 'variants',
              list: '/admin/variants',
              create: '/admin/variants/create',
              edit: '/admin/variants/edit/:id',
              show: '/admin/variants/show/:id',
              meta: {
                label: 'Biến thể sản phẩm',
                icon: <Monitor size={18} />,
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
                icon: <ShoppingCart size={18} />,
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
                icon: <Warehouse size={18} />,
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
              name: 'stat',
              list: '/admin/stat',
              // create: '/admin/categories/create',
              // edit: '/admin/categories/edit/:id',
              // show: '/admin/categories/show/:id',
              meta: {
                canDelete: true,
                label: 'Thống kê',
                icon: <BarChart3 size={18} />,
              },
            },
            {
              name: 'users',
              meta: {
                label: 'Quản lý người dùng',
                icon: <UserCircle size={18} />,
              },
            },
            {
              name: 'users',
              identifier: 'user-staff',
              list: '/admin/users',
              create: '/admin/users/create',
              edit: '/admin/users/edit/:id',
              show: '/admin/users/show/:id',
              meta: {
                label: 'Nhân viên',
                parent: 'users',
                canDelete: false,
                icon: <Users size={18} />,
              },
            },
            {
              name: 'users',
              identifier: 'user-customer',
              list: '/admin/users/customers',
              show: '/admin/users/customers/show/:id',
              meta: {
                label: 'Khách hàng',
                icon: <UserCircle size={18} />,
                parent: 'users',
                canDelete: false,
              },
            },
          ]}>
          <ThemedLayoutV2>{children}</ThemedLayoutV2>
          <DynamicDialogProvider />
        </Refine>
      </ChakraProvider>
    </div>
  )
}
