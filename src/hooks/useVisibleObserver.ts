/** @format */

import { useRef } from 'react'
import { useIntersectionObserver } from 'usehooks-ts'

export function useVisibleObserver<T extends Element>() {
  const ref = useRef<T | null>(null)
  const entry = useIntersectionObserver(ref, { freezeOnceVisible: true })
  const isVisible = !!entry?.isIntersecting
  return {
    ref,
    isVisible,
  }
}
