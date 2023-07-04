"use client";
import {
    Textarea as ChakraTextarea,
    Input,
    Radio,
    RadioGroup,
} from "@chakra-ui/react";
import { useState } from "react";
import AddressSection from "./(address)";
import { ICheckout } from "types";
import ChakraFormInput from "@components/ui/ChakraFormInput";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";

const CheckoutForm = ({
    register,
    setValue,
}: {
    register: UseFormRegister<ICheckout>;
    setValue: UseFormSetValue<ICheckout>;
}) => {
    const [payment, setPayment] = useState("1");

    return (
        <>
            <div className="mt-4 py-2 px-8">
                <h1 className="text-2xl font-[700]">Thông tin đặt hàng</h1>
            </div>
            <div className="px-8">
                <div className="px-6 py-3 bg-white mb-4 border rounded-md shadow-md">
                    <h4 className="text-lg font-semibold mb-3">
                        Địa chỉ giao hàng
                    </h4>
                    <div className="justify-around grid grid-cols-2 gap-4 min-h-[100px] mb-4">
                        <AddressSection
                            setAddressId={setValue.bind(this, "addressId")}
                        />
                    </div>
                </div>

                {/* <Separator className="my-4" /> */}
                <div className="px-6 py-3  bg-white mb-4 border rounded-md shadow-md">
                    <h4 className="text-lg font-semibold mb-3">
                        Thông tin liên hệ
                    </h4>
                    <div className="mb-2">
                        <ChakraFormInput
                            helperText="Hoá đơn điện tử sẽ được gửi đến địa chỉ email
                                của bạn."
                            helperTextProps={{
                                color: "blackAlpha.400",
                                lineHeight: "base",
                                fontSize: "sm",
                            }}
                        >
                            <Input
                                placeholder="Nhập địa chỉ email "
                                fontSize={"sm"}
                                bg="whiteAlpha.900"
                                shadow="sm"
                                {...register("email")}
                            />
                        </ChakraFormInput>
                    </div>
                    <div className="mb-4">
                        <ChakraFormInput
                            label="Ghi chú"
                            labelProps={{
                                mb: "2",
                                fontWeight: "semibold",
                                fontSize: "lg",
                            }}
                        >
                            <ChakraTextarea
                                bg="whiteAlpha.900"
                                fontSize={"sm"}
                                placeholder="Nhập nội dung ghi chú"
                                shadow={"sm"}
                                {...register("note")}
                            />
                        </ChakraFormInput>
                    </div>
                </div>

                {/* <Separator className="my-4" /> */}
                <div className="px-6 py-3  bg-white mb-4 border rounded-md shadow-md">
                    {/* <Separator /> */}
                    <h4 className="font-semibold text-lg mb-3">
                        Phương thức thanh toán
                    </h4>
                    <div className="mb-4">
                        <RadioGroup onChange={setPayment} value={payment}>
                            <div className="flex space-x-8 justify-start">
                                {[
                                    "Thẻ Visa/ Mastercard",
                                    "Ví điện tử",
                                    "Thanh toán trả sau",
                                ].map((item, idx) => (
                                    <Radio value={item} key={idx}>
                                        <span className="text-md font-medium leading-tight text-zinc-600">
                                            {item}
                                        </span>
                                    </Radio>
                                ))}
                            </div>
                        </RadioGroup>
                    </div>
                </div>
            </div>
        </>
    );
};
export default CheckoutForm;
