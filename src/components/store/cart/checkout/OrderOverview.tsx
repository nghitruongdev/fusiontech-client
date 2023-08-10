/** @format */

'use client'
import { Input } from '@components/ui/shadcn/input'
import CartItemList from './CartItemList'
import { Button } from '@components/ui/shadcn/button'
import { Separator } from '@components/ui/shadcn/separator'
import { Badge } from '@components/ui/shadcn/badge'
import {
  useSelectedCartItemStore,
  useValidSelectedCartItems,
} from '@components/store/cart/useSelectedItemStore'
import { useCheckoutContext } from './CheckoutProvider'
import { Spinner, useBoolean } from '@chakra-ui/react'
import { getDiscount, getTotalAmount } from '../utils'
import { formatPrice } from '../../../../lib/utils'
import {
  BaseSyntheticEvent,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import useDebounceFn from '@/hooks/useDebounceFn'
import { IVoucher } from 'types'
import { API, API_URL } from 'types/constants'
import useNotification from '@/hooks/useNotification'
import { useCustom } from '@refinedev/core'
import { useAuthUser } from '@/hooks/useAuth/useAuthUser'
import { calculateTotalPayment } from './utils'
import { useCountdown } from '@/hooks/useCountdown'

const OrderOverview = ({}: // isSubmitting,
{}) => {
  //   const { onCheckout, isSubmitting } = useCheckoutContext(
  //     ({ onCheckout, formState: { isSubmitting } }) => ({
  //       onCheckout,
  //       isSubmitting,
  //     }),
  //   )
  //   const [watch] = useCheckoutContext((state) => [state.watch])
  const {
    onCheckout,
    formState: { isSubmitting },
    watch,
    setValue,
  } = useCheckoutContext()
  const voucher = watch(`voucher`)
  const { code, maxDiscountAmount, discount: voucherDiscount } = voucher ?? {}
  const cartItems = useValidSelectedCartItems()
  const { total, discount, vDiscount, subTotal } = calculateTotalPayment(
    cartItems,
    voucher,
  )

  useEffect(() => {
    setValue(`items`, cartItems)
  }, [cartItems, setValue])

  return (
    <>
      <div className='flex items-end justify-between font-semibold text-lg mt-4 py-2 mx-2'>
        <h2 className='text-2xl font-[700]'>Đơn hàng</h2>
        {/* <p className="text-2xl font-semibold">Đơn hàng</p> */}
        <a
          className='text-blue-500 text-sm font-medium text-end mr-4'
          href='/'>
          Chỉnh sửa
        </a>
      </div>
      <div className='bg-white p-4 mx-2 rounded-lg shadow-md space-y-2'>
        <CartItemList />
        <div className='grid gap-2'>
          <div className='flex justify-between items-center'>
            <p className='text-muted text-sm text-zinc-500'>Tổng tạm tính</p>
            <p className='text-end font-bold text-zinc-600 text-lg'>
              {formatPrice(subTotal)}
            </p>
          </div>
          <div className='flex justify-between items-center'>
            <p className='text-muted text-sm text-zinc-500'>Giảm giá</p>
            <p className='font-medium text-sm text-green-600'>
              {formatPrice(discount)}
            </p>
          </div>
          <div className='flex justify-between'>
            <p className='text-muted text-sm text-zinc-500'>Phí vận chuyển</p>
            <p className='font-medium text-sm text-green-600'>Miễn phí</p>
          </div>
          {!!voucher && (
            <div className='flex justify-between'>
              <div className='flex gap-2 items-center'>
                <p className='text-muted text-sm text-zinc-500'>Mã giảm giá</p>
              </div>
              <div className='font-medium text-sm'>
                <Badge
                  variant={'outline'}
                  className='text-orange-600'>
                  {/* <span className='text-sm ml-2 font-bold'>{`${code} - `}</span> */}
                  {` ${formatPrice(vDiscount)}`}
                </Badge>
              </div>
            </div>
          )}
        </div>

        <Separator />
        <div className='flex justify-between mb-3 mt-4 items-center'>
          <p className='text-muted text-sm text-zinc-500'>Thành tiền</p>
          <p className='text-end font-bold text-zinc-600 text-lg'>
            {formatPrice(total)} <br />
            <span className='text-sm text-muted text-zinc-500 font-normal leading-tight'>
              (Đã bao gồm VAT)
            </span>
          </p>
        </div>
        <button
          className='flex items-center justify-center gap-4 w-full rounded-md bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white text-sm leading-loose font-[500] shadow-blue-500 shadow-md'
          onClick={onCheckout}
          disabled={isSubmitting}>
          {isSubmitting ? 'Đang đặt hàng....' : 'Xác nhận đặt hàng'}
          {isSubmitting && (
            <Spinner
              size={'sm'}
              speed='0.3s'
            />
          )}
        </button>
      </div>

      <div className='p-4 m-4 mx-2 rounded-lg bg-white shadow-md'>
        <Voucher orderAmount={total} />
      </div>
    </>
  )
}

const Voucher = ({ orderAmount }: { orderAmount: number }) => {
  const { findByCode, countUsage, countUserUsage } = API['vouchers']()
  const { userProfile } = useAuthUser()
  const [isError, { toggle }] = useBoolean()
  //   const {
  //     setError,
  //     formState: { errors },
  //     getFieldState,
  //     resetField,
  //     clearErrors,
  //     setValue,
  //   } = useCheckoutContext(
  //     ({
  //       setError,
  //       formState,
  //       getFieldState,
  //       resetField,
  //       clearErrors,
  //       setValue,
  //     }) => ({
  //       setError,
  //       formState,
  //       resetField,
  //       getFieldState,
  //       clearErrors,
  //       setValue,
  //     }),
  //   )
  const {
    setError,
    formState: { errors },
    resetField,
    setValue,
    getFieldState,
    getValues,
    clearErrors,
    register,
  } = useCheckoutContext()
  const ref = useRef<HTMLInputElement>(null)
  const [current, setCurrent] = useState<IVoucher | null>(null)
  const { open } = useNotification()
  const [timer, countdown] = useCountdown()
  const { data: { data: usageData } = {} } = useCustom({
    url: countUsage(current?.code),
    method: 'get',
    queryOptions: {
      enabled: !!current,
      refetchInterval: 3 * 1000,
      refetchIntervalInBackground: true,
    },
  })

  const { data: { data: userUsageData } = {} } = useCustom({
    url: countUserUsage(current?.code, userProfile?.id),
    method: 'get',
    queryOptions: {
      enabled: !!current && !!userProfile,
    },
  })

  const usage = usageData as unknown as number | undefined

  const errorMessage = 'Mã giảm giá không hợp lệ hoặc đã hết hạn.'

  const clearVoucher = () => {
    console.log('clear voucher ran')
    setValue(`voucher`, null)
    setCurrent(null)
    clearErrors(`voucher`)
    toggle()
  }

  const validateVoucher = async (voucher: IVoucher) => {
    const {
      startDate,
      expirationDate,
      minOrderAmount,
      limitUsage,
      userLimitUsage,
    } = voucher
    const start = new Date(startDate).getTime()
    const end = new Date(expirationDate).getTime()
    const now = Date.now()
    console.log('now < end, now > start', now < end, now > start)
    if (now > end || now < start)
      return setError(`voucher`, { message: errorMessage })

    setCurrent(voucher)
    countdown(Date.now(), new Date(voucher.expirationDate).getTime())
    if (orderAmount < (minOrderAmount ?? 0))
      return setError('voucher', {
        message: 'Đơn hàng chưa đạt giá trị tối thiểu để áp dụng',
      })
    setValue(`voucher`, voucher)
  }

  const fetchVoucher = async () => {
    const value = ref.current?.value
    if (!value) return
    const response = await fetch(`${API_URL}/${findByCode(value)}`, {
      cache: 'no-store',
    })
    if (!response.ok) {
      return setError(`voucher`, { message: errorMessage })
    }
    const data = (await response.json()) as IVoucher
    console.log('voucher', data)
    validateVoucher(data)
  }

  const [handleSubmit, isValidating] = useDebounceFn(fetchVoucher, 500)
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const value = ref.current?.value
    if (!value) return
    handleSubmit()
  }

  const validateDynamic = useCallback(() => {
    if (!current) return
    const { limitUsage, userLimitUsage } = current
    const usage = usageData as unknown as number
    const userUsage = userUsageData as unknown as number

    const onError = (message: string) => {
      setError(`voucher`, { message })
      if (getValues('voucher')) setValue(`voucher`, null)
      return message
    }

    if (limitUsage && limitUsage <= (usage ?? 0))
      return onError('Voucher đã hết lượt sử dụng')
    if (userUsage >= (userLimitUsage ?? 0))
      return onError('Bạn đã hết lượt sử dụng voucher')
  }, [current, setError, usageData, userUsageData])
  useEffect(() => {
    validateDynamic()
  }, [validateDynamic])

  const fieldError = getFieldState(`voucher`).error?.message

  const usageCount = usage
    ? current?.limitUsage
      ? ((usage / current.limitUsage) * 100).toFixed(1) + '%'
      : usage
    : undefined
  return (
    <>
      <input
        type='hidden'
        {...register(`voucherInput`, {
          validate: () => {
            return getValues(`voucher`) ? validateDynamic() : true
          },
        })}
      />
      <div className=''>
        <p className='font-medium'>Mã giảm giá</p>
        <p className='text-zinc-500 text-sm text-muted'>
          Nhập mã để được nhận giảm giá
        </p>
      </div>
      <hr className='my-2' />
      <form onSubmit={onSubmit}>
        <div className='grid gap-2 mt-3'>
          {current && (
            <p className='text-xs text-red-500'>
              Đã sử dụng {usageCount ?? usage}.{' '}
              {timer && (
                <span>
                  Hết hạn trong{' '}
                  {`${timer.hours}:${timer.minutes}:${timer.seconds}`}
                </span>
              )}
            </p>
          )}
          <div className='flex gap-2'>
            <Input
              ref={ref}
              onBlur={() => {
                if (!ref.current?.value?.trim()) {
                  clearVoucher()
                }
              }}
              placeholder='Mã giảm giá'
              className='shadow-md'
            />
            <Button
              type='submit'
              className='bg-blue-600 hover:bg-blue-700 px-6 shadow-md shadow-blue-500'>
              {isValidating ? <Spinner /> : 'Thêm'}
            </Button>
          </div>
          {!!fieldError && <p className='text-red-500 text-sm'>{fieldError}</p>}
          {!!current && !!!fieldError && (
            <p className='text-sm text-green-600'>
              Đã áp dụng mã giảm giá thành công
            </p>
          )}
        </div>
      </form>
      {current && (
        <div className='border border-orange-600 text-gray-700 text-sm rounded-md p-4 mt-4 grid gap-2'>
          <Badge className='bg-orange-600 w-fit'>
            {current?.code?.toUpperCase()}
          </Badge>
          <p className='text-md font-semibold'>{current?.description}</p>
          {current?.minOrderAmount && (
            <p>Đơn hàng tối thiểu: {formatPrice(current?.minOrderAmount)}</p>
          )}
          {current.maxDiscountAmount && (
            <p>Giảm giá tối đa: {formatPrice(current?.maxDiscountAmount)}</p>
          )}
          <p>
            Hiệu lực đến:{' '}
            {new Date(current.expirationDate ?? '').toLocaleString('vi-VN', {
              hour12: false,
            })}
          </p>
        </div>
      )}
    </>
  )
}
export default OrderOverview
