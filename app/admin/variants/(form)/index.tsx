"use client";

import { HttpError, useCustom, useOne } from "@refinedev/core";
import { Create, Edit } from "@refinedev/chakra-ui";
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Image,
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    Heading,
    SkeletonText,
    Skeleton,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Spinner,
} from "@chakra-ui/react";
import { useForm } from "@refinedev/react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import Select from "react-select";
import { API, IProduct, IVariant, IVariantField, Option } from "types";
import { PropsWithChildren } from "react";
import {
    Controller,
    UseFieldArrayReturn,
    useFieldArray,
} from "react-hook-form";
import { CheckIcon, CloudCog, Inbox } from "lucide-react";
import { API_URL } from "types/constants";
import useListOption from "@/hooks/useListOption";
import { useBoolean, useDebounce } from "usehooks-ts";
import { suspensePromise, waitPromise } from "@/lib/promise";
import useCancellable from "@/hooks/useCancellable";

const productResource = API.products();
const variantResource = API.variants();

type FormProps = {
    action: "create" | "edit";
};

export const VariantForm = ({ action }: FormProps) => {
    return (
        <ContextProvider action={action}>
            <div className="grid grid-cols-3 gap-4">
                <div className=" border-r">
                    <VariantForm.Images />
                </div>
                <div className=" col-span-2">
                    <VariantForm.Product />
                    <Heading as="h5">Tên sản phẩm</Heading>
                    <>
                        Lorem ipsum dolor, sit amet consectetur adipisicing
                        elit.
                    </>
                    <VariantForm.SKU />
                    <VariantForm.Price />
                    <VariantForm.Options />
                    <Heading as="h5">Mô tả</Heading>
                    <>
                        Lorem, ipsum dolor sit amet consectetur adipisicing
                        elit. Consequatur laborum, quisquam deserunt, ad commodi
                        ab aspernatur repellat in dicta quae reiciendis est
                        quia, suscipit minus ducimus ipsum sunt praesentium.
                        Ratione!
                    </>
                </div>
            </div>
        </ContextProvider>
    );
};

VariantForm.Product = () => {
    const {
        paramProductId,
        control,
        variant,
        resetField,
        setValue,
        refineCore: { id },
        formState: { errors },
        productResponse: { data: { data: product } = {} },
    } = useFormContextProvider();

    const inputDisabled = !!paramProductId || !!id;

    const { options } = useListOption<IProduct, string, IProduct>({
        toOption: (item) => ({ label: item.name, value: item }),
        resource: productResource.resource,
        pagination: {
            mode: "off",
        },
        queryOptions: {
            enabled: !inputDisabled,
        },
    });
    useEffect(() => {
        if (product) {
            resetField("product", {
                defaultValue: {
                    label: product.name,
                    value: product,
                } as any,
            });
        }
        if (paramProductId) {
        }
    }, [product, options]);
    return (
        <>
            <FormControl isInvalid={!!errors.product}>
                <p>Sản phẩm</p>

                <Controller
                    render={({ field }) => (
                        <Select
                            options={options as any}
                            {...field}
                            isDisabled={inputDisabled}
                        />
                    )}
                    control={control}
                    name={`product`}
                    rules={{
                        required: "Chọn một sản phẩm để thêm biến thể.",
                    }}
                />
                <FormErrorMessage>
                    {errors.product?.message as string}
                </FormErrorMessage>
            </FormControl>
        </>
    );
};

