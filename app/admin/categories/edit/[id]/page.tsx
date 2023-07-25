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

export default function EditPage() {
    return <CategoryEdit />;
}

export const CategoryEdit: React.FC<IResourceComponentsProps> = () => {
    const {
        refineCore: { formLoading, queryResult },
        saveButtonProps,
        register,
        setValue,
        formState: { errors },
    } = useForm();

    const categoriesData = queryResult?.data?.data;

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
            <FormControl mb="3" isInvalid={!!(errors as any)?.name}>
                <FormLabel>Tên danh mục</FormLabel>
                <Input
                    type="text"
                    {...register("name", {
                        required: "Vui lòng nhập tên danh mục.",
                    })}
                />
                <FormErrorMessage>
                    {(errors as any)?.name?.message as string}
                </FormErrorMessage>
            </FormControl>
            <FormControl mb="3" isInvalid={!!(errors as any)?.slug}>
                <FormLabel>Slug</FormLabel>
                <Input
                    type="text"
                    {...register("slug", {
                        required: "Vui lòng nhập slug.",
                    })}
                />
                <FormErrorMessage>
                    {(errors as any)?.slug?.message as string}
                </FormErrorMessage>
            </FormControl>
            <FormControl mb="3" isInvalid={!!(errors as any)?.description}>
                <FormLabel>Mô tả danh mục</FormLabel>
                <Input
                    type="text"
                    {...register("description", {
                        required: "Vui lòng nhập mô tả danh mục.",
                    })}
                />
                <FormErrorMessage>
                    {(errors as any)?.description?.message as string}
                </FormErrorMessage>
            </FormControl>
        </Edit>
    );
};
