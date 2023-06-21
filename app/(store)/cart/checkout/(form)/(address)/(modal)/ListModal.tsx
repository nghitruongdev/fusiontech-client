import { ShippingAddress } from "@/interfaces";
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
} from "@chakra-ui/react";
import React, { useState } from "react";
import { AddressRadioBox } from "../AddressBox";
import { BaseKey } from "@refinedev/core";

type ModalListProps = {
    addressList: ShippingAddress[];
    defaultAddress: ShippingAddress | undefined;
    updateDefaultAddress: (addressId: number) => void;
    openEditModal: (id?: BaseKey | undefined) => void;
    setSelectedAddress: (address?: ShippingAddress) => void;
    selectedAddress: ShippingAddress | undefined;
    deleteAddress: (address: ShippingAddress) => void;
    isLoading?: boolean;
    close: () => void;
    isOpen: boolean;
};

const AddressListModal = ({
    addressList,
    defaultAddress,
    updateDefaultAddress,
    openEditModal,
    selectedAddress,
    setSelectedAddress,
    isLoading,
    close: onClose,
    isOpen,
    deleteAddress,
}: ModalListProps) => {
    const selectedId = selectedAddress?.id + "";
    const defaultId = defaultAddress?.id + "";
    const list = addressList;

    const changeSelectedAddressHandler = (id: string) => {
        const selected = list.find((item) => item.id === id);
        setSelectedAddress(selected);
    };

    const [limit, setLimit] = useState<number>(20);
    return (
        <>
            <Modal
                onClose={onClose}
                // finalFocusRef={btnRef}
                isOpen={isOpen}
                scrollBehavior={"inside"}
                isCentered
                size="lg"
            >
                <ModalOverlay bg="blackAlpha.300" />
                <ModalContent>
                    <ModalHeader>Địa chỉ nhận hàng ({list.length})</ModalHeader>
                    <ModalCloseButton />
                    {isLoading && (
                        <ModalBody>
                            <div className="flex items-center justify-center">
                                <Spinner />
                            </div>
                        </ModalBody>
                    )}
                    {!isLoading && (
                        <ModalBody>
                            <RadioGroup
                                name="shippingAddress"
                                defaultValue={selectedId}
                                onChange={(value) =>
                                    changeSelectedAddressHandler(value)
                                }
                            >
                                {list.slice(0, limit).map((item) => (
                                    <AddressRadioBox
                                        key={item.id}
                                        openEditModal={openEditModal}
                                        setDefaultAddress={updateDefaultAddress}
                                        deleteAddress={deleteAddress}
                                        address={item}
                                        value={item.id ?? ""}
                                        isSelected={selectedId === item.id}
                                        isDefault={
                                            !!defaultId && item.id === defaultId
                                        }
                                    />
                                ))}
                            </RadioGroup>
                            {limit < list.length && (
                                <p
                                    className="text-center cursor-pointer mt-3"
                                    onClick={() => {
                                        if (limit < list.length) {
                                            setLimit((prev) => prev + 20);
                                        }
                                    }}
                                >
                                    Load more...
                                </p>
                            )}
                        </ModalBody>
                    )}
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default AddressListModal;
