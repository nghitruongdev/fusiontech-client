"use client";
import { ChakraUICreateInferencer } from "@refinedev/inferencer/chakra-ui";
import { IResourceComponentsProps } from "@refinedev/core";
import { Create } from "@refinedev/chakra-ui";
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
} from "@chakra-ui/react";
import { useForm } from "@refinedev/react-hook-form";

export default function CreatePage() {
    return <CategoryCreate />;
}

export const CategoryCreate: React.FC<IResourceComponentsProps> = () => {
    const {
        handleSubmit,
        refineCore: { formLoading },
        saveButtonProps,
        register,
        formState: { errors },
    } = useForm();

    return (
        <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
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
        </Create>
    );
};
//Todo:
// khi thêm mới danh mục thành công cần clear form và chuyển về show category