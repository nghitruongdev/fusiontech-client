/** @format */

import { useState } from 'react'

export function useCountdown() {
  const [timer, setTimer] = useState<{
    hours: number
    minutes: number
    seconds: number
  }>()

  const countDown = (currentDate: number, targetDate: number) => {
    let timeDifference = targetDate - currentDate
    const calculateTimer = (timeDifference: number) => {
      const hours = Math.floor(timeDifference / (1000 * 60 * 60))
      const minutes = Math.floor(
        (timeDifference % (1000 * 60 * 60)) / (1000 * 60),
      )
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000)
      setTimer({ hours, minutes, seconds })
    }

    const interval = setInterval(() => {
      timeDifference = timeDifference - 1000
      calculateTimer(timeDifference)
      if (timeDifference <= 0) {
        setTimer(undefined)
        clearInterval(interval)
      }
    }, 1000)
  }

  return [timer, countDown] as const
}
