/** @format */

import Image from 'next/image'
import { loginImg } from '../public/assets/images'

import React from 'react'
import LoadingCart from './(store)/cart/loading'
const Loading = () => {
  // return <div>Loading homepage....</div>;
  let circleCommonClasses = ' h-3 w-3 bg-current  rounded'

  return <LoadingCart />
}
export default Loading
