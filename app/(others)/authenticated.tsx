/** @format */

'use-client'

import { useAuthStore } from '@/hooks/useAuth/useAuthUser'
import { suspensePromiseWithCleanup, waitPromise } from '@/lib/promise'
import LoadingOverlay from '@components/ui/LoadingOverlay'
import { useRouter } from 'next/navigation'
import { PropsWithChildren, Suspense, use, useEffect, useState } from 'react'

const AuthenticatedPage = ({
  children,
  redirect = '/auth/login',
  ...props
}: PropsWithChildren<{ redirect?: string }>) => {
  const [hasHydrated, user] = useAuthStore((state) => [
    state._hasHydrated,
    state.user,
  ])
  const router = useRouter()
  const [promise, setPromise] = useState<Promise<unknown>>(waitPromise(500))

  useEffect(() => {
    const [suspense, cleanup] = suspensePromiseWithCleanup(hasHydrated)
    setPromise(suspense)
    return () => {
      cleanup?.()
    }
  }, [hasHydrated])

  useEffect(() => {
    router.prefetch(redirect)
  }, [router, redirect])

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
  promise: promiseProps,
}: {
  redirect: string
  promise: Promise<unknown>
}) => {
  const [, user] = useAuthStore((state) => [state._hasHydrated, state.user])
  const [promise, setPromise] = useState<Promise<unknown>>(promiseProps)
  const router = useRouter()
  use(promise)

  useEffect(() => {
    const [suspense, cleanup] = suspensePromiseWithCleanup(false)
    if (!user) {
      setPromise(suspense)
      router.push(redirect, {
        scroll: true,
      })
    }
    return cleanup
  }, [router, redirect, user])
  return <></>
}
export default AuthenticatedPage
