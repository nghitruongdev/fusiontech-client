/** @format */

import useDebounceFn from '@/hooks/useDebounceFn'
import useCrudNotification, {
  onError,
  onSuccess,
} from '@/hooks/useCrudNotification'
import {
  Button,
  ButtonGroup,
  FormControl,
  FormErrorIcon,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
  Textarea,
  Tooltip,
} from '@chakra-ui/react'
import { SaveButton } from '@components/buttons'
import { Create, Edit } from '@components/crud'
import { Action } from '@refinedev/core'
import { useForm } from '@refinedev/react-hook-form'
import { PropsWithChildren, createContext, useContext } from 'react'
import { IVoucher } from 'types'
import { API, API_URL } from 'types/constants'
import { ERRORS } from 'types/messages'
import { AppError } from '../../../../types/error'
import { DeleteVoucherButton } from './delete-button'
import { useHeaders } from '@/hooks/useHeaders'
import { Controller } from 'react-hook-form'
import { ChakraCurrencyInput } from '@components/ui/ChakraCurrencyInput'
import { handleNumericInput } from '@/lib/utils'
import { validateVoucherCodeExists } from './utils'

type ContextProps = {
  action: 'create' | 'edit'
  voucher: IVoucher | undefined
} & ReturnType<typeof useForm<IVoucher, AppError, IVoucher>>

export const Form = ({ action }: { action: ContextProps['action'] }) => {
  return (
    <Form.Provider action={action}>
      <Form.Body />
    </Form.Provider>
  )
}

Form.Context = createContext<ContextProps | null>(null)

Form.useContext = () => {
  const context = useContext(Form.Context)
  if (!context) {
    throw new Error('FormContext.Provider is missing')
  }
  return {
    ...context,
  }
}

Form.Provider = function Provider({
  action,
  children,
}: PropsWithChildren<{ action: ContextProps['action'] }>) {
  const { getAuthHeader } = useHeaders()
  const formProps = useForm<IVoucher, AppError, IVoucher>({
    refineCoreProps: {
      meta: {
        headers: {
          ...getAuthHeader(),
        },
      },
      errorNotification: onError,
      successNotification: onSuccess.bind(null, action),
    },
  })
  const {
    handleSubmit,
    refineCore: {
      formLoading,
      onFinish,
      queryResult: { data: { data: voucher } = { data: undefined } } = {},
    },
    formState: { dirtyFields, isSubmitting, isValidating },
    saveButtonProps,
  } = formProps

  const saveProps = {
    ...saveButtonProps,
    onClick: (e: any) => {
      handleSubmit(onFinish)(e).catch((err) => {
        console.log('err during submit', err)
      })
    },
  }

  return (
    <Form.Context.Provider
      value={{
        ...formProps,
        action,
        voucher,
        saveButtonProps: saveProps,
      }}>
      <Form.Container>{children}</Form.Container>
    </Form.Context.Provider>
  )
}

Form.Container = function Container({ children }: PropsWithChildren) {
  const {
    action,
    refineCore: { formLoading, queryResult },
    saveButtonProps,
    formState: { isSubmitting },
  } = Form.useContext()

  const isEdit = action === 'edit'
  const usage = queryResult?.data?.data?.usage ?? 0
  if (isEdit)
    return (
      <Edit
        isLoading={formLoading}
        saveButtonProps={saveButtonProps}
        footerButtons={({ saveButtonProps: saveProps, deleteButtonProps }) => {
          return (
            <ButtonGroup>
              <DeleteVoucherButton
                {...deleteButtonProps}
                disabled={saveProps?.disabled}
                usageCount={usage}
              />

              <SaveButton
                {...saveProps}
                disabled={formLoading || isSubmitting || saveProps?.disabled}
                isLoading={isSubmitting}
              />
            </ButtonGroup>
          )
        }}>
        {children}
      </Edit>
    )

  return (
    <Create
      isLoading={formLoading}
      saveButtonProps={saveButtonProps}>
      {children}
    </Create>
  )
}