VariantForm.SKU = () => {
    const { existsBySku, findBySku } = variantResource;
    const {
        formState: { errors, isValidating },
        register,
        watch,
        variant,
        getValues,
        getFieldState,
        trigger,
        setError,
    } = useFormContextProvider();
    const [checkSku, setCheckSku] = useState<string | null>(null);
    const debounceSKU = useDebounce(checkSku, 500);
    const [isFieldValidating, setIsFieldValidating] = useState<boolean>(false);
    const { cancellablePromise, cancel } = useCancellable();
    const checkSkuDB = async (sku: string) => {
        console.count("checkSKuDB ran");
        if (!sku) {
            setCheckSku(null);
            setIsFieldValidating(false);
            return;
        }
        const response = await fetch(`${API_URL}/${findBySku(sku)}`);

        if (!response.ok) {
            setError("sku", {
                message: "Không thể kiểm tra SKU - 500",
            });
        } else {
            const result = (await response.json()) as IVariant;
            if (result) {
                if (result)
                    setError("sku", {
                        message: "Mã SKU đã tồn tại",
                    });
            }
        }
        setIsFieldValidating(false);
        setCheckSku(null);
        console.log("turn off field validating");
    };

    const validateSKUExists = async (sku: string) => {
        if (!sku) return false;
        setIsFieldValidating(true);
        await waitPromise(300);
        let message: string = "";
        const response = await fetch(`${API_URL}/${findBySku(sku.trim())}`);
        if (response.status === 404) {
            setIsFieldValidating(false);
            return true;
        }
        if (response.ok) {
            const result = await response.json();
            if (result) {
                if (variant?.id && variant.id === result.id) {
                    setIsFieldValidating(false);
                    return true;
                }
                message = "Mã SKU đã tồn tại";
            }
        }
        setIsFieldValidating(false);
        return message ?? true;
    };

    useEffect(() => {
        if (!debounceSKU) {
            setIsFieldValidating(false);
            return;
        }
        checkSkuDB(debounceSKU);
    }, [debounceSKU]);
    return (
        <FormControl mb="3" isInvalid={!!(errors as any)?.sku}>
            <FormLabel>Mã SKU</FormLabel>
            <InputGroup>
                <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    fontSize="1.2em"
                    children="$"
                />
                <Input
                    type="text"
                    {...register("sku", {
                        required: "This field is required",
                        onChange: (e) => {},
                        validate: async (value) => {
                            return await validateSKUExists(value);
                            // cancel();
                            // setCheckSku(null);
                            // return (await cancellablePromise((res, rej) => {
                            //     setIsFieldValidating(true);
                            //     setCheckSku(value);
                            //     console.log(
                            //         "isFieldValidating inside promise",
                            //         isFieldValidating,
                            //     );
                            //     if (!isFieldValidating) return res(true);
                            // })) as any;
                            // console.count("validate called");
                            // return await new Promise(async (res) => {
                            //     await new Promise((validatingRes) => {
                            //         setIsFieldValidating(() => {
                            //             setTimeout(validatingRes, 300);
                            //             return true;
                            //         });
                            //     });
                            //     setCheckSku(value);
                            //     console.log(
                            //         "isFieldValidating inside promise",
                            //         isFieldValidating,
                            //     );
                            //     if (!isFieldValidating) return res(true);
                            // });
                        },
                    })}
                />
                <InputRightElement>
                    {isFieldValidating && (
                        <Spinner size={"sm"} speed="0.5s" color="green.500" />
                    )}
                    {/* {formSta('sku').} */}

                    {/* <CheckIcon color="green.500" /> */}
                </InputRightElement>
            </InputGroup>
            <FormErrorMessage>
                {(errors as any)?.sku?.message as string}
            </FormErrorMessage>
        </FormControl>
    );
};

VariantForm.Price = () => {
    const {
        formState: { errors },
        register,
    } = useFormContextProvider();

    return (
        <FormControl mb="3" isInvalid={!!(errors as any)?.price}>
            <FormLabel>Giá tiền</FormLabel>
            <InputGroup>
                <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    fontSize="1.2em"
                    children="$"
                />
                <Input
                    type="number"
                    {...register("price", {
                        required: "This field is required",
                        valueAsNumber: true,
                        validate: (v) =>
                            v > 0 || "Giá tiền không được nhỏ hơn 0",
                    })}
                />
            </InputGroup>

            <FormErrorMessage>
                {(errors as any)?.price?.message as string}
            </FormErrorMessage>
        </FormControl>
    );
};

