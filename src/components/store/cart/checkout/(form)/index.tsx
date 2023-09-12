/** @format */

'use client'
import {
  Textarea as ChakraTextarea,
  Input,
  Radio,
  RadioGroup,
  Tooltip,
} from '@chakra-ui/react'
import { useCallback, useState } from 'react'
import AddressSection, {
  AddressSectionProvider,
} from './(address)/AddressSection'
import ChakraFormInput from '@components/ui/ChakraFormInput'
import { useCheckoutContext } from '../CheckoutProvider'
import { Callback } from '@/lib/callback'
import { Controller } from 'react-hook-form'
import { PaymentMethod } from 'types'
import { PaymentMethodLabel } from 'types/constants'
import { TooltipCondition } from '@components/ui/TooltipCondition'

const Form = () => {
  return (
    <>
      <div className='mt-4 py-2 px-8'>
        <h1 className='text-2xl font-[700]'>Thông tin đặt hàng</h1>
      </div>
      <div className='px-8'>
        <Form.Address />
        {/* <Separator className="my-4" /> */}
        <div className='px-6 py-3  bg-white mb-4 border rounded-md shadow-md'>
          <h4 className='text-lg font-semibold mb-3'>Thông tin liên hệ</h4>
          <Form.Mail />
          <Form.Note />
        </div>
        <Form.Payment />
      </div>
    </>
  )
}
Form.Address = function Address() {
  //   const { setValue, addressError } = useCheckoutContext(
  //     ({
  //       setValue,
  //       formState: {
  //         errors: { addressId },
  //       },
  //     }) => ({ setValue, addressError: addressId }),
  //   )
  const {
    setValue,
    formState: { errors },
  } = useCheckoutContext()
  const onAddressChange: Callback<Function> = useCallback(
    (value: number) => {
      setValue(`addressId`, value, {
        shouldValidate: true,
      })
    },
    [setValue],
  )
  onAddressChange.isCallback = true

  return (
    <div className='px-6 py-3 bg-white mb-4 border rounded-md shadow-md'>
      <h4 className='text-lg font-semibold mb-3'>Địa chỉ giao hàng</h4>
      <div className='justify-around grid grid-cols-2 gap-4 min-h-[100px] mb-4'>
        <AddressSectionProvider>
          <AddressSection />
        </AddressSectionProvider>
      </div>
    </div>
  )
}

Form.Mail = function MailInput() {
  //   const register = useCheckoutContext((state) => state.register)
  const { register } = useCheckoutContext()
  return (
    <div className='mb-2'>
      <ChakraFormInput
        helperText='Hoá đơn điện tử sẽ được gửi đến địa chỉ email
                                của bạn.'
        helperTextProps={{
          color: 'blackAlpha.400',
          lineHeight: 'base',
          fontSize: 'sm',
        }}>
        <Input
          placeholder='Nhập địa chỉ email '
          fontSize={'sm'}
          bg='whiteAlpha.900'
          shadow='sm'
          {...register('email')}
        />
      </ChakraFormInput>
    </div>
  )
}
Form.Note = function Note() {
  const { register } = useCheckoutContext()
  return (
    <div className='mb-4'>
      <ChakraFormInput
        label='Ghi chú'
        labelProps={{
          mb: '2',
          fontWeight: 'semibold',
          fontSize: 'lg',
        }}>
        <ChakraTextarea
          bg='whiteAlpha.900'
          fontSize={'sm'}
          placeholder='Nhập nội dung ghi chú'
          shadow={'sm'}
          {...register('note')}
        />
      </ChakraFormInput>
    </div>
  )
}

Form.Payment = function Payment() {
  //   const [payment, setPayment] = useState('1')
  const { control } = useCheckoutContext()
  const notCod = (method: PaymentMethod) => PaymentMethod.COD !== method
  return (
    <div className='px-6 py-3  bg-white mb-4 border rounded-md shadow-md'>
      <h4 className='font-semibold text-lg mb-3'>Phương thức thanh toán</h4>
      <div className='mb-4'>
        <Controller
          name='payment.method'
          control={control}
          rules={{
            required: true,
          }}
          defaultValue={PaymentMethod.COD}
          render={({ field }) => (
            <RadioGroup {...field}>
              <div className='flex space-x-8 justify-start'>
                {[PaymentMethod.COD, PaymentMethod.CREDIT_CARD].map(
                  (item, idx) => (
                    <Radio
                      value={item}
                      key={idx}
                      isDisabled={notCod(item)}>
                      <TooltipCondition
                        condition={notCod(item)}
                        label={
                          notCod(item)
                            ? 'Phương thức thanh toán chưa hỗ trợ'
                            : ''
                        }>
                        <span className='text-md font-medium leading-tight text-zinc-600'>
                          {PaymentMethodLabel[item]}
                        </span>
                      </TooltipCondition>
                    </Radio>
                  ),
                )}
              </div>
            </RadioGroup>
          )}
        />
      </div>
    </div>
  )
}
export { Form as CheckoutForm }
