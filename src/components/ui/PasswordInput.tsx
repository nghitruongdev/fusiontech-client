/** @format */

import {
  Button,
  FormHelperText,
  IconButton,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
  forwardRef,
} from '@chakra-ui/react'
import { Eye, EyeOff } from 'lucide-react'
import React from 'react'

type Props = {
  showHelperText?: boolean
} & InputProps
const PasswordInput = forwardRef<Props, 'input'>(
  ({ showHelperText = true, ...props }, ref) => {
    const [show, setShow] = React.useState(false)
    const handleClick = () => setShow(!show)

    return (
      <>
        <InputGroup size='md'>
          <Input
            pr='4.5rem'
            placeholder='Nhập mật khẩu'
            {...props}
            type={show ? 'text' : 'password'}
            ref={ref}
          />
          <InputRightElement h='full'>
            {/* <Button
            h='1.75rem'
            size='sm'
            variant={'unstyled'}
            onClick={handleClick}>
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button> */}
            <IconButton
              variant={'unstyled'}
              color='gray.600'
              onClick={handleClick}
              display='flex'
              justifyContent='center'
              alignItems={'center'}
              mr='2'
              icon={show ? <EyeOff /> : <Eye />}
              aria-label={
                show ? 'Hide password button' : 'Show password button'
              }
            />
          </InputRightElement>
        </InputGroup>
        {showHelperText && (
          <FormHelperText
            color='gray.500'
            fontSize={'xs'}>
            Mật khẩu tối thiểu 8 ký tự
          </FormHelperText>
        )}
      </>
    )
  },
)
export default PasswordInput

export const validatePassword = (password: string) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}
