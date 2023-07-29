import { IUser, ShippingAddress } from 'types'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import { SaveButton } from '@refinedev/chakra-ui'
import { HttpError } from '@refinedev/core'
import { UseModalFormReturnType } from '@refinedev/react-hook-form'
import { AddressForm } from '../AddressForm'

const EditAddressModal: React.FC<
  UseModalFormReturnType<ShippingAddress, HttpError, ShippingAddress> & {
    user: IUser
  }
> = ({
  user,
  saveButtonProps,
  modal: { visible, close },
  register,
  formState: { errors },
  refineCore: { formLoading },
  setValue,
}) => {
  if (!!user) {
    setValue('user', user?._links.self.href)
  }

  return (
    <Modal size="lg" isOpen={visible} onClose={close}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>Địa chỉ nhận hàng</ModalHeader>

        <ModalBody>
          <AddressForm
            register={register}
            errors={errors}
            formLoading={formLoading}
          />
          <SaveButton {...saveButtonProps} isLoading={formLoading}></SaveButton>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default EditAddressModal
