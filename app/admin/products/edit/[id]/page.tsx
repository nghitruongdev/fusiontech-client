"use client";
import { useForm } from "@refinedev/react-hook-form";
import React, {
    ChangeEvent,
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
    Box,
    TableContainer,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    Textarea,
    Avatar,
    IconButton,
    useEditableControls,
    ButtonGroup,
    useEditableContext,
    GridItem,
    Grid,
    Flex,
} from "@chakra-ui/react";
import { FiUploadCloud } from "react-icons/fi";
import { API, IBrand, ICategory, IProduct, IProductField } from "types";
import { PropsWithChildren } from "react";

/* The above code is importing the `SelectPopout` component from the `@components/ui` directory. It is
likely used in a TypeScript React project. */
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
import { Inbox } from "lucide-react";

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
        throw new Error("EditProductFormContext.Provider is missing");
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
        shouldFocusError: true,
    });
    const {
        handleSubmit,
        control,
        refineCore: { queryResult },
        reset,
    } = formMethods;

    const specificationArray = useFieldArray({
        control,
        name: "specifications",
    });

    const product = queryResult?.data?.data;
    useEffect(() => {
        if (product) {
            const {
                features,
                specifications,
                name,
                slug,
                summary,
                description,
                thumbnail,
                ...props
            } = product;

            let formFeature, formSpecification;
            if (features) {
                formFeature = features.map((item) => ({
                    value: item,
                }));
            }
            if (specifications) {
                formSpecification = Object.keys(specifications).map((key) => ({
                    key,
                    value: specifications[key],
                }));
            }
            reset({
                name,
                slug,
                summary,
                description,
                thumbnail,
                features: formFeature,
                specifications: formSpecification,
            });
        }
    }, [product]);
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
        formState: { touchedFields, dirtyFields },
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
                    console.log("dirtyFields", dirtyFields);
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
                            if (
                                dirtyFields.brand &&
                                brand &&
                                "value" in brand
                            ) {
                                brandId = brand.value.id;
                            }
                            if (
                                dirtyFields.category &&
                                category &&
                                "value" in category
                            ) {
                                categoryId = category.value.id;
                            }
                            if (features && !!dirtyFields.features) {
                                updatedFeatures = features
                                    .filter((item) => !!item)
                                    .map(({ value }) => value);
                            }
                            if (
                                specifications &&
                                !!dirtyFields.specifications
                            ) {
                                updatedSpecification = specifications
                                    .filter(
                                        ({ key, value }) => !!key && !!value,
                                    )
                                    .reduce((prev, { key, value }) => {
                                        prev[key] = value;
                                        return prev;
                                    }, {} as Record<string, string>);
                            }

                            let updateValue: Record<string, Object> = {};
                            Object.keys(dirtyFields).forEach((key) => {
                                const asKey = key as keyof typeof value;
                                if (dirtyFields[asKey]) {
                                    updateValue[asKey] = value[asKey];
                                }
                            });
                            updateValue = {
                                ...updateValue,
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

                            const result = await onFinish(updateValue as any);
                            console.log("result", updateValue);
                        },
                    )();
                },
            }}
        >
            <div className="bg-white">
                <Grid
                    templateRows="repeat(1, 1fr)"
                    templateColumns="repeat(6, 1fr)"
                    gap={4}
                >
                    <GridItem rowSpan={2} colSpan={2}>
                        <Box p={4}>
                            <Box mb={10}>
                                <ImageUpload />
                            </Box>
                            <EditForm.Id />
                            <EditForm.Name />
                            <div className="flex">
                                <EditForm.Brand />
                                <EditForm.Category />
                            </div>
                            <EditForm.Summary />
                        </Box>
                    </GridItem>

                    <GridItem colSpan={4}>
                        <Box p={4}>
                            <Stack spacing={4}>
                                <EditForm.Features />

                                <EditForm.Specification />
                                {/* <EditForm.Description /> */}
                            </Stack>
                        </Box>
                    </GridItem>
                    <GridItem colSpan={6}>
                        <Box p={4}>
                            <Stack spacing={4}>
                                <EditForm.Description />
                            </Stack>
                        </Box>
                    </GridItem>
                </Grid>
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
        <FormControl mb="5" isInvalid={!!(errors as any)?.id}>
            <Text
                top="-15px"
                left="5px"
                p="0 12px"
                bg="#fff"
                transformOrigin="top left"
                transition="all .2s ease-out"
                color="#999"
                pointerEvents="none"
                pos="absolute"
                w="fit-content"
                h="fit-content"
                zIndex="2"
            >
                Id
            </Text>
            <Input
                // disabled
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
        <Box mb="10">
            <Box pos="relative">
                <FormControl mb="3" isInvalid={!!(errors as any)?.name}>
                    <Text
                        top="-15px"
                        left="5px"
                        p="0 12px"
                        bg="#fff"
                        transformOrigin="top left"
                        transition="all .2s ease-out"
                        color="#999"
                        pointerEvents="none"
                        pos="absolute"
                        w="fit-content"
                        h="fit-content"
                        zIndex="2"
                    >
                        Tên:
                    </Text>
                    <Input
                        type="text"
                        {...register("name", {
                            required: "This field is required",
                        })}
                        w="100%" // Thêm thuộc tính w="100%" để làm cho phần input dài ra
                    />
                    <FormErrorMessage>
                        {(errors as any)?.name?.message as string}
                    </FormErrorMessage>
                </FormControl>
            </Box>
        </Box>
    );
};

