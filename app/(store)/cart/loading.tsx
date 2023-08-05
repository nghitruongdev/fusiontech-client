/** @format */

import { AppLoadingSpinner } from 'app/loading'
import React from 'react'
const LoadingCart = () => {
  const circleCommonClasses = 'h-3 w-3 rounded'

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <AppLoadingSpinner />
    </div>
  )
}

export default LoadingCart
