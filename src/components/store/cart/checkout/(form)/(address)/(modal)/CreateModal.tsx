/** @format */

import { IUser, ShippingAddress } from 'types'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import { HttpError } from '@refinedev/core'
import { UseModalFormReturnType } from '@refinedev/react-hook-form'
import { AddressFormProvider } from './AddressForm'
import { SaveButton } from '@components/buttons'
import { useAuthUser } from '@/hooks/useAuth/useAuthUser'
import { useEffect } from 'react'

const CreateAddressModal: React.FC<
  UseModalFormReturnType<ShippingAddress, HttpError, ShippingAddress> & {}
> = (props) => {
  const {
    modal: { visible, close },
    setValue,
  } = props

  return (
    <Modal
      size='lg'
      isOpen={visible}
      onClose={close}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>Địa chỉ nhận hàng</ModalHeader>
        <ModalBody>
          <AddressFormProvider {...props} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
export default CreateAddressModal
