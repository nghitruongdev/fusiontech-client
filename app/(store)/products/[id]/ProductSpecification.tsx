"use client";
import {
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Tr,
    Td,
} from "@chakra-ui/react";

const ProductSpecification = () => {
    const details = [
        {
            name: "Kích thước màn hình",
            value: "6.8 inches",
        },
    ];
    return (
        <>
            <p className="font-bold text-xl mb-2">Thông số kỹ thuật</p>
            <div className="border shadow-lg rounded-b-md">
                <TableContainer roundedBottom={"md"}>
                    <Table variant="striped" roundedBottom={"md"}>
                        <TableCaption>Xem thêm</TableCaption>
                        <Tbody>
                            {Array.from({ length: 10 })
                                .map((_) => details[0] as any)
                                .map((detail, idx) => (
                                    <Tr key={detail.name + idx}>
                                        <Td className="font-normal text-sm">
                                            {detail.name}
                                        </Td>
                                        <Td className="text-sm font-normal">
                                            {detail.value}
                                        </Td>
                                    </Tr>
                                ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </div>
        </>
    );
};
export default ProductSpecification;
