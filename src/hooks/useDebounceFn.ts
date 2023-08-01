import { useEffect, useState } from 'react'
import { useBoolean } from 'usehooks-ts'
import useErrorNotification from './useErrorNotification'

const useDebounceFn = <P extends any[], R>(
  fn: (...args: P) => Promise<R>,
  timer: number,
) => {
  const [clearFn, setClearFn] = useState<Function>()
  const { onError } = useErrorNotification()
  const { value: isRunning, setFalse, setTrue } = useBoolean()
  const debounceFn = async (...args: P) => {
    return await new Promise<R | undefined>(async (res) => {
      setTrue()
      const id = setTimeout(async () => {
        try {
          const result = await fn(...args)
          res(result)
        } catch (err) {
          console.log('catch in debounce')
          onError(err as Error)
          res(undefined)
        } finally {
          setFalse()
        }
      }, timer)

      const clear = () => {
        console.log('clear fn called')
        clearTimeout(id)
        res(undefined)
      }
      setClearFn(() => clear)
    })
  }
  useEffect(() => {
    return () => clearFn?.()
  }, [clearFn])
  return [debounceFn, isRunning] as const
}
export default useDebounceFn