EditForm.Summary = () => {
    const {
        register,
        formState: { errors },
    } = useProductFormContext();

    return (
        <Box>
            <Box pos="relative">
                <FormControl mb="3" isInvalid={!!(errors as any)?.summary}>
                    <Text
                        top="-15px"
                        left="5px"
                        p="0 12px"
                        bg="#fff"
                        transformOrigin="top left"
                        transition="all .2s ease-out"
                        color="#999"
                        pointerEvents="none"
                        pos="absolute"
                        w="fit-content"
                        h="fit-content"
                        zIndex="2"
                    >
                        Mô tả sản phẩm
                    </Text>
                    <Textarea
                        {...register("summary", {
                            required: "This field is required",
                        })}
                        h="269px"
                    />
                    <FormErrorMessage>
                        {(errors as any)?.summary?.message as string}
                    </FormErrorMessage>
                </FormControl>
            </Box>
        </Box>
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
        <Box mb="10">
            <Box pos="relative">
                <Text
                    top="-25px"
                    left="-10px"
                    p="0 12px"
                    // bg="#fff"
                    transformOrigin="top left"
                    transition="all .2s ease-out"
                    color="#999"
                    pointerEvents="none"
                    pos="absolute"
                    w="fit-content"
                    h="fit-content"
                    zIndex="2"
                >
                    Thương hiệu:
                </Text>
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
            </Box>
        </Box>
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
            <Box mb="10" ml="10">
                <Box pos="relative">
                    <Text
                        top="-25px"
                        left="-10px"
                        p="0 12px"
                        // bg="#fff"
                        transformOrigin="top left"
                        transition="all .2s ease-out"
                        color="#999"
                        pointerEvents="none"
                        pos="absolute"
                        w="fit-content"
                        h="fit-content"
                        zIndex="2"
                    >
                        Danh mục:
                    </Text>

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
                </Box>
            </Box>
        </>
    );
};

