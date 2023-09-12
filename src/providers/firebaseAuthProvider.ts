/** @format */

import { AuthBindings } from '@refinedev/core'
import {
  signInWithPopup,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  GoogleAuthProvider,
  browserLocalPersistence,
  confirmPasswordReset,
  getAuth,
  UserCredential,
  AuthError,
  signInWithCustomToken,
  getAdditionalUserInfo,
} from 'firebase/auth'
import {
  AuthActionResponse,
  CheckResponse,
  HttpError,
  OnErrorResponse,
} from '@refinedev/core/dist/interfaces'
import { useSsr } from 'usehooks-ts'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context'
import { IAuthProvider, ILogin, IRegister, IUpdatePassword } from 'types/auth'
import { getServerSession } from '@/lib/server'
import { firebaseApp } from '@/lib/firebase'
import { API_URL } from 'types/constants'
import { springDataProvider } from './rest-data-provider'
import { AppError } from 'types/error'
import {
  authStore,
  setIsNewUser,
  useAuthStore,
} from '@/hooks/useAuth/useAuthUser'
import { ROLES } from 'types'
import { suspensePromiseWithCleanup } from '@/lib/promise'
// import { suspensePromise } from '@/lib/promise'

const auth = getAuth(firebaseApp)
const googleProvider = new GoogleAuthProvider()
auth.setPersistence(browserLocalPersistence)
auth.useDeviceLanguage()

const authAPI = {
  registerGoogle: (firebaseId: string) =>
    `auth/register/google?firebaseId=${firebaseId}`,
  registerWithEmail: `auth/register`,
}
const login = async (props: ILogin): Promise<AuthActionResponse> => {
  const { providerName, callbackUrl } = props
  let result: UserCredential
  try {
    switch (providerName) {
      case 'google.com':
        result = await signInWithPopup(auth, googleProvider.addScope('profile'))
        await handleGooglePostLogin(result)
        break
      case 'credentials': {
        const { email, password } = props.credentials
        try {
          result = await signInWithEmailAndPassword(auth, email, password)
        } catch (err) {
          throw new Error('Email hoặc mật khẩu không trùng khớp.')
        }
        break
      }
    }
    return {
      success: true,
      redirectTo: callbackUrl ?? '/',
    }
  } catch (err) {
    const error = err as AuthError
    console.error(error.code)
    if (error.message.includes('auth/popup-closed-by-user'))
      return {
        success: false,
      }
    return {
      success: false,
      error: error,
    }
  }
}

const handleGooglePostLogin = (userCred: UserCredential) => {
  const infos = getAdditionalUserInfo(userCred)
  const { user } = userCred
  if (infos?.isNewUser) {
    setIsNewUser(infos.isNewUser)
    console.debug('Register new google user with back-end server')
    return firebaseAuth.register({
      providerName: 'google.com',
      firebaseId: user.uid,
    })
    //         //todo: if success, set custom token to user
    //         //todo: if fail, and user do not have account in database before -> delete user from firebase
  }
}

const check = async (): Promise<CheckResponse> => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const ssr = useSsr()
  console.log('ssr', ssr)

  if (ssr.isServer) {
    const result = await getServerSession()
    console.log('result', result)
    return {
      authenticated: true,
    }
  }

  const user = auth.currentUser
  if (user) {
    return {
      authenticated: true,
    }
  }
  return {
    authenticated: false,
  }
}

const logout =
  (router?: AppRouterInstance) =>
  async (params: any): Promise<AuthActionResponse> => {
    const result = await fbSignOut(auth)
    console.log('signOut result', result)
    router?.refresh()
    return {
      success: true,
    }
  }

