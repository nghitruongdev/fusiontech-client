/** @format */

'use-client'

import { useAuthStore } from '@/hooks/useAuth/useAuthUser'
import { suspensePromiseWithCleanup, waitPromise } from '@/lib/promise'
import LoadingOverlay from '@components/ui/LoadingOverlay'
import { useRouter } from 'next/navigation'
import {
  PropsWithChildren,
  Suspense,
  use,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { ROLES } from 'types'

const AuthenticatedPage = ({
  children,
  redirect = '/auth/login',
  permissions,
  ...props
}: PropsWithChildren<{ redirect?: string; permissions?: ROLES[] }>) => {
  const [hydrated, user, roles, permissionHydrated] = useAuthStore((state) => [
    state._hasHydrated,
    state.user,
    state.claims?.roles,
    state._hasPermissionHydrated,
  ])
  const router = useRouter()
  const [promise, setPromise] = useState<Promise<unknown>>(waitPromise(500))

  const setSuspensePromise = useCallback((condition?: boolean) => {
    const [suspense, cleanup] = suspensePromiseWithCleanup(condition)
    setPromise(suspense)
    return cleanup
  }, [])

  useEffect(() => {
    if (!hydrated) return setSuspensePromise(hydrated)
    if (hydrated && permissions && !permissionHydrated)
      return setSuspensePromise(permissionHydrated)
  }, [setSuspensePromise, hydrated, permissions, permissionHydrated])

  useEffect(() => {
    if (!hydrated) return
    if (!user) {
      router.push(redirect, {
        scroll: true,
      })
      return setSuspensePromise(false)
    }
    if (!permissions || !permissionHydrated) return

    const checkRole = () => {
      const rolesEnum = roles?.map(
        (role) => ROLES[role.toUpperCase() as keyof typeof ROLES],
      )
      const result = permissions.some(
        (p) => rolesEnum?.some((role) => role === p) ?? false,
      )
      if (!result) {
        const result = setSuspensePromise(false)
        router.replace('/unauthorized')
        return result
      }
    }
    checkRole()
  }, [
    router,
    redirect,
    user,
    hydrated,
    permissions,
    roles,
    permissionHydrated,
    setSuspensePromise,
  ])

  return (
    <Suspense
      fallback={<LoadingOverlay className='bg-white pointer-events-none' />}>
      <AuthSuspense
        {...props}
        redirect={redirect}
        promise={promise}
      />
      {children}
    </Suspense>
  )
}
const AuthSuspense = ({
  redirect,
  promise,
}: {
  redirect: string
  promise: Promise<unknown>
  permissions?: ROLES[]
}) => {
  //   use(promise)
  return <></>
}
export default AuthenticatedPage
