"use client";

import {
    useShow,
    IResourceComponentsProps,
    useOne,
    useCustom,
    useMany,
} from "@refinedev/core";
import { Show, NumberField, TextField, DateField } from "@refinedev/chakra-ui";
import {
    Heading,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import { IOrderItem, IVariant } from "types";
import Image from "next/image";
import { loginImg } from "@public/assets/images";

export default function ShowPage() {
    return <OrderShow />;
}
const OrderShow: React.FC<IResourceComponentsProps> = () => {
    const {
        order: { isLoading },
    } = useData();
    return (
        <Show isLoading={isLoading}>
            <OrderDetailSummary className="" />
            <OrderItemList className="mt-4 shadow-md rounded-md" />
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
        variants: { data: variantData, isLoading: isVariantLoading },
    } = useData();
    const items = data?.data;
    const variants = variantData?.data;

    if (isLoading) return <div className={className}>Loading table...</div>;
    if (!!items?.length)
        return (
            <div className={className}>
                <TableContainer
                    rounded="md"
                    border="1px"
                    borderColor="gray.100"
                >
                    <Table variant="simple">
                        <TableCaption>
                            Chi tiết đơn hàng {`(${items.length} sản phẩm)`}
                        </TableCaption>
                        <Thead>
                            <Tr>
                                <Th>ID</Th>
                                <Th>Hình ảnh</Th>
                                <Th>Mã sản phẩm</Th>
                                <Th>Tên sản phẩm</Th>
                                <Th isNumeric>Giá</Th>
                                <Th isNumeric>Số lượng</Th>
                                <Th isNumeric>Thành tiền</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {items
                                .map((item) => ({
                                    ...item,
                                    variant: variants?.find(
                                        (v) => v.id === item.variant.id,
                                    ),
                                }))
                                .map(({ id, price, quantity, variant }) => (
                                    <Tr key={id}>
                                        <Td isNumeric>{id}</Td>
                                        <Td>
                                            <div className="flex justify-center">
                                                <Image
                                                    src={
                                                        variant?.image ??
                                                        loginImg
                                                    }
                                                    alt={`${variant?.image}`}
                                                    loading="lazy"
                                                    width="50"
                                                    height="50"
                                                />
                                            </div>
                                        </Td>
                                        <Td>ABCXYZ-0005</Td>
                                        <Td>
                                            {variant?.product?.name ??
                                                "Loading..."}
                                        </Td>
                                        <Td isNumeric>{price}</Td>
                                        <Td isNumeric>{quantity}</Td>
                                        <Td isNumeric>
                                            {price * quantity} VNĐ
                                        </Td>
                                    </Tr>
                                ))}
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
    return <>No data</>;
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

    const items = useCustom<IOrderItem[]>({
        url: record?._links?.items.href || "",
        method: "get",
        meta: {
            _embeddedResource: "orderItems",
        },
        queryOptions: {
            enabled: !!record,
        },
    });

    const variantsId = items.data?.data.map(({ variant }) => variant.id) || [];
    const variants = useMany<IVariant>({
        resource: "variants",
        ids: variantsId,
        queryOptions: {
            enabled: variantsId.length > 0,
        },
        meta: {
            query: {
                projection: "product",
            },
        },
    });
    return {
        order: queryResult,
        user,
        payment,
        items,
        variants,
    };
};
