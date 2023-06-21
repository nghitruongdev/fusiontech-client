"use client";
import { Portal, useDisclosure } from "@chakra-ui/react";
import { AddressBox, EmptyAddressBox } from "./AddressBox";
import { ShippingAddress } from "@/interfaces";
import React, { useEffect, useState } from "react";
import { HttpError } from "@refinedev/core";
import { fakeUserId } from "@/constants";
import { useModalForm } from "@refinedev/react-hook-form";
import CreateAddressModal from "./(modal)/CreateModal";
import AddressListModal from "./(modal)/ListModal";
import EditAddressModal from "./(modal)/EditModal";
import useData, {
    CreateAddressProps,
    EditAddressProps,
} from "./(hooks)/useData";

const AddressSection = ({
    setAddressId,
}: {
    setAddressId: (addressId: number) => void;
}) => {
    const userId = fakeUserId;
    const { user, addressList, defaultAddress, address } = useData({ userId });

    const btnRef = React.useRef(null);

    const [selectedAddress, setSelectedAddress] = useState<
        ShippingAddress | undefined
    >();

    useEffect(() => {
        //nếu user hasn't selected, select default one
        if (!!!selectedAddress) {
            setSelectedAddress(defaultAddress.data);
        }
    }, [defaultAddress]);

    useEffect(() => {
        if (selectedAddress?.id) {
            setAddressId(+selectedAddress.id);
        }
    }, [selectedAddress]);
    const { listModalProps, createModalFormProps, editModalFormProps } =
        useModal({ ...address, refetchAddressList: addressList.refetch });

    const handler = {
        updateDefaultAddressHandler: (addressId: number) => {
            defaultAddress.update(addressId);
        },
    };

    return (
        <>
            {!!selectedAddress && (
                <AddressBox
                    address={selectedAddress}
                    onClick={listModalProps.onOpen}
                    showCheck
                    isDefault={defaultAddress.data?.id === selectedAddress?.id}
                    className="border-blue-600 text-gray-700"
                />
            )}

            <div
                onClick={createModalFormProps.modal.show.bind(null, undefined)}
            >
                <EmptyAddressBox />
            </div>

            <Portal>
                <CreateAddressModal
                    {...createModalFormProps}
                    user={user.data}
                />
                {/* {!!addressList.data && ( */}
                <>
                    <AddressListModal
                        addressList={
                            addressList.data?.map((item) => ({
                                ...item,
                                id: item.id + "",
                            })) ?? []
                        }
                        defaultAddress={defaultAddress.data}
                        updateDefaultAddress={
                            handler.updateDefaultAddressHandler
                        }
                        openEditModal={editModalFormProps.modal.show}
                        selectedAddress={selectedAddress}
                        setSelectedAddress={setSelectedAddress}
                        deleteAddress={address.deleteAddress}
                        close={listModalProps.onClose}
                        isOpen={listModalProps.isOpen && !!addressList}
                    />
                    <EditAddressModal
                        {...editModalFormProps}
                        user={user.data}
                    />
                </>
                {/* )} */}
            </Portal>
        </>
    );
};

type Props = {
    createAddress: (props: CreateAddressProps) => void;
    editAddress: (props: EditAddressProps) => void;
    refetchAddressList: () => void;
};
const useModal = ({
    createAddress,
    editAddress,
    refetchAddressList,
}: Props) => {
    const listModalProps = useDisclosure();

    const createProps = useModalForm<
        ShippingAddress,
        HttpError,
        ShippingAddress
    >({
        refineCoreProps: {
            action: "create",
            resource: "shippingAddresses",
            onMutationSuccess(data, variables, context) {
                refetchAddressList();
            },
        },
        warnWhenUnsavedChanges: false,
    });

    const editProps = useModalForm<ShippingAddress, HttpError, ShippingAddress>(
        {
            refineCoreProps: {
                action: "edit",
                resource: "shippingAddresses",
                onMutationSuccess(data, variables, context) {
                    refetchAddressList();
                },
            },
            warnWhenUnsavedChanges: false,
        },
    );

    const createButtonProps = () => {
        const {
            saveButtonProps,
            handleSubmit,
            refineCore: { onFinish },
            reset,
            modal: { close: closeModal },
        } = createProps;

        const onClick = (event: any) => {
            createAddress({ handleSubmit, onFinish, reset, closeModal });
        };

        return {
            ...saveButtonProps,
            onClick,
        };
    };

    const editButtonProps = () => {
        const {
            saveButtonProps,
            handleSubmit,
            refineCore: { onFinish },
            reset,
            modal: { close },
        } = editProps;

        const onClick = (event: any) => {
            editAddress({ handleSubmit, onFinish, reset, closeModal: close });
        };

        return {
            ...saveButtonProps,
            onClick,
        };
    };

    return {
        listModalProps,
        createModalFormProps: {
            ...createProps,
            saveButtonProps: createButtonProps(),
        },
        editModalFormProps: {
            ...editProps,
            saveButtonProps: editButtonProps(),
        },
    };
};

export default AddressSection;
