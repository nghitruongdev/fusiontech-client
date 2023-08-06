/** @format */

'use client'
import { ChakraProvider } from '@chakra-ui/react'
import { Refine } from '@refinedev/core'
import routerProvider from '@refinedev/nextjs-router/app'
import {
  RefineThemes,
  notificationProvider,
  refineTheme,
} from '@refinedev/chakra-ui'
import { springDataProvider } from '@/providers/rest-data-provider'
import dynamic from 'next/dynamic'
import { QueryClient } from '@tanstack/react-query'
import { firestoreProvider } from '@/lib/firebase'
import { firebaseAuth } from '@/providers/firebaseAuthProvider'
import { useRouter } from 'next/navigation'
import CartProvider from './CartProvider'

const DynamicColorScript = dynamic(
  () => import('@chakra-ui/react').then((mod) => mod.ColorModeScript),
  {
    ssr: false,
  },
)
const DynamicDialogProvider = dynamic(
  () => import('@components/ui/DialogProvider'),
  { ssr: false },
)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
    },
  },
})

const DynamicFavoriteProvider = dynamic(
  () => import('@/hooks/useFavorite').then((mod) => mod.FavoriteProvider),
  {
    ssr: false,
  },
)
const DynamicRecentProductProvider = dynamic(
  () => import('./RecentProductViewProvider'),
  {
    ssr: false,
  },
)

const RefineProvider = ({ children }: { children: React.ReactNode }) => {
  // const { data: session, status, update } = useSession();
  const router = useRouter()
  console.count('Refine Provider rendered')
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
        authProvider={firebaseAuth.authProvider(router)}
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
        }}>
        {children}
        <CartProvider />
      </Refine>
      <DynamicDialogProvider />
      <DynamicFavoriteProvider />
      <DynamicRecentProductProvider />
    </ChakraProvider>
  )
}

export default RefineProvider