const onError = async (error: AppError): Promise<OnErrorResponse> => {
  console.count('Handling error inside on error')
  console.log('error', error)
  const { statusCode } = error
  if (error && statusCode) {
    switch (statusCode) {
      case 401:
        return {
          error: new Error('Bạn không có quyền truy cập vào trang này.'),
          logout: false,
          redirectTo: '/unauthorized',
        }
      case 403:
        return {
          error: {
            message: 'Không đủ quyền truy cập.',
            name: 'Forbidden',
            statusCode: 403,
          },
        }
    }
  }
  return {
    error: error as AppError,
  }
}

const register = async ({ providerName, ...formValues }: IRegister) => {
  if (providerName === IAuthProvider['google']) {
    if (!('firebaseId' in formValues)) {
      throw new Error('firebase ID property is missing')
    }
    const { firebaseId } = formValues
    const response = await fetch(
      `${API_URL}/${authAPI['registerGoogle'](firebaseId)}`,
      { method: 'post' },
    )
    console.log('response', response)
    if (!response.ok) {
      throw new Error('Không thể đăng ký người dùng Google trong hệ thống')
    }
    const { token } = await response.json()
    signInWithCustomToken(auth, token)
    setIsNewUser(true)
    return {
      success: true,
    }
  }
  if (providerName === IAuthProvider['credentials'] && 'email' in formValues) {
    const { email, password, phoneNumber, firstName, lastName } = formValues
    console.log('formValues', formValues)
    const response = await springDataProvider.custom({
      url: authAPI.registerWithEmail,
      method: 'post',
      payload: {
        firstName,
        lastName,
        phoneNumber,
        email,
        password,
      },
    })
    if (response.data) {
      const { token } = response.data
      signInWithCustomToken(auth, token)
      setIsNewUser(true)
      return {
        success: true,
      }
    }
  }

  return {
    success: false,
  }
  //todo: gửi info lên back-end api
  //todo: đợi backend trả về response là token
  //todo: gọi firebase và settoken nếu success
  //todo: throw error nếu có lỗi
}

const forgotPassword = async (email: string): Promise<AuthActionResponse> => {
  try {
    const response = await sendPasswordResetEmail(auth, email)
    console.log('response sending email', response)
    return {
      success: true,
    }
  } catch (error) {
    return {
      success: false,
      error: error as Error,
    }
  }
}
const updatePassword = async (
  props: IUpdatePassword,
): Promise<AuthActionResponse> => {
  const { type } = props
  if (type === 'reset') {
    const { actionCode, password } = props
    try {
      const result = await confirmPasswordReset(auth, actionCode, password)
      // Password reset has been confirmed and new password updated.
      // TODO: Display a link back to the app, or sign-in the user directly
      // if the page belongs to the same domain as the app:
      // auth.signInWithEmailAndPassword(accountEmail, newPassword);
      // TODO: If a continue URL is available, display a button which on
      // click redirects the user back to the app via continueUrl with
      // additional state determined from that URL's parameters.
      return {
        success: true,
        response: result,
      }
    } catch (error) {
      return {
        success: false,
        error: error as Error,
      }
    }
  }
  throw new Error('Operation is not supported')
}
const getPermissions = async () => {
  const { claims, userProfile, _hasPermissionHydrated } = authStore.getState()
  const [promise, cleanup] = suspensePromiseWithCleanup(_hasPermissionHydrated)
  await promise
  const roles = claims?.roles?.map(
    (role) => ROLES[role.toUpperCase() as keyof typeof ROLES],
  )
  cleanup?.()
  return roles ?? []
}
const getIdentity = async (params?: any) => {}

const firebaseAuth = {
  auth: auth,
  login,
  logout: logout(),
  check,
  onError,
  forgotPassword,
  register,
  updatePassword,
  getIdentity,
  getPermissions,
  authProvider: (router?: AppRouterInstance): AuthBindings => ({
    login,
    logout: logout(router),
    check,
    onError,
    register,
    forgotPassword,
    updatePassword,
    // getIdentity,
    getPermissions: async () => getPermissions(),
  }),
}
export { firebaseAuth }