Form.Body = function Body() {
  const {
    action,
    register,
    refineCore: { queryResult },
    formState: { errors },
    voucher,
  } = Form.useContext()
  const isEdit = action === 'edit'
  const { onDefaultError: onError } = useCrudNotification()

  const usageCount = queryResult?.data?.data?.usage ?? 0

  const [checkCodeExists, isChecking] = useDebounceFn(
    validateVoucherCodeExists.bind(null, voucher, onError),
    300,
  )

  return (
    <div className='grid grid-cols-3 gap-4'>
      <div className='col-span-3 gap-4'>
        <FormControl
          mb='3'
          isInvalid={!!errors?.code}>
          <FormLabel>Code</FormLabel>
          <InputGroup>
            <Input
              type='text'
              {...register('code', {
                required: ERRORS.vouchers.code.required,
                validate: async (value) =>
                  !!value && (await checkCodeExists(value?.trim())),
                setValueAs: (value) => value && value.trim(),
              })}
            />
            <InputRightElement>
              {isChecking && <Spinner color='blue.600' />}
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>
            <FormErrorIcon />
            {errors?.code?.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          mb='3'
          isInvalid={!!errors?.discount}>
          <FormLabel>Giảm giá</FormLabel>
          <Input
            type='number'
            readOnly={!!usageCount}
            {...register('discount', {
              required: 'Vui lòng nhập giảm giá.',
              valueAsNumber: true,
              validate: (value) =>
                (value > 0 && value <= 100) || 'Nhập giá trị từ 0 - 100.',
            })}
            onKeyDown={handleNumericInput}
          />
          <FormErrorMessage>
            <FormErrorIcon />
            {errors.discount?.message}
          </FormErrorMessage>
        </FormControl>

        <Form.MinOrderAmount />
        <Form.MaxDiscountAmount />

        <FormControl
          mb='3'
          isInvalid={!!errors?.startDate}>
          <FormLabel>Ngày bắt đầu</FormLabel>
          <Input
            type='datetime-local'
            {...register('startDate')}
          />
          <FormErrorMessage>
            <FormErrorIcon />
            {errors.startDate?.message as string}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          mb='3'
          isInvalid={!!errors?.expirationDate}>
          <FormLabel>Ngày kết thúc</FormLabel>
          <Input
            type='datetime-local'
            {...register('expirationDate')}
          />
          <FormErrorMessage>
            <FormErrorIcon />
            {(errors as any)?.expirationDate?.message as number}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          mb='3'
          isInvalid={!!errors?.limitUsage}>
          <FormLabel>Số lần sử dụng</FormLabel>
          <Input
            type='number'
            {...register('limitUsage', {
              max: Number.MAX_SAFE_INTEGER,
            })}
            onKeyDown={handleNumericInput}
          />
          <FormErrorMessage>
            <FormErrorIcon />
            {errors.limitUsage?.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          mb='3'
          isInvalid={!!errors?.userLimitUsage}>
          <FormLabel>Số lần sử dụng của người dùng</FormLabel>
          <Input
            type='number'
            {...register('userLimitUsage', {
              max: {
                value: 100,
                message: 'Số lần tối đa là 100',
              },
            })}
            onKeyDown={handleNumericInput}
          />
          <FormErrorMessage>
            <FormErrorIcon />
            {(errors as any)?.userLimitUsage?.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          mb='3'
          isInvalid={!!errors.description}>
          <FormLabel>Mô tả</FormLabel>
          <Textarea {...register('description')} />
          <FormErrorMessage>
            <FormErrorIcon />
            {(errors as any)?.description?.message as string}
          </FormErrorMessage>
        </FormControl>
      </div>
    </div>
  )
}

Form.MinOrderAmount = function MinOrderAmount() {
  const {
    formState: { errors },
    register,
    setValue,
    watch,
    control,
  } = Form.useContext()

  return (
    <FormControl
      mb='3'
      isInvalid={!!errors?.minOrderAmount}>
      <FormLabel>Giá trị đơn hàng tối thiểu</FormLabel>
      <InputGroup>
        <InputLeftElement
          pointerEvents='none'
          color='gray.300'
          fontSize='1.2em'>
          $
        </InputLeftElement>
        <Controller
          control={control}
          name='minOrderAmount'
          rules={{
            validate: (value) =>
              !value || +value >= 0 || 'Số tiền không hợp lệ',
          }}
          render={({ field }) => (
            <>
              <ChakraCurrencyInput
                pl='10'
                ref={field.ref}
                value={field.value}
                onValueChange={field.onChange}
                onBlur={field.onBlur}
              />
            </>
          )}
        />
      </InputGroup>
      <FormErrorMessage>
        <FormErrorIcon />
        {errors?.minOrderAmount?.message}
      </FormErrorMessage>
    </FormControl>
  )
}
Form.MaxDiscountAmount = function MaxDiscountAmount() {
  const {
    formState: { errors },
    register,
    setValue,
    watch,
    control,
  } = Form.useContext()

  return (
    <FormControl
      mb='3'
      isInvalid={!!errors?.maxDiscountAmount}>
      <FormLabel>Số tiền giảm tối đa</FormLabel>
      <InputGroup>
        <InputLeftElement
          pointerEvents='none'
          color='gray.300'
          fontSize='1.2em'>
          $
        </InputLeftElement>
        <Controller
          control={control}
          name='maxDiscountAmount'
          rules={{
            // min: 3 || 'Số tiền không hợp lệ',
            validate: (value) =>
              !value || +value >= 0 || 'Số tiền không hợp lệ',
          }}
          render={({ field }) => (
            <>
              <ChakraCurrencyInput
                pl='10'
                ref={field.ref}
                value={field.value}
                onValueChange={field.onChange}
                onBlur={field.onBlur}
              />
            </>
          )}
        />
      </InputGroup>
      <FormErrorMessage>
        <FormErrorIcon />
        {errors?.maxDiscountAmount?.message}
      </FormErrorMessage>
    </FormControl>
  )
}
export { Form as VoucherForm }
