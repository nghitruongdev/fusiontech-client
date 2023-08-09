/** @format */

import { createContext, useContext } from 'react'

const page = () => {
  return <div>page</div>
}
export default page

type State = {}
const Context = createContext<State | null>(null)

const FormProvider = () => {}
