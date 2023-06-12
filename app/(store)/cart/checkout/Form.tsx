"use client";
import { Box, Input, Textarea, useBoolean, useSteps } from "@chakra-ui/react";
import FormInput from "@components/ui/FormInput";
import { Check, PencilIcon } from "lucide-react";
import React, { useState } from "react";
import AddressSection from "../../checkout/(form)/(address)/section";
import { CreditCardIcon } from "@heroicons/react/20/solid";
import { BiMoneyWithdraw } from "react-icons/bi";

const steps = [
    { title: "First", description: "Contact Info" },
    { title: "Second", description: "Date & Time" },
    { title: "Third", description: "Select Rooms" },
];

const Form = () => {
    const { activeStep } = useSteps({
        index: 1,
        count: steps.length,
    });

    return (
        <>
            <div className="px-8 py-4 mt-4 bg-gray-50 rounded-xl shadow-lg border">
                <h2 className="text-xl font-normal mb-4">Địa chỉ giao hàng</h2>
                <AddressSection />
                <div className="mb-4">
                    <h3 className="text-lg font-normal mt-4 mb-2">
                        Thông tin liên hệ
                    </h3>
                    <FormInput
                        label=""
                        input={
                            <Input
                                placeholder="Nhập địa chỉ email để nhận hoá đơn"
                                _placeholder={{
                                    fontSize: "sm",
                                }}
                            />
                        }
                        isRequired={false}
                    />
                </div>
                <div className="mb-4">
                    <h2 className="text-lg font-normal mb-2">
                        Ghi chú đơn hàng
                    </h2>
                    <Textarea
                        placeholder="Nhập nội dung ghi chú"
                        _placeholder={{
                            fontSize: "sm",
                        }}
                    />
                </div>
            </div>

            <div className="px-8 py-4 mt-4 bg-gray-50 rounded-xl shadow-2xl border">
                <h2 className="text-xl font-normal mb-4">
                    Lựa chọn thanh toán
                </h2>
                <Payment />
            </div>
        </>
    );
};

const Payment = () => {
    const [selected, setSelected] = useState<string>("");
    return (
        <div className="mx-auto grid grid-cols-3 gap-x-8 min-h-[150px] px-4 text-center">
            {[
                "Thẻ Visa/ Mastercard",
                "Thanh toán trả sau (COD)",
                "Thanh toán chuyển khoản",
            ].map((met) => (
                <>
                    <Box
                        className={`relative border rounded-md  py-4 px-8 mb-4 flex justify-center items-center flex-col text-gray-500 text-lg shadow-lg`}
                        key={met}
                        _hover={{
                            color: "blue.500",
                            borderColor: "blue.500",
                            cursor: "pointer",
                        }}
                        {...(selected === met && {
                            borderColor: "blue.500",
                            bg: "blue.50",
                            textColor: "blue.600",
                        })}
                        onClick={() => setSelected(met)}
                    >
                        <p className=" ti-line-height">{met}</p>
                        <BiMoneyWithdraw className="text-3xl" />
                        {selected === met && (
                            <div className="absolute -top-4 -right-3 rounded-full text-sm text-white bg-sky-600 group-hover:bg-sky-600 transform scale-75 p-1 shadow-lg border border-gray-50">
                                <Check className="m-1 font-semibold" />
                            </div>
                        )}
                    </Box>
                </>
            ))}
        </div>
    );
};

export default Form;
