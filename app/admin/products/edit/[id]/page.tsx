"use client";
import { useForm } from "@refinedev/react-hook-form";
import React, {
    FormEvent,
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { Edit, List } from "@refinedev/chakra-ui";
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Button,
    Text,
    Card,
    CardBody,
    CardHeader,
    Heading,
    Icon,
    Stack,
    StackDivider,
    Box,
    Flex,
    TableContainer,
    Table,
    TableCaption,
    Tbody,
    Td,
    Tfoot,
    Th,
    Thead,
    Tr,
    Textarea,
    Grid,
    HStack,
    Avatar,
    Editable,
    EditableInput,
    EditablePreview,
    IconButton,
    useEditableControls,
    ButtonGroup,
    useEditableContext,
} from "@chakra-ui/react";
import { FiUploadCloud } from "react-icons/fi";
import { API, IBrand, ICategory, IProduct, IProductField } from "types";
import { PropsWithChildren } from "react";

import SelectPopout from "@components/ui/SelectPopout";
import useListOption, { ListOption } from "@/hooks/useListOption";
import {
    Controller,
    FieldArrayWithId,
    UseFieldArrayReturn,
    useFieldArray,
} from "react-hook-form";
import { HttpError, useCustom } from "@refinedev/core";
import { MinusCircle, PlusCircle, Trash } from "lucide-react";
import { products } from "app/api/products/route";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import InlineEditable from "@components/ui/InlineEditable";
import { useHover } from "usehooks-ts";

const EditProduct = () => {
    return (
        <ProductFormProvider>
            <EditForm />
        </ProductFormProvider>
    );
};

const useProductFormContext = () => {
    const context = useContext(FormContext);
    if (!context) {
        throw new Error("FormContext.Provider is missing");
    }
    return {
        ...context,
    };
};
type ContextProps = {
    product: IProduct | undefined;
    specificationArray: UseFieldArrayReturn<
        IProductField,
        "specifications",
        "id"
    >;
} & ReturnType<typeof useForm<IProduct, HttpError, IProductField>>;
const FormContext = createContext<ContextProps | null>(null);
const ProductFormProvider = ({ children }: PropsWithChildren) => {
    const {
        projection: { full },
    } = API["products"]();

    const formMethods = useForm<IProduct, HttpError, IProductField>({
        refineCoreProps: {
            meta: {
                query: {
                    projection: full,
                },
            },
        },
        defaultValues: {
            features: [],
        },
    });
    const {
        handleSubmit,
        control,
        refineCore: { queryResult },
    } = formMethods;

    const specificationArray = useFieldArray({
        control,
        name: "specifications",
    });

    const product = queryResult?.data?.data;

    return (
        <FormContext.Provider
            value={{ ...formMethods, product, specificationArray }}
        >
            {children}
        </FormContext.Provider>
    );
};

const EditForm = () => {
    const {
        handleSubmit,
        formState: { touchedFields },
        refineCore: { formLoading, onFinish },
        getValues,
        saveButtonProps,
        product,
    } = useProductFormContext();
    const { countProductSold } = API["products"]();
    const { data: soldData } = useCustom({
        method: "get",
        url: countProductSold(product?.id ?? ""),
        queryOptions: {
            enabled: !!product,
        },
    });

    return (
        <Edit
            isLoading={formLoading}
            canDelete={soldData && (soldData.data as unknown as number) == 0}
            saveButtonProps={{
                ...saveButtonProps,
                onClick: (e) => {
                    console.log("touchedFields", touchedFields);
                    console.log("getValues()", getValues());
                    handleSubmit(
                        async ({
                            brand,
                            category,
                            features,
                            specifications,
                            id,
                            ...value
                        }) => {
                            let brandId,
                                categoryId,
                                updatedFeatures,
                                updatedSpecification;
                            if (brand && "value" in brand) {
                                brandId = brand.value.id;
                            }
                            if (category && "value" in category) {
                                categoryId = category.value.id;
                            }
                            if (features && touchedFields.features) {
                                updatedFeatures = features
                                    .filter((item) => !!item)
                                    .map(({ value }) => value);
                            }
                            if (
                                specifications &&
                                touchedFields.specifications
                            ) {
                                updatedSpecification = specifications
                                    .filter((item) => !!item)
                                    .reduce((prev, { key, value }) => {
                                        prev[key] = value;
                                    }, {} as any);
                            }
                            const updatedValue = {
                                ...value,
                                ...(brandId && {
                                    brand: { id: brandId },
                                }),
                                ...(categoryId && {
                                    category: { id: categoryId },
                                }),
                                ...(updatedFeatures && {
                                    features: updatedFeatures,
                                }),
                                ...(updatedSpecification && {
                                    specifications: updatedSpecification,
                                }),
                            };

                            // const result = await onFinish(updatedValue);
                            console.log("result", updatedValue);
                            console.log("value", value);
                        },
                    )();
                },
            }}
        >
            <div className="bg-gray-100">
                <div className={`grid grid-cols-2`}>
                    <ImageUpload />
                    <Stack>
                        <EditForm.Id />
                        <EditForm.Name />
                        <EditForm.Summary />
                        <EditForm.Brand />
                        <EditForm.Category />
                    </Stack>
                </div>
                <EditForm.Features />
                <EditForm.Specification />
                <EditForm.Description />
            </div>
        </Edit>
    );
};