EditForm.Description = () => {
    const {
        register,
        formState: { errors },
    } = useProductFormContext();
    return (
        <Box>
            <Box pos="relative">
                <FormControl mb="3" isInvalid={!!(errors as any)?.description}>
                    <Text
                        top="-15px"
                        left="5px"
                        p="0 12px"
                        bg="#fff"
                        transformOrigin="top left"
                        transition="all .2s ease-out"
                        color="#999"
                        pointerEvents="none"
                        pos="absolute"
                        w="fit-content"
                        h="fit-content"
                        zIndex="2"
                    >
                        Bài đăng
                    </Text>

                    <Textarea
                        {...register("description", {
                            required: "This field is required",
                        })}
                        h="224px"
                    />
                    <FormErrorMessage>
                        {(errors as any)?.description?.message as string}
                    </FormErrorMessage>
                </FormControl>
            </Box>
        </Box>
    );
};
const ImageUpload = () => {
    const {
        register,
        formState: { errors },
    } = useProductFormContext();

    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result === "string") {
                setSelectedImage(reader.result);
            }
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            <div className="flex items-center justify-center w-full">
                <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                >
                    {selectedImage ? (
                        <img
                            src={selectedImage}
                            alt="Uploaded Image"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg
                                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 16"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">
                                    Click to upload
                                </span>{" "}
                                or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                SVG, PNG, JPG or GIF (MAX. 800x400px)
                            </p>
                        </div>
                    )}
                    <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        onChange={handleImageUpload}
                    />
                </label>
            </div>
        </>
    );
};
EditForm.Specification = () => {
    const {
        specificationArray: { append, fields },
    } = useProductFormContext();
    const [showAddButton, setShowAddButton] = useState(fields.length === 0);

    const addRowHandler = () => {
        append({
            key: "",
            value: "",
        });
        setShowAddButton(false);
    };

    useEffect(() => {
        setShowAddButton(fields.length === 0);
    }, [fields]);

    return (
        <Box p="3">
            <Box pos="relative" className="border rounded-lg">
                <div className="min-h-[550px]">
                    <Text
                        top="-15px"
                        left="5px"
                        p="0 12px"
                        bg="#fff"
                        transformOrigin="top left"
                        transition="all .2s ease-out"
                        color="#999"
                        pointerEvents="none"
                        pos="absolute"
                        w="fit-content"
                        h="fit-content"
                        zIndex="2"
                    >
                        Thông số kỹ thuật
                    </Text>
                    <TableContainer>
                        <Table variant="striped" mt="4px">
                            <Thead>
                                <Tr>
                                    <Th textAlign="center">Tên thông số</Th>
                                    <Th textAlign="center">Chi tiết</Th>
                                    <Th maxW="100px" w="80px"></Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {fields.map((item, idx) => (
                                    <SpecificationRow
                                        key={item.id}
                                        index={idx}
                                    />
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                    <Flex justify="center" h="100%" my="2">
                        {showAddButton ? (
                            <Button
                                px="4"
                                onClick={addRowHandler}
                                size="lg"
                                mt="220px"
                                bg="white"
                                _hover={{
                                    pointerEvents: "none",
                                    backgroundColor: "white",
                                }}
                            >
                                <Inbox size="220px" />
                            </Button>
                        ) : (
                            <Button
                                bgColor="red.500"
                                color="white"
                                px="4"
                                onClick={addRowHandler}
                                _hover={{
                                    backgroundColor: "red.600",
                                }}
                            >
                                <PlusCircle />
                            </Button>
                        )}
                    </Flex>
                </div>
            </Box>
        </Box>
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
        formState: { errors },
        specificationArray: { fields, remove },
    } = useProductFormContext();

    return (
        <Tr ref={rowRef}>
            <Td>
                <Controller
                    render={({ field }) => (
                        <InlineEditable
                            editableProps={{
                                ...field,
                                placeholder: "Tên thông số",
                            }}
                        />
                    )}
                    name={`specifications.${index}.key`}
                    control={control}
                />
            </Td>
            <Td>
                <Controller
                    render={({ field }) => (
                        <InlineEditable
                            editableProps={{
                                ...field,
                                placeholder: "Chi tiết thông số",
                                // ...(errors.specifications?.[index] && {
                                //     className: `border border-red-500`,
                                // }),
                            }}
                            isError={!!errors.specifications?.[index]}
                        />
                    )}
                    name={`specifications.${index}.value`}
                    control={control}
                    rules={{
                        validate(value, formValue) {
                            if (
                                !value &&
                                formValue.specifications?.[index]?.key
                            ) {
                                return false;
                            }
                            return true;
                        },
                    }}
                />
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
            <Box p="3">
                <Box
                    pos="relative"
                    className=" rounded-lg min-h-[200px] border flex flex-col gap-2"
                >
                    <Text
                        top="-15px"
                        left="5px"
                        p="0 12px"
                        bg="#fff"
                        transformOrigin="top left"
                        transition="all .2s ease-out"
                        color="#999"
                        pointerEvents="none"
                        pos="absolute"
                        w="fit-content"
                        h="fit-content"
                        zIndex="2"
                    >
                        Thêm tính năng nổi bật
                    </Text>
                    <div>
                        <form onSubmit={addFeatureHandler}>
                            <Input type="text" ref={inputRef} required />
                        </form>
                    </div>
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
                </Box>
            </Box>
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
