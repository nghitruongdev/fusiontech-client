"use client";

import { ChakraUIEditInferencer } from "@refinedev/inferencer/chakra-ui";
import React from "react";
import { IResourceComponentsProps } from "@refinedev/core";
import { Edit } from "@refinedev/chakra-ui";
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
} from "@chakra-ui/react";
import { useForm } from "@refinedev/react-hook-form";

const page = () => {
    return (
        <div>
            <VariantEdit />
        </div>
    );
};

export const VariantEdit: React.FC<IResourceComponentsProps> = () => {
    const {
        refineCore: { formLoading, queryResult },
        saveButtonProps,
        register,
        setValue,
        formState: { errors },
    } = useForm();

    const variantsData = queryResult?.data?.data;

    return (
        <Edit isLoading={formLoading} saveButtonProps={saveButtonProps}>
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
            <FormControl mb="3" isInvalid={!!(errors as any)?.sku}>
                <FormLabel>Sku</FormLabel>
                <Input
                    type="text"
                    {...register("sku", {
                        required: "This field is required",
                    })}
                />
                <FormErrorMessage>
                    {(errors as any)?.sku?.message as string}
                </FormErrorMessage>
            </FormControl>
            <FormControl mb="3" isInvalid={!!(errors as any)?.price}>
                <FormLabel>Price</FormLabel>
                <Input
                    type="number"
                    {...register("price", {
                        required: "This field is required",
                        valueAsNumber: true,
                    })}
                />
                <FormErrorMessage>
                    {(errors as any)?.price?.message as string}
                </FormErrorMessage>
            </FormControl>
            <FormControl
                mb="3"
                isInvalid={!!(errors as any)?.availableQuantity}
            >
                <FormLabel>Available Quantity</FormLabel>
                <Input
                    type="number"
                    {...register("availableQuantity", {
                        required: "This field is required",
                        valueAsNumber: true,
                    })}
                />
                <FormErrorMessage>
                    {(errors as any)?.availableQuantity?.message as string}
                </FormErrorMessage>
            </FormControl>
        </Edit>
    );
};

export default page;
