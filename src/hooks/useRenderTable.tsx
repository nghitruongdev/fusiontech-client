import { Tr, Th, Td, Thead, Tbody } from "@chakra-ui/react";
import { Pagination, PaginationProps } from "@components/pagination";
import { HeaderGroup, RowModel, flexRender } from "@tanstack/react-table";

type Props<T> = {
    rowModel: RowModel<T>;
    headerGroups: HeaderGroup<T>[];
    includeContainer?: boolean;
    pagination?: PaginationProps;
};
export function useDefaultTableRender<T>({
    rowModel,
    headerGroups,
    pagination,
    includeContainer = true,
}: Props<T>) {
    const headersComponent = headerGroups.map((headerGroup) => (
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
    ));

    const bodyComponent = rowModel.rows.map((row) => (
        <Tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
                <Td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
            ))}
        </Tr>
    ));
    const paginationComponent = pagination ? (
        <Pagination {...pagination} />
    ) : (
        <></>
    );

    if (includeContainer) {
        return {
            headers: <Thead>{headersComponent}</Thead>,
            body: <Tbody>{bodyComponent}</Tbody>,
            pagination: paginationComponent,
        };
    }
    return {
        headers: headersComponent,
        body: bodyComponent,
        pagination: paginationComponent,
    };
    //  <Thead>

    //  </Thead>;
}