EditForm.Id = () => {
    const {
        register,
        formState: { errors },
    } = useProductFormContext();
    return (
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
    );
};

EditForm.Name = () => {
    const {
        register,
        formState: { errors },
    } = useProductFormContext();

    return (
        <FormControl mb="3" isInvalid={!!(errors as any)?.name}>
            <FormLabel>Name</FormLabel>
            <Input
                type="text"
                {...register("name", {
                    required: "This field is required",
                })}
            />
            <FormErrorMessage>
                {(errors as any)?.name?.message as string}
            </FormErrorMessage>
        </FormControl>
    );
};

EditForm.Summary = () => {
    const {
        register,
        formState: { errors },
    } = useProductFormContext();

    return (
        <FormControl mb="3" isInvalid={!!(errors as any)?.summary}>
            <FormLabel>Mô tả sản phẩm</FormLabel>
            <Input
                type="text"
                {...register("summary", {
                    required: "This field is required",
                })}
            />
            <FormErrorMessage>
                {(errors as any)?.summary?.message as string}
            </FormErrorMessage>
        </FormControl>
    );
};

EditForm.Brand = () => {
    const { resource } = API["brands"]();
    const { product, setValue } = useProductFormContext();

    const { options } = useListOption<IBrand, string, IBrand>({
        resource,
        pagination: {
            mode: "off",
        },
        toOption(item) {
            return {
                label: item.name,
                value: item,
            };
        },
        queryOptions: {
            enabled: !!product,
        },
    });

    useEffect(() => {
        if (!product?.brand) {
            return;
        }
        if ("id" in product?.brand) {
            const id = product?.brand?.id;
            if (id) {
                const selected = options.find((item) => item.value.id == +id);
                if (selected) setValue("brand", selected as any);
            }
        }
    }, [product?.brand?.id, options]);

    const { control } = useProductFormContext();
    return (
        <SelectPopout
            controller={{
                name: "brand",
                control,
            }}
            stateLabel={{
                defaultEmpty: `Chọn thương hiệu`,
            }}
            props={{
                options: options,
                noOptionsMessage: "Không có nhãn hàng.",
                formatOptionLabel: (data, meta) => {
                    const {
                        label,
                        value: { logo },
                    } = data as ListOption<string, IBrand>;
                    return (
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Text noOfLines={2}>{label}</Text>

                            <Avatar
                                ml="5"
                                size="sm"
                                variant="filled"
                                name={label}
                                src={logo}
                            />
                        </Box>
                    );
                },
            }}
        />
    );
};

EditForm.Category = () => {
    const { resource } = API["categories"]();
    const { product, control, setValue } = useProductFormContext();
    const { options } = useListOption<ICategory, string, ICategory>({
        resource,
        pagination: {
            mode: "off",
        },
        toOption(item) {
            return {
                label: item.name,
                value: item,
            };
        },
        queryOptions: {
            enabled: !!product,
        },
    });

    useEffect(() => {
        if (!product?.category || !("id" in product.category)) {
            return;
        }
        const id = product?.category?.id;
        if (id) {
            const selected = options.find((item) => item.value.id == id);
            if (selected) setValue("category", selected);
        }
    }, [product?.category, options]);
    return (
        <>
            <FormLabel>Danh mục</FormLabel>
            <SelectPopout
                controller={{
                    name: "category",
                    control,
                }}
                stateLabel={{
                    defaultEmpty: `Chọn danh mục`,
                }}
                props={{
                    options: options,
                    noOptionsMessage: "Không có danh mục.",
                }}
            />
        </>
    );
};

EditForm.Description = () => {
    const {
        register,
        formState: { errors },
    } = useProductFormContext();
    return (
        <FormControl mb="3" isInvalid={!!(errors as any)?.description}>
            <FormLabel>Bài đăng </FormLabel>

            <Textarea
                {...register("description", {
                    required: "This field is required",
                })}
                value={
                    "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facere porro dicta ex! Nobis, voluptatum qui! Asperiores voluptate at, nesciunt necessitatibus facilis sequi ullam eum vero? Totam magni architecto nisi at."
                }
            />
            <FormErrorMessage>
                {(errors as any)?.description?.message as string}
            </FormErrorMessage>
        </FormControl>
    );
};

