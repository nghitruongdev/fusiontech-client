/** @format */

import {
  Collapse,
  Box,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Alert,
} from '@chakra-ui/react'
import { ReactNode } from 'react'

type Props = {
  isVisible: boolean
  onClose?: () => void
  message: ReactNode
  status?: 'loading' | 'success' | 'warning' | 'error'
  title?: ReactNode
}

const CollapseAlert = ({
  isVisible,
  onClose,
  message,
  status = 'warning',
  title,
}: Props) => {
  return (
    <Collapse
      in={isVisible}
      animateOpacity>
      <Alert
        status='warning'
        rounded='md'
        my='4'>
        <AlertIcon />
        <Box flexGrow='1'>
          <AlertTitle>{title ?? getTitle(status)}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Box>
        <CloseButton
          onClick={onClose}
          alignSelf='flex-start'
          top='-1'
          right='-1'
        />
      </Alert>
    </Collapse>
  )
}

const getTitle = (status: Props['status']) => {
  switch (status) {
    case 'warning':
      return 'Cảnh báo!'
    case 'error':
      return 'Lỗi!'
    case 'success':
      return 'Thành công!'
  }
  return ''
}
export default CollapseAlert
