"use client";

import {
    useShow,
    IResourceComponentsProps,
    useOne,
    useList,
} from "@refinedev/core";
import {
    CreateButton,
    NumberField,
    Show,
    TagField,
    TextField,
} from "@refinedev/chakra-ui";
import {
    Box,
    Button,
    Center,
    Flex,
    Grid,
    GridItem,
    HStack,
    Heading,
    Image,
    Input,
    Stack,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    TableCaption,
    Tabs,
    Tbody,
    Td,
    Text,
    Textarea,
    Tfoot,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import React, {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { List } from "@refinedev/chakra-ui";
import { TableContainer, Table } from "@chakra-ui/react";
import { API, IProduct, IVariant } from "types";
import { useDefaultTableRender } from "@/hooks/useRenderTable";
import { cleanUrl, updateUrlParams } from "@/lib/utils";
import { variantTableColumns } from "app/admin/products/variants/(list)/page";
import { PropsWithChildren } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Rating } from "@smastrom/react-rating";
import { BiChevronDownCircle } from "react-icons/bi";
import { ChevronDown, ChevronUp } from "lucide-react";

const ProductShowPage = () => {
    return (
        <>
            <ContextProvider>
                <ProductShow />
            </ContextProvider>
        </>
    );
};

export const ProductShow: React.FC<IResourceComponentsProps> = () => {
    const {
        queryResult: { isLoading },
        record,
        tabIndex,
        handleTabChange,
    } = useContextProvider();
    const { resource } = API["variants"]();
    return (
        <Show isLoading={isLoading} canEdit={tabIndex === 0}>
            <Tabs
                variant={"solid-rounded"}
                isLazy
                index={tabIndex}
                onChange={handleTabChange}
            >
                <div className="flex justify-between">
                    <TabList>
                        <Tab>Sản phẩm</Tab>
                        <Tab>Phiên bản sản phẩm</Tab>
                    </TabList>
                    <CreateButton
                        resource={resource}
                        meta={{
                            query: {
                                product: 1,
                            },
                        }}
                    >
                        Thêm
                    </CreateButton>
                </div>

                <TabPanels>
                    <TabPanel>
                        <ProductInfo />
                    </TabPanel>
                    <TabPanel>
                        <VariantListByProduct />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Show>
    );
};

const ProductInfo = () => {
    const { record } = useContextProvider();
    return (
        <>
            <div className="bg-white">
                <Grid
                    templateRows="repeat(1, 1fr)"
                    templateColumns="repeat(3, 1fr)"
                    gap={4}
                >
                    <GridItem rowSpan={2} colSpan={1}>
                        <Flex
                            justify="center"
                            alignItems="center"
                            flexDirection="column"
                            p={3}
                        >
                            <Box
                                mb={8}
                                className="overflow-x-auto shadow-bannerShadow sm:rounded-lg"
                            >
                                <Image
                                    sx={{ maxWidth: 280 }}
                                    src={record?.thumbnail}
                                />
                            </Box>

                            <ProductInfo.AvgRating />
                            <ProductInfo.ReviewCount />
                        </Flex>
                    </GridItem>
                    <GridItem rowSpan={2} colSpan={2}>
                        <Box p={4} mb={10}>
                            <Flex>
                                <ProductInfo.Id />
                                <ProductInfo.Name />
                            </Flex>
                            <ProductInfo.Summary />
                            <ProductInfo.Features />
                        </Box>
                    </GridItem>
                    <GridItem rowSpan={2} colSpan={6}>
                        <Box pr={16}>
                            <Box mb={10}>
                                <ProductInfo.Description />
                            </Box>
                        </Box>
                    </GridItem>
                </Grid>
            </div>
        </>
    );
};

ProductInfo.Id = () => {
    const { record } = useContextProvider();

    return (
        <Box mb="10" mr="10">
            <Box pos="relative">
                <div>
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
                        fontWeight="bold"
                        zIndex="2"
                    >
                        Id
                    </Text>
                    <Input fontWeight="medium" value={record?.id ?? ""} />
                </div>
            </Box>
        </Box>
    );
};

ProductInfo.Name = () => {
    const { record } = useContextProvider();

    return (
        <Box mb="5">
            <Box pos="relative">
                <div>
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
                        fontWeight="bold"
                        zIndex="2"
                    >
                        Tên
                    </Text>
                    <Input
                        className="font-bold "
                        fontWeight="medium"
                        value={record?.name ?? ""}
                    />
                </div>
            </Box>
        </Box>
    );
};

ProductInfo.ReviewCount = () => {
    const { record } = useContextProvider();

    return (
        <Box mb="10">
            <Box pos="relative">
                <div>
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
                        fontWeight="bold"
                        zIndex="2"
                    >
                        Số lượng lượt đánh giá
                    </Text>
                    <Input
                        textAlign="center"
                        fontWeight="medium"
                        value={record?.id ?? ""}
                    />
                </div>
            </Box>
        </Box>
    );
};

ProductInfo.AvgRating = () => {
    const { record } = useContextProvider();

    return (
        <Box mb="5">
            <Box pos="relative">
                <Flex alignItems="center">
                    <Rating
                        style={{ maxWidth: 180 }}
                        value={
                            typeof record?.avgRating === "number"
                                ? parseInt(record?.avgRating.toString())
                                : 0
                        }
                        readOnly
                    />
                    {/* <NumberField value={record?.reviewCount ?? ""} /> */}
                </Flex>
            </Box>
        </Box>
    );
};

ProductInfo.Summary = () => {
    const { record } = useContextProvider();

    return (
        <Box mb="10">
            <Box pos="relative">
                <div>
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
                        fontWeight="bold"
                        zIndex="2"
                    >
                        Mô tả sản phẩm
                    </Text>
                    <Textarea
                        fontWeight="medium"
                        h="269px"
                        value={record?.summary ?? ""}
                    />
                </div>
            </Box>
        </Box>
    );
};
ProductInfo.Features = () => {
    const { record } = useContextProvider();

    return (
        <Box>
            <Box pos="relative">
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
                    fontWeight="bold"
                    zIndex="2"
                >
                    Tính năng nổi bật
                </Text>
                <div className="overflow-x-auto overflow-y-auto shadow-bannerShadow sm:rounded-lg max-h-[310px]">
                    <Table
                        className="w-full normal-case text-base text-left dark:bg-gray-700"
                        fontWeight="medium"
                    >
                        <Tbody>
                            {record?.features?.map((feature, index) => (
                                <Tr key={index}>
                                    <Td>
                                        <TextField value={feature} />
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </div>
            </Box>
        </Box>
    );
};

ProductInfo.Description = () => {
    const { record } = useContextProvider();

    return (
        <Box mb="10">
            <Box pos="relative">
                <div>
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
                        fontWeight="bold"
                        zIndex="2"
                    >
                        Bài đăng
                    </Text>
                    <Textarea
                        fontWeight="medium"
                        h="313px"
                        value={record?.description ?? ""}
                    />
                </div>
            </Box>
        </Box>
    );
};

const VariantListByProduct: React.FC<IResourceComponentsProps> = () => {
    const {
        record: product,
        tabIndex,
        variantTable: { headers, body },
    } = useContextProvider();

    return (
        <TableContainer whiteSpace="pre-line">
            <Table variant="simple">
                {headers}
                {body}
            </Table>
        </TableContainer>
    );
};

type State = {
    record: IProduct | undefined;
    tabIndex: number;
    handleTabChange: (index: number) => void;
    variantTable: {
        headers: JSX.Element | JSX.Element[];
        body: JSX.Element | JSX.Element[];
    };
} & ReturnType<typeof useShow<IProduct>>;

const Context = createContext<State | null>(null);
const useContextProvider = () => {
    const ctx = useContext(Context);
    if (!ctx) throw new Error("Context Provider is missing");
    return ctx;
};

const ContextProvider = ({ children }: PropsWithChildren) => {
    const showProps = useShow<IProduct>();
    const { data: { data: record } = {} } = showProps.queryResult;

    const { replace, push } = useRouter();
    const params = useSearchParams();
    const pathname = usePathname();

    const tabParam = params.get("tab");
    const [tabIndex, setTabIndex] = useState<number>(
        tabParam && tabParam == "1" ? 1 : 0,
    );

    const syncUrl = (index: number) => {
        const values = {
            tab: `${index}`,
        };
        const updateParams = updateUrlParams(values, params);
        const search = updateParams ? `?${updateParams}` : "";
        const url = `${pathname}${search}`;
        // push(url);
    };

    const handleTabChange = (index: number) => {
        setTabIndex(() => index);
        // syncUrl(index);
    };

    const columns = React.useMemo<ColumnDef<IVariant>[]>(
        () => variantTableColumns,
        [],
    );

    const {
        resource,
        projection: { withAttributes: projection },
    } = API["variants"]();
    const {
        getHeaderGroups,
        getRowModel,
        setOptions,
        refineCore: {
            tableQueryResult: { data: tableData },
        },
    } = useTable<IVariant>({
        columns,
        refineCoreProps: {
            resource,
            pagination: {
                mode: "off",
            },
            queryOptions: {
                enabled: !!record,
            },
            meta: {
                url: cleanUrl(record?._links?.variants.href ?? ""),
                query: {
                    projection,
                },
            },
        },
    });

    setOptions((prev) => ({
        ...prev,
        meta: {
            ...prev.meta,
        },
    }));

    const { headers, body } = useDefaultTableRender({
        rowModel: getRowModel(),
        headerGroups: getHeaderGroups(),
    });

    return (
        <Context.Provider
            value={{
                ...showProps,
                record,
                tabIndex,
                handleTabChange,
                variantTable: {
                    headers,
                    body,
                },
            }}
        >
            {children}
        </Context.Provider>
    );
};

const useVariantTable = () => {};
export default ProductShowPage;
