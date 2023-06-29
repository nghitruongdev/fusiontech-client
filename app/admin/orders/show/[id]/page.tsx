"use client";

import {
    useShow,
    IResourceComponentsProps,
    useOne,
    useCustom,
} from "@refinedev/core";
import { Show, NumberField, TextField, DateField } from "@refinedev/chakra-ui";
import {
    Heading,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Tfoot,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";

export default function OrderShowPage() {
    return <OrderShow />;
}
const OrderShow: React.FC<IResourceComponentsProps> = () => {
    const {
        order: { isLoading },
    } = useData();
    return (
        <Show isLoading={isLoading}>
            <OrderDetailSummary className="" />
            <OrderItemList className="" />
        </Show>
    );
};

const OrderDetailSummary = ({ className }: { className?: string }) => {
    const {
        user,
        payment,
        order: { data, isLoading },
    } = useData();

    const record = data?.data;
    return (
        <div className={className}>
            <Heading as="h5" size="sm" mt={4}>
                Id
            </Heading>
            <NumberField value={record?.id ?? ""} />
            <Heading as="h5" size="sm" mt={4}>
                Note
            </Heading>
            <TextField value={record?.note} />
            <Heading as="h5" size="sm" mt={4}>
                Email
            </Heading>
            <TextField value={record?.email} />
            <Heading as="h5" size="sm" mt={4}>
                Purchased At
            </Heading>
            <DateField value={record?.purchasedAt} />
            <Heading as="h5" size="sm" mt={4}>
                Status
            </Heading>
            <TextField value={record?.status} />
            <Heading as="h5" size="sm" mt={4}>
                User
            </Heading>
            {user.isLoading ? (
                <>Loading...</>
            ) : (
                <>{JSON.stringify(user.data?.data)}</>
            )}
            <Heading as="h5" size="sm" mt={4}>
                Payment
            </Heading>
            {payment.isLoading ? (
                <>Loading...</>
            ) : (
                <>{JSON.stringify(payment.data?.data)}</>
            )}
        </div>
    );
};

const OrderItemList = ({ className }: { className?: string }) => {
    const {
        items: { data, isLoading },
    } = useData();
    const items = data?.data;
    if (isLoading) return <div className={className}>Loading table...</div>;
    return (
        <div className={className}>
            <TableContainer>
                <Table variant="simple">
                    <TableCaption>Chi tiết đơn hàng</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>To convert</Th>
                            <Th>into</Th>
                            <Th isNumeric>multiply by</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Td>inches</Td>
                            <Td>millimetres (mm)</Td>
                            <Td isNumeric>25.4</Td>
                        </Tr>
                    </Tbody>
                    {/* <Tfoot>
                        <Tr>
                            <Th>To convert</Th>
                            <Th>into</Th>
                            <Th isNumeric>multiply by</Th>
                        </Tr>
                    </Tfoot> */}
                </Table>
            </TableContainer>
        </div>
    );
};

const useData = () => {
    const { queryResult } = useShow();

    const record = queryResult.data?.data;

    const user = useOne({
        resource: "users",
        id: record?.userId || "",
        queryOptions: {
            enabled: !!record,
        },
    });

    const payment = useOne({
        resource: "payments",
        id: record?.paymentId || "",
        queryOptions: {
            enabled: !!record,
        },
    });

    const items = useCustom({
        url: record?._links?.items.href || "",
        method: "get",
        meta: {
            _embeddedResource: "orderItems",
        },
    });

    return {
        order: queryResult,
        user,
        payment,
        items,
    };
};
