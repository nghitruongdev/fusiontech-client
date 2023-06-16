import {
    useDisclosure,
    Flex,
    Portal,
    Modal,
    Radio,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    RadioGroup,
    ModalFooter,
    Button,
    Input,
    Select,
    Checkbox,
    FormControl,
    FormLabel,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { AddressBox, AddressRadioBox } from "./box";
import { ShippingAddress } from "@/interfaces";
import useSWR from "swr";
import { APP_API } from "@/constants";
import { getFetcher } from "@/hooks/useFetcher";
import AddressForm from "./form";
import useShippingAddress from "@/hooks/useShippingAddress";

type ModalListProps = {
    addressList: ShippingAddress[];
    defaultAddress: ShippingAddress | undefined;
    updateDefaultAddress: (addressId: number) => void;
    openEditModal: (current: ShippingAddress) => void;
};

export const AddressModalList = ({
    addressList,
    defaultAddress,
    updateDefaultAddress,
    openEditModal,
}: ModalListProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selected, setSelected] = useState<string | undefined>();
    const btnRef = React.useRef(null);

    const [selectedAddress, setSelectedAddress] = useState<
        ShippingAddress | undefined
    >(defaultAddress);

    useEffect(() => {
        if (!!!selectedAddress && !!defaultAddress) {
            setSelectedAddress(defaultAddress);
        }
    }, [defaultAddress]);

    const deleteAddress = () => {};

    const updateAddress = () => {};

    return (
        <>
            {selectedAddress && (
                <AddressBox
                    address={selectedAddress}
                    onClick={onOpen}
                    showCheck
                    isDefault={defaultAddress?.id === selectedAddress?.id}
                    className="border-blue-600 text-gray-700"
                />
            )}

            <Modal
                onClose={onClose}
                finalFocusRef={btnRef}
                isOpen={isOpen}
                scrollBehavior={"inside"}
                isCentered
                size="lg"
            >
                <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(3px)" />
                <ModalContent>
                    <ModalHeader>Địa chỉ nhận hàng</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <RadioGroup
                            name="shippingAddress"
                            defaultValue={selected}
                            onChange={(value) => setSelected(value)}
                        >
                            {addressList.map((item: ShippingAddress) => (
                                <div key={item.id}>
                                    <AddressRadioBox
                                        openEditModal={openEditModal}
                                        setDefaultAddress={updateDefaultAddress}
                                        address={item}
                                        value={item.id + ""}
                                        isSelected={selected === item.id + ""}
                                        isDefault={
                                            !!defaultAddress?.id &&
                                            item.id === defaultAddress.id
                                        }
                                    />
                                </div>
                            ))}
                        </RadioGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export const AddressModalForm = ({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) => {
    // const initialRef = React.useRef(null);
    // const finalRef = React.useRef(null);
    return (
        <>
            <Modal
                // initialFocusRef={initialRef}
                // finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
                size="lg"
            >
                <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(20px)" />
                <ModalContent className="h-ful">
                    <ModalHeader>Địa chỉ nhận hàng</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <AddressForm />
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3}>
                            Save
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
