/** @format */

import { useEffect, useState } from 'react'
import { useBoolean } from 'usehooks-ts'
import useCrudNotification from './useCrudNotification'
import { useBoolean as useChakraBoolean } from '@chakra-ui/react'

type OptionProps = {
  showError?: boolean
}
const useDebounceFn = <P extends any[], R>(
  fn: (...args: P) => Promise<R>,
  timer: number,
  options?: OptionProps,
) => {
  const [clearFn, setClearFn] = useState<Function>()
  const { onDefaultError: onError } = useCrudNotification()
  const { value: isRunning, setFalse, setTrue } = useBoolean()
  const [isLoading, { on: loadingOn, off: loadingOff }] = useChakraBoolean()
  const { showError = true } = options ?? {}
  const debounceFn = async (...args: P) => {
    const result = await new Promise<R | undefined>(async (res) => {
      setTrue()
      const id = setTimeout(async () => {
        try {
          loadingOn()
          console.log('timeout start running')
          const result = await fn(...args)
          res(result)
        } catch (err) {
          console.log('catch in debounce')
          showError && onError(err as Error)
          res(undefined)
        } finally {
          setFalse()
          loadingOff()
        }
      }, timer)

      const clear = () => {
        console.log('clear fn called')
        clearTimeout(id)
        res(undefined)
      }
      setClearFn(() => clear)
    })
    return result
  }
  useEffect(() => {
    return () => clearFn?.()
  }, [clearFn])
  return [debounceFn, isRunning, { isLoading }] as const
}
export default useDebounceFn
