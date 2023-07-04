"use client";

import React from "react";
import { IResourceComponentsProps } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import { List, EditButton, ShowButton, DateField } from "@refinedev/chakra-ui";
import {
    TableContainer,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    HStack,
} from "@chakra-ui/react";
import { IInventory } from "types";
import { Pagination } from "@components/pagination";

export default function ListPage() {
    // return <ChakraUIListInferencer />;
    return <InventoryList />;
}

const InventoryList: React.FC<IResourceComponentsProps> = () => {
    const columns = React.useMemo<ColumnDef<IInventory>[]>(
        () => [
            {
                id: "id",
                accessorKey: "id",
                header: "Id",
            },
            {
                id: "createdBy",
                accessorKey: "createdBy",
                header: "Tạo bởi",
            },
            {
                id: "totalQuantity",
                accessorKey: "totalQuantity",
                header: "Số Lượng",
            },
            {
                id: "lastModifiedBy",
                accessorKey: "lastModifiedBy",
                header: "Cập nhật bởi",
                cell: function render({ getValue, row }) {
                    return getValue<any>() ?? row.original.createdBy;
                },
            },
            // {
            //     id: "createdDate",
            //     accessorKey: "createdDate",
            //     header: "Created Date",
            //     cell: function render({ getValue }) {
            //         return <DateField value={getValue<any>()} />;
            //     },
            // },
            {
                id: "lastModifiedDate",
                accessorKey: "lastModifiedDate",
                header: "Thời gian",
                cell: function render({ getValue }) {
                    return <DateField value={getValue<any>()} />;
                },
            },
            {
                id: "actions",
                accessorKey: "id",
                header: "Actions",
                cell: function render({ getValue }) {
                    return (
                        <HStack>
                            <ShowButton
                                hideText
                                recordItemId={getValue() as string}
                            />
                            {/* <EditButton
                                hideText
                                recordItemId={getValue() as string}
                            /> */}
                        </HStack>
                    );
                },
            },
        ],
        [],
    );

    const {
        getHeaderGroups,
        getRowModel,
        setOptions,
        refineCore: {
            setCurrent,
            pageCount,
            current,
            pageSize,
            setPageSize,
            tableQueryResult: { data: tableData },
        },
    } = useTable({
        columns,
    });

    setOptions((prev) => ({
        ...prev,
        meta: {
            ...prev.meta,
        },
    }));

    return (
        <List>
            <TableContainer whiteSpace="pre-line">
                <Table variant="simple">
                    <Thead>
                        {getHeaderGroups().map((headerGroup) => (
                            <Tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <Th key={header.id}>
                                        {!header.isPlaceholder &&
                                            flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                    </Th>
                                ))}
                            </Tr>
                        ))}
                    </Thead>
                    <Tbody>
                        {getRowModel().rows.map((row) => (
                            <Tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <Td key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </Td>
                                ))}
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
            <Pagination
                current={current}
                pageCount={pageCount}
                setCurrent={setCurrent}
                pageSize={pageSize}
                setPageSize={setPageSize}
            />
        </List>
    );
};
