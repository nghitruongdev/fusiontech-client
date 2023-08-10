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
  return new Promise((res) => {
    const interval = setInterval(() => {
      if (condition) {
        clearInterval(interval)
        res(undefined)
      }
    }, options?.timeout ?? 100)

    if (options?.stop) {
      clearInterval(interval)
      res(undefined)
    }
  })
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
