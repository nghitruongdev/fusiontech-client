/** @format */

import { API_URL, ORDER_STATUS_GROUP } from 'types/constants'
import StatusTabs from './StatusTabs'
import { IOrderStatusGroup } from 'types'

const getStatusGroups = async () => {
  const response = await fetch(`${API_URL}/orders/statuses/groups`)

  if (!!!response.ok) {
    throw new Error(`Fetch status groups failed - ${response.status}`)
    return
  }
  return response.json()
}

const OrderLayout = async ({ children }: { children: React.ReactNode }) => {
  const statusGroups = ORDER_STATUS_GROUP as IOrderStatusGroup[]

  return (
    <>
      <div className=''>
        <StatusTabs groups={statusGroups} />
        <div className='min-h-[300px] mt-4'>{children}</div>
      </div>
    </>
  )
}
export default OrderLayout
