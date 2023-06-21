import { ShippingAddress, User } from "@/interfaces";
import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
} from "@chakra-ui/react";
import { SaveButton } from "@refinedev/chakra-ui";
import { HttpError } from "@refinedev/core";
import { UseModalFormReturnType } from "@refinedev/react-hook-form";
import { AddressForm } from "../AddressForm";

const CreateAddressModal: React.FC<
    UseModalFormReturnType<ShippingAddress, HttpError, ShippingAddress> & {
        user: User;
    }
> = ({
    user,
    saveButtonProps,
    modal: { visible, close },
    register,
    formState: { errors },
    handleSubmit,
    refineCore: { formLoading, onFinish },
    setValue,
}) => {
    if (!!user) {
        setValue("user", user?._links.self.href);
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
                    <SaveButton
                        {...saveButtonProps}
                        isLoading={formLoading}
                    ></SaveButton>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
export default CreateAddressModal;