VariantForm.Images = () => {
    const {
        imagesField: { fields },
    } = useFormContextProvider();

    return (
        <>
            {true && (
                <div className="">
                    <div className="h-[300px] text-center border max-w-[300px] mx-auto">
                        Upload image here
                    </div>
                </div>
            )}
            {!!fields.length && (
                <div className="flex gap-2 p-2 items-center justify-center">
                    {fields.slice(0, 3).map(({ id, image }) => (
                        <Image
                            key={id}
                            src={image}
                            objectFit={"cover"}
                            boxSize={"100px"}
                        />
                    ))}

                    {fields.length > 3 && <ViewMoreImageModal />}
                </div>
            )}
        </>
    );
};

function ViewMoreImageModal() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        imagesField: { fields, remove },
    } = useFormContextProvider();
    return (
        <>
            <Button onClick={onOpen}>....</Button>
            <Modal isOpen={isOpen} onClose={onClose} size="lg">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Hình ảnh sản phẩm</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <div className="flex gap-2 flex-wrap">
                            {fields.map(({ id, image }) => (
                                <Image
                                    key={id}
                                    src={image}
                                    boxSize={"200px"}
                                    objectFit={"contain"}
                                />
                            ))}
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
type AttributeOptionGroup = {
    name: string;
    values: Option<{ name: string; value: string }>[];
};
VariantForm.Options = () => {
    const { distinctAttributesByProduct } = API["products"]();
    const {
        variant,
        control,
        resetField,
        productResponse: {
            data: { data: product } = {},
            isFetching: productFetching,
        },
        formState: { errors },
    } = useFormContextProvider();
    const {
        data: { data: optionsData } = {},
        isFetching,
        ...props
    } = useCustom<{ name: string; values: string[] }[]>({
        url: distinctAttributesByProduct(product?.id),
        method: "get",
        queryOptions: {
            enabled: !!product?.id,
        },
    });
    const [options, setOptions] = useState<AttributeOptionGroup[]>([]);
    useEffect(() => {
        if (optionsData) {
            const updateOptions = optionsData.map((item) => {
                const values = item.values.map((value) => ({
                    label: value,
                    value: { name: item.name, value },
                }));
                return {
                    name: item.name,
                    values,
                };
            });
            setOptions(updateOptions);
            resetField(`attributes`);
        }
    }, [optionsData]);

    return (
        <SkeletonText isLoaded={!isFetching} h={"150px"}>
            {!!!options.length && (
                <>
                    <FormLabel>Tuỳ chọn</FormLabel>
                    <div className="border">
                        <div className="flex flex-col justify-center items-center h-[150px]">
                            <Inbox className="w-[100px] text-zinc-600" />
                            <p className="text-sm text-muted-foreground">
                                Không có dữ liệu
                            </p>
                        </div>
                    </div>
                </>
            )}
            {!!options.length && (
                <div about="option">
                    <FormLabel>Tuỳ chọn</FormLabel>
                    <div className="grid grid-cols-2 gap-4">
                        {options.map((option, idx) => (
                            <div
                                key={option.name}
                                className={`${
                                    options.length % 2 !== 0 &&
                                    idx === options.length - 1
                                        ? "col-span-2"
                                        : ""
                                }`}
                            >
                                <AttributeSelect index={idx} option={option} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </SkeletonText>
    );
};

const AttributeSelect = ({
    index: idx,
    option: { name, values },
}: {
    option: AttributeOptionGroup;
    index: number;
}) => {
    const {
        variant,
        control,
        resetField,
        formState: { errors },
    } = useFormContextProvider();

    useEffect(() => {
        if (variant && variant.attributes) {
            const { attributes } = variant;
            const current = attributes.find((item) => item.name === name);
            if (!current) return;
            resetField(`attributes.${idx}`, {
                defaultValue: {
                    label: current.value,
                    value: {
                        name: name,
                        value: current.value,
                    },
                },
            });
        }
    }, [variant]);
    return (
        <FormControl isInvalid={!!errors.attributes?.[idx]}>
            <p>{name}</p>
            <Controller
                render={({ field }) => (
                    <Select
                        options={values ?? ([] as any)}
                        {...field}
                        defaultValue={undefined}
                    />
                )}
                control={control}
                name={`attributes.${idx}`}
                rules={{
                    required: "Vui lòng thêm tuỳ chọn.",
                }}
            />
            <FormErrorMessage>
                {errors.attributes?.[idx]?.message as string}
            </FormErrorMessage>
        </FormControl>
    );
};

VariantForm.Container = ({ children }: PropsWithChildren) => {
    const {
        action,
        formState: { isLoading },
        saveButtonProps,
    } = useFormContextProvider();
    const isCreate = action === "create";
    const isEdit = action === "edit";

    if (isCreate)
        return (
            <Create isLoading={isLoading} saveButtonProps={saveButtonProps}>
                {children}
            </Create>
        );
    if (isEdit)
        return (
            <Edit isLoading={isLoading} saveButtonProps={saveButtonProps}>
                {children}
            </Edit>
        );
};

type ContextProps = {
    productResponse: ReturnType<typeof useOne<IProduct>>;
    imagesField: UseFieldArrayReturn<IVariantField, "images", "id">;
    variant: IVariant | undefined;
    handleFormSubmit: () => void;
    paramProductId: string | null;
    productId: string | undefined;
} & FormProps &
    ReturnType<typeof useForm<IVariant, HttpError, IVariantField>>;

const Context = createContext<ContextProps | null>(null);

const useFormContextProvider = () => {
    const ctx = useContext(Context);
    if (!ctx) throw new Error("Create Variant Context Provider is missing");
    return {
        ...ctx,
    };
};

const ContextProvider = ({
    children,
    ...props
}: PropsWithChildren<FormProps>) => {
    const searchParams = useSearchParams();
    const paramProductId = searchParams.get("productId");
    const router = useRouter();
    const formMethods = useForm<IVariant, HttpError, IVariantField>({
        refineCoreProps: {
            resource: variantResource.resource,
            redirect: false,
            meta: {
                query: {
                    projection: variantResource.projection.withSpecs,
                },
            },
            onMutationSuccess(data, variables, context) {
                console.log("on mutation success");
                setTimeout(router.back, 500);
            },
        },
    });
    const {
        control,
        handleSubmit,
        watch,
        saveButtonProps: saveProps,
        refineCore: { onFinish, queryResult },
    } = formMethods;
    const imagesField = useFieldArray({
        control,
        name: "images",
    });
    const variant = queryResult?.data?.data;
    const productId =
        variant?.product?.id ?? paramProductId ?? watch("product")?.value.id;
    const productResponse = useOne<IProduct>({
        resource: productResource.resource,
        id: +productId,
        queryOptions: {
            enabled: !!productId,
        },
    });

    //done: check if sku is not exists
    //TODO: convert images to images attribute
    //FIXME: check if save button props redirect correctly
    //IGNORE: check if there are other variants that are the same
    const handleFormSubmit = handleSubmit(async (formValues: IVariantField) => {
        const {
            sku,
            price,
            attributes: formAttributes,
            images,
            product: { value: product },
        } = formValues;
        let attributes: { name: string; value: string }[] = [];

        if (formAttributes) {
            attributes = formAttributes.map(({ value: { name, value } }) => ({
                name,
                value,
            }));
        }
        const value = {
            sku,
            price,
            attributes,
            product: {
                id: product.id,
            },
        };
        console.log("value", value);
        await onFinish({ ...(value as any) });
        console.log("after on finish success");
    });

    const saveButtonProps = {
        ...saveProps,
        onClick: (e: any) => {
            console.log("save button clicked");
            handleFormSubmit(e);
            // saveProps.onClick(e);
        },
    };

    const contextValue: ContextProps = {
        ...props,
        ...formMethods,
        handleFormSubmit,
        saveButtonProps,
        productResponse,
        imagesField,
        paramProductId,
        productId,
        variant,
    };

    return (
        <Context.Provider value={contextValue}>
            <VariantForm.Container>{children}</VariantForm.Container>
        </Context.Provider>
    );
};
