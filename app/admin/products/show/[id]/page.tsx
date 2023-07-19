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
    Tabs,
    Text,
    Textarea,
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
                    templateColumns="repeat(4, 1fr)"
                    gap={4}
                >
                    <GridItem rowSpan={2} colSpan={2}>
                        <Flex
                            justify="center"
                            alignItems="center"
                            flexDirection="column"
                            p={4}
                        >
                            <Box mb={10}>
                                <Image
                                    sx={{ maxWidth: 200 }}
                                    src={record?.thumbnail}
                                />
                            </Box>
                            <ProductInfo.AvgRating />
                        </Flex>
                    </GridItem>
                    <GridItem rowSpan={2} colSpan={2}>
                        <Box p={4}>
                            <Box mb={10}>
                                <ProductInfo.Id />
                                <ProductInfo.Name />
                                <ProductInfo.ReviewCount />
                                <ProductInfo.Summary />
                            </Box>
                        </Box>
                    </GridItem>

                    <GridItem colSpan={4}>
                        <Box p={4}>
                            <Stack spacing={4}></Stack>
                        </Box>
                    </GridItem>
                    <GridItem colSpan={6}>
                        <Box p={4}>
                            <Stack spacing={4}>
                                <Heading as="h5" size="sm" mt={4}>
                                    Features
                                </Heading>
                                <TextField
                                    bgColor="red.700"
                                    value={record?.features}
                                />

                                <ProductInfo.Description />
                            </Stack>
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
                        zIndex="2"
                    >
                        Id
                    </Text>
                    <Input value={record?.id ?? ""} />
                </div>
            </Box>
        </Box>
    );
};

ProductInfo.Name = () => {
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
                        zIndex="2"
                    >
                        Tên
                    </Text>
                    <Input value={record?.name ?? ""} />
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
                        zIndex="2"
                    >
                        Số lượng lượt đánh giá
                    </Text>
                    <Input value={record?.id ?? ""} />
                </div>
            </Box>
        </Box>
    );
};

ProductInfo.AvgRating = () => {
    const { record } = useContextProvider();

    return (
        <Box mb="10">
            <Box pos="relative">
                <div>
                    <Rating
                        style={{ maxWidth: 180 }}
                        value={
                            typeof record?.avgRating === "number"
                                ? parseInt(record?.avgRating.toString())
                                : 0
                        }
                        readOnly
                    />
                </div>
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
                        zIndex="2"
                    >
                        Mô tả sản phẩm
                    </Text>
                    <Textarea h="269px" value={record?.summary ?? ""} />
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
                        zIndex="2"
                    >
                        Bài đăng
                    </Text>
                    <Textarea h="269px" value={record?.description ?? ""} />
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
