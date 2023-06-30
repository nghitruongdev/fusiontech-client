"use client";
import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { IResourceComponentsProps, useSelect } from "@refinedev/core";
import { Edit } from "@refinedev/chakra-ui";
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Select,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
} from "@chakra-ui/react";
import {
    UseModalFormReturnType,
    useModalForm,
} from "@refinedev/react-hook-form";
import { IInventoryDetail, IVariant } from "@/interfaces";

export const EditDetailModalForm: React.FC<
    UseModalFormReturnType<IInventoryDetail> & {
        items: IInventoryDetail[];
    }
> = ({
    saveButtonProps,
    modal: { visible, close },
    register,
    formState: { errors },
    refineCore: { id, queryResult, formLoading },
    resetField,
    items,
}) => {
    const record = queryResult?.data?.data;

    const { options: variantOptions } = useSelect<IVariant>({
        resource: "variants",
        defaultValue: record?.variantId,
        optionLabel: "id",
        optionValue: "id",
        queryOptions: {
            enabled: !!record,
        },
        pagination: {
            mode: "off",
        },
    });

    React.useEffect(() => {
        resetField("variantId", {
            defaultValue: record?.variantId,
        });
    }, [variantOptions]);

    // .filter(
    //                                     (option) =>
    //                                         record?.variantId ===
    //                                             option.value ||
    //                                         !items.some(
    //                                             (item) =>
    //                                                 item.variantId ===
    //                                                 option.value,
    //                                         ),
    //                                 )
    return (
        <Modal size="md" isOpen={visible} onClose={close}>
            <ModalOverlay />
            <ModalContent>
                <ModalCloseButton />
                <ModalHeader>Edit Post</ModalHeader>

                <ModalBody>
                    <Edit
                        isLoading={formLoading}
                        saveButtonProps={saveButtonProps}
                        resource="inventory-details"
                        recordItemId={id}
                        title={false}
                        goBack={null}
                        breadcrumb={null}
                    >
                        <FormControl mb="3" isInvalid={!!(errors as any)?.id}>
                            <FormLabel>Id</FormLabel>
                            <Input
                                disabled
                                type="number"
                                {...register("id", {
                                    required: "This field is required",
                                    valueAsNumber: true,
                                })}
                            />
                            <FormErrorMessage>
                                {(errors as any)?.id?.message as string}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl
                            mb="3"
                            isInvalid={!!(errors as any)?.quantity}
                        >
                            <FormLabel>Quantity</FormLabel>
                            <Input
                                type="number"
                                {...register("quantity", {
                                    required: "This field is required",
                                    valueAsNumber: true,
                                })}
                            />
                            <FormErrorMessage>
                                {(errors as any)?.quantity?.message as string}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl mb="3" isInvalid={!!errors?.variantId}>
                            <FormLabel>Variant</FormLabel>
                            <Select
                                placeholder="Select variant"
                                {...register("variantId", {
                                    required: "This field is required",
                                })}
                            >
                                {variantOptions?.map((option) => (
                                    <option
                                        value={option.value}
                                        key={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </Select>
                            <FormErrorMessage>
                                {(errors as any)?.variantId?.message as string}
                            </FormErrorMessage>
                        </FormControl>
                    </Edit>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
