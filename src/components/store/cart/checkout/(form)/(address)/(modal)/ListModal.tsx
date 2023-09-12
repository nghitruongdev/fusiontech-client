/** @format */

import { ShippingAddress } from 'types'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  RadioGroup,
  ModalFooter,
  Button,
  Spinner,
} from '@chakra-ui/react'
import React, { useMemo, useState } from 'react'
import { AddressRadioBox } from '../AddressBox'
import { useAddressContextProvider } from '../AddressSection'

type ModalListProps = {
  addressList?: ShippingAddress[]
  isLoading?: boolean
}

const AddressListModal = ({ addressList, isLoading }: ModalListProps) => {
  const {
    selectedAddress,
    setSelectedAddress,
    listModalProps: { isOpen, onClose },
  } = useAddressContextProvider()
  const selectedId = selectedAddress?.id + ''
  const list = useMemo(
    () =>
      addressList?.map((item) => ({
        ...item,
        id: item.id + '',
      })) ?? [],
    [addressList],
  )
  const onChangeAddress = (id: string) => {
    const selected = list.find((item) => item.id === id)
    setSelectedAddress(selected)
  }
  const [limit, setLimit] = useState<number>(20)
  return (
    <>
      <Modal
        onClose={onClose}
        // finalFocusRef={btnRef}
        isOpen={isOpen && !!list.length}
        scrollBehavior={'inside'}
        size='lg'>
        <ModalOverlay bg='blackAlpha.300' />
        <ModalContent>
          <ModalHeader>Địa chỉ nhận hàng ({list.length})</ModalHeader>
          <ModalCloseButton />
          {isLoading && (
            <ModalBody>
              <div className='flex items-center justify-center'>
                <Spinner />
              </div>
            </ModalBody>
          )}
          {!isLoading && (
            <ModalBody mb='4'>
              <RadioGroup
                name='shippingAddress'
                defaultValue={selectedId}
                onChange={(value) => onChangeAddress(value)}>
                {list.slice(0, limit).map((item) => (
                  <AddressRadioBox
                    key={item.id}
                    address={item}
                  />
                ))}
              </RadioGroup>
              {limit < list.length && (
                <p
                  className='text-center cursor-pointer mt-3'
                  onClick={() => {
                    if (limit < list.length) {
                      setLimit((prev) => prev + 20)
                    }
                  }}>
                  Tải thêm
                </p>
              )}
            </ModalBody>
          )}
          <ModalFooter>
            <Button onClick={onClose}>Đóng</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AddressListModal
