"use client";

import {
    useShow,
    IResourceComponentsProps,
    useOne,
    useList,
} from "@refinedev/core";
import { CreateButton, Show } from "@refinedev/chakra-ui";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
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
import { variantTableColumns } from "app/admin/variants/(list)/page";
import { PropsWithChildren } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
    return (
        <>
            {/* <div className="grid grid-cols-2">
                <div>
                    <Heading as="h5" size="sm" mt={4}>
                        Thumbnail
                    </Heading>
                    <Image sx={{ maxWidth: 200 }} src={record?.thumbnail} />
                </div>
                <div className="">
                    <Heading as="h5" size="sm" mt={4}>
                        Id
                    </Heading>
                    <NumberField value={record?.id ?? ""} />
                    <Heading as="h5" size="sm" mt={4}>
                        Name
                    </Heading>
                    <TextField value={record?.name} />
                    <Heading as="h5" size="sm" mt={4}>
                        Summary
                    </Heading>
                    <TextField value={record?.summary} />

                    <TextField value={record?.description} />
                    <Heading as="h5" size="sm" mt={4}>
                        Review Count
                    </Heading>
                    <NumberField value={record?.reviewCount ?? ""} />
                    <Heading as="h5" size="sm" mt={4}>
                        Avg Rating
                    </Heading>
                    <NumberField value={record?.avgRating ?? ""} />
                    <Heading as="h5" size="sm" mt={4}>
                        Features
                    </Heading>
                    <HStack spacing="12px">
                        {record?.features?.map((item: any) => (
                            <TagField value={item} key={item} />
                        ))}
                    </HStack>
                    <Heading as="h5" size="sm" mt={4}>
                        Description
                    </Heading>
                </div>
            </div> */}
        </>
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
