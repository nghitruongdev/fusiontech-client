/**
 * used together with React's use hook for waiting for some condition become true
 *
 * @format
 * @suspensepromise
 * @param condition if true, resolve promise immediately
 * @returns undefined
 */

export const suspensePromise = (
  condition?: boolean,

  options?: { timeout?: number; stop?: boolean },
) => {
  console.count('suspense promise fn called')
  return new Promise((res) => {
    const interval = setInterval(() => {
      console.log('condition inside interval', condition)
      if (condition) {
        clearInterval(interval)
        res(undefined)
      }
    }, options?.timeout ?? 300)

    if (options?.stop) {
      clearInterval(interval)
      res(undefined)
    }
  })
}

export const suspensePromiseWithCleanup = (
  condition?: boolean,
  options?: {
    overtime?: number
    timeout?: number
  },
) => {
  console.count('suspense promise fn called')

  let cleanup: (() => void) | undefined
  const promise = new Promise((res) => {
    if (condition) {
      res(undefined)
      return
    }
    const interval = setInterval(() => {
      if (condition) {
        cleanup?.()
      }
    }, options?.timeout ?? 500)

    cleanup = () => {
      clearInterval(interval)
      res(undefined)
    }
  })
  return [promise, cleanup] as const
}

export const waitPromise = (time: number) => {
  return new Promise((res) => {
    setTimeout(() => res(undefined), time)
  })
}

export const errorPromise = (time: number, error?: Error) => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      rej(error ?? new Error('Error rejected inside promise'))
    }, time)
  })
}
