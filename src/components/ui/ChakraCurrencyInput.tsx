import { forwardRef, Box, InputProps, Input } from '@chakra-ui/react'
import CurrencyInput, { CurrencyInputProps } from 'react-currency-input-field'

export const ChakraCurrencyInput = forwardRef<
  InputProps & CurrencyInputProps,
  'input'
>((props, ref) => (
  <Input
    ref={ref}
    textAlign="left"
    intlConfig={{ locale: 'vi-VN', currency: 'VND' }}
    as={CurrencyInput}
    decimalSeparator="."
    groupSeparator=","
    decimalsLimit={0}
    onFocus={(e) => e.target.select()}
    {...props}
  />
))
