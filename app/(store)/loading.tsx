/** @format */

import { AppLoadingSpinner } from 'app/loading'

const loading = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <AppLoadingSpinner />
    </div>
  )
}
export default loading
