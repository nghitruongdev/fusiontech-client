/** @format */

'use client'
import { API_URL } from 'types/constants'
import { CheckCircle2, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { redirect, useSearchParams } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { OrderStatus, OrderStatusText } from 'types'
import { useEffect } from 'react'
import { useOne } from '@refinedev/core'
import LoadingOverlay from '@components/ui/LoadingOverlay'

const getOrder = async (oid: string) => {
  try {
    const response = await fetch(`${API_URL}/orders/${oid}`, {
      cache: 'no-store',
    })
    if (!response.ok) {
      console.error('Đơn hàng không tìm thấy: response not ok')
      return
    }
    return response.json()
  } catch (err) {
    console.error('Checkout success errr', err)
  }

  //   if (!response.ok) {
  //     redirect('/')
  //   }
}
const SuccessPage = () =>
  //     {
  //   searchParams: { oid },
  // }: {
  //   searchParams: { oid: string }
  // }
  {
    const { get } = useSearchParams()
    const id = get('oid')
    const { data: { data: order } = {}, status } = useOne({
      resource: 'orders',
      id: id ?? '',
      queryOptions: {
        enabled: !!id,
      },
    })
    // console.log('order', order)
    // if (!order) redirect('/')
    // useEffect(() => {}, [])
    if (status === 'loading')
      return (
        <>
          <LoadingOverlay />
        </>
      )
    if (!order) return <></>
    return (
      <>
        <>
          {/* <div className="flex flex-col gap-2 items-center justify-center">
                    <h1 className="text-2xl text-hoverBg font-semibold">
                        Thank you for shopping with us.
                    </h1>
                    <Link
                        href="/"
                        className="text-lg text-lightText hover:underline underline-offset-4 decoration-[1px] hover:text-blue duration-300"
                    >
                        Continue to shopping
                    </Link>
                </div> */}
        </>
        <>
          <div className='bg-white min-h-[600px] flex items-center'>
            <div className='w-1/2 p-8 mx-auto my-auto'>
              {/* <Image
                            src={successful2Img}
                            alt="successful"
                            className=" mb-8 w-1/3 h-auto mx-auto"
                        /> */}
              <div className='w-full h-full flex justify-center text-center '>
                <CheckCircle2
                  size='60'
                  className='text-green-600'
                />
              </div>
              {/* <h2 className="text-4xl font-bold mb-2 text-center leading-none text-green-700">
                            Đặt hàng thành công
                        </h2> */}
              <div>
                <h2 className='text-4xl font-normal mt-2 mb-4 text-center leading-2 text-zinc-500'>
                  Cám ơn bạn đã chọn
                  <p className='text-6xl font-semibold'>FusionTech Store</p>
                </h2>
                <div className=' w-fit text-start mx-auto mt-8 grid'>
                  {[
                    { title: 'Mã đơn hàng', content: id },
                    {
                      title: 'Trạng thái đơn hàng',
                      content:
                        OrderStatusText[order.status as OrderStatus].text ??
                        'Chờ xác nhận',
                    },
                  ].map((item) => (
                    <div
                      key={uuidv4()}
                      className='flex'>
                      <p className=' align-baseline text-md font-normal leading-snug text-zinc-500'>
                        {item.title}
                      </p>
                      <p className='ml-2 text-lg font-semibold leading-snug text-zinc-700'>
                        {item.content}
                      </p>
                    </div>
                  ))}

                  <p className='text-muted-foreground text-md font-normal text-zinc-500'>
                    Bạn có thể theo dõi đơn hàng trong phần{' '}
                    <Link
                      href={`/account/orders`}
                      className='underline hover:text-zinc-700 text-lg'>
                      quản lý đơn hàng
                    </Link>{' '}
                    của tôi
                  </p>
                </div>
              </div>

              <div className='flex justify-center mt-3'>
                {/* Thêm lớp mt-6 để tạo khoảng cách */}
                <Link
                  className=' flex gap-2 rounded-md bg-blue-600 hover:bg-blue-700 px-4 py-3 text-white text-sm font-semibold shadow-md'
                  href='/'
                  replace>
                  Tiếp tục mua sắm <ShoppingBag absoluteStrokeWidth />
                </Link>
              </div>
            </div>
          </div>
        </>
      </>
    )
  }
export default SuccessPage
