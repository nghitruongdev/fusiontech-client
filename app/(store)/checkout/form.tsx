"use client";
import {
    Textarea as ChakraTextarea,
    FormControl,
    FormHelperText,
    FormLabel,
    Heading,
    Input,
    Radio,
    RadioGroup,
    Stack,
} from "@chakra-ui/react";
import { useState } from "react";
import { Separator } from "components/ui/separator";
import { EmptyAddressBox } from "./(form)/(address)/box";
import { AddressModalList } from "./(form)/(address)/modal";
const CheckoutForm = () => {
    const [value, setValue] = useState("1");

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
                        <AddressModalList />
                        <EmptyAddressBox />
                    </div>
                </div>

                {/* <Separator className="my-4" /> */}
                <div className="px-6 py-3  bg-white mb-4 border rounded-md shadow-md">
                    <h4 className="text-lg font-semibold mb-3">
                        Thông tin liên hệ
                    </h4>
                    <div className="mb-2">
                        <FormControl>
                            <Input
                                placeholder="Nhập địa chỉ email "
                                fontSize={"sm"}
                                bg="whiteAlpha.900"
                                shadow="sm"
                            />
                            <FormHelperText className="text-muted-foreground text-sm leading-tight">
                                Hoá đơn điện tử sẽ được gửi đến địa chỉ email
                                của bạn.
                            </FormHelperText>
                        </FormControl>
                    </div>
                    <div className="mb-4">
                        <FormControl>
                            <FormLabel className="">
                                <div className="text-lg font-semibold mb-2">
                                    Ghi chú
                                </div>
                            </FormLabel>
                            <ChakraTextarea
                                bg="whiteAlpha.900"
                                fontSize={"sm"}
                                placeholder="Nhập nội dung ghi chú"
                                shadow={"sm"}
                            />
                        </FormControl>
                    </div>
                </div>

                {/* <Separator className="my-4" /> */}
                <div className="px-6 py-3  bg-white mb-4 border rounded-md shadow-md">
                    {/* <Separator /> */}
                    <h4 className="font-semibold text-lg mb-3">
                        Phương thức thanh toán
                    </h4>
                    <div className="mb-4">
                        <RadioGroup onChange={setValue} value={value}>
                            <div className="flex space-x-8 justify-start">
                                {[
                                    "Thẻ Visa/ Mastercard",
                                    "Ví điện tử",
                                    "Thanh toán trả sau",
                                ].map((item, idx) => (
                                    <>
                                        <Radio value={item} key={idx}>
                                            <span className="text-md font-medium leading-tight text-zinc-600">
                                                {item}
                                            </span>
                                        </Radio>
                                    </>
                                ))}{" "}
                            </div>
                        </RadioGroup>
                    </div>
                </div>
            </div>
            {/* <div className="px-6 py-3 border rounded-md bg-white"></div> */}
            {/* <div className="px-8 py-4">

            </div> */}
        </>
    );
};
export default CheckoutForm;