const ImageUpload = () => {
    return (
        <>
            <Card mb="10">
                <CardHeader>
                    <Heading size="md">Thêm hình ảnh sản phẩm</Heading>
                </CardHeader>
                <CardBody h={200} maxW={"300px"}>
                    <Icon
                        p={10}
                        borderWidth="1px"
                        borderColor={"blackAlpha.700"}
                        color="blackAlpha.700"
                        boxSize="full"
                        as={FiUploadCloud}
                    />
                </CardBody>
            </Card>
        </>
    );
};

EditForm.Specification = () => {
    const {
        specificationArray: { append, fields },
    } = useProductFormContext();
    const addRowHandler = () => {
        append({
            key: "",
            value: "",
        });
    };

    return (
        <>
            <div className="min-h-[300px]">
                Thông số kỹ thuật
                <TableContainer>
                    <Table variant="striped">
                        <Thead>
                            <Tr>
                                <Th>Tên thông số</Th>
                                <Th>Chi tiết</Th>
                                <Th maxW="100px" w="80px"></Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {fields.map((item, idx) => (
                                <SpecificationRow key={item.id} index={idx} />
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
                <Button px="4" onClick={addRowHandler}>
                    +
                </Button>
            </div>
        </>
    );
};

const SpecificationRow = ({
    index,
}: {
    index: number;
    field?: FieldArrayWithId;
}) => {
    const rowRef = useRef(null);
    const rowHover = useHover(rowRef);
    const {
        register,
        control,
        specificationArray: { fields, remove },
    } = useProductFormContext();
    return (
        <Tr ref={rowRef}>
            <Td>
                <Controller
                    render={({ field }) => (
                        <InlineEditable editableProps={field} />
                    )}
                    name={`specifications.${index}.key`}
                    control={control}
                />
            </Td>
            <Td>
                <InlineEditable />
            </Td>
            <td
                onClick={remove.bind(null, index)}
                className={`${rowHover ? "!bg-red-500" : ""} h-full`}
            >
                <div
                    className={`flex items-center justify-center w-full h-full `}
                >
                    {rowHover && (
                        <IconButton
                            boxSize="5"
                            icon={
                                <MinusCircle className="text-white mx-auto" />
                            }
                            textAlign="center"
                            aria-label="Delete row button"
                            variant="unstyled"
                        />
                    )}
                </div>
            </td>

            {/* {!rowHover && <div className="w-5 h-5"></div>} */}
        </Tr>
    );
};
EditForm.Features = () => {
    const { product, control, reset } = useProductFormContext();

    const { fields, remove, append } = useFieldArray({
        control,
        name: "features",
    });
    useEffect(() => {
        if (product?.features) {
            const convert = product.features.map((item) => ({ value: item }));
            console.log("convert", convert);
            reset({
                features: convert,
            });
            console.log("done setting form");
        }
    }, [product]);

    const addFeatureHandler = (e: FormEvent) => {
        e.preventDefault();
        if (!inputRef.current) {
            throw new Error("Input is missing");
        }
        append({ value: inputRef.current.value });
        inputRef.current.value = "";
    };
    const deleteFeatureHandler = (idx: number) => {
        remove(idx);
    };
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <>
            <div className="min-h-[300px] border flex flex-col gap-2">
                Tính năng nổi bật
                <form onSubmit={addFeatureHandler}>
                    <Input
                        type="text"
                        ref={inputRef}
                        placeholder="Thêm tính năng nổi bật cho sản phẩm"
                        required
                    />
                </form>
                {fields.map((feat, idx) => {
                    // <div className="bg-blue-500 text-white">
                    return (
                        <Controller
                            key={feat.id}
                            render={({ field, fieldState, formState }) => (
                                <>
                                    <InlineEditable
                                        editableProps={{
                                            placeholder:
                                                "Thêm tính năng nổi bật 🌟",
                                            defaultValue: field.value,
                                            ...field,
                                        }}
                                        remove={deleteFeatureHandler.bind(
                                            this,
                                            idx,
                                        )}
                                        value={field.value}
                                    />
                                </>
                            )}
                            name={`features.${idx}.value` as const}
                            control={control}
                        />
                    );
                })}
                {/* <IconButton
                    onClick={addFeatureHandler}
                    icon={<PlusCircle />}
                    aria-label="Add new feature button"
                /> */}
            </div>
        </>
    );
};

// const ProductOption = () => {
//     return (
//         <>
//             <FormControl>
//                 <FormLabel>Option</FormLabel>
//                 <Input placeholder="Search for options" />
//                 {/* <NewSelectItem name="Create new option" /> */}
//             </FormControl>
//             <Card>
//                 <CardHeader>
//                     <Heading size="md">Product Options</Heading>
//                 </CardHeader>

//                 <CardBody>
//                     <Stack divider={<StackDivider />} spacing="4">
//                         <OptionItem />
//                         <OptionItem />
//                     </Stack>
//                 </CardBody>
//             </Card>
//         </>
//     );
// };

export default EditProduct;
