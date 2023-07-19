"use client";

const page = () => {
    return (
        <div>
            <VariantCreate />
        </div>
    );
};

import { IResourceComponentsProps } from "@refinedev/core";
import { Create } from "@refinedev/chakra-ui";
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
} from "@chakra-ui/react";
import { useForm } from "@refinedev/react-hook-form";

export const VariantCreate: React.FC<IResourceComponentsProps> = () => {
    const {
        refineCore: { formLoading },
        saveButtonProps,
        register,
        formState: { errors },
    } = useForm();

    return (
        <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
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
        </Create>
    );
};

export default page;
