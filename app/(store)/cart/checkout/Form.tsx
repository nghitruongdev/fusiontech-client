"use client";
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormLabel,
    Input,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverFooter,
    PopoverHeader,
    PopoverTrigger,
    Portal,
    Select,
    Step,
    StepDescription,
    StepIcon,
    StepIndicator,
    StepNumber,
    StepSeparator,
    StepStatus,
    StepTitle,
    Stepper,
    useSteps,
} from "@chakra-ui/react";
import { CheckBadgeIcon } from "@heroicons/react/20/solid";
import {
    Building,
    Building2,
    Check,
    CheckCheckIcon,
    HomeIcon,
    PlusIcon,
} from "lucide-react";
import { ReactNode } from "react";

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
            <div className="p-4 bg-gray-50 rounded-md shadow-md">
                <p className="text-2xl font-semibold mb-2">Địa chỉ nhận hàng</p>
                <div className="justify-around grid grid-cols-2 gap-4">
                    {/* <AddressPopOver /> */}
                    <AddressBox />
                    <div className="min-h-[100px] border-2 border-gray-300 bg-gray-100 p-4 rounded-md text-gray-500 flex items-center justify-center">
                        <PlusIcon />
                        Thêm mới địa chỉ
                    </div>
                </div>
                <div className="">
                    <p className="text-xl font-semibold">Thông tin liên hệ</p>
                    <FormInput
                        label="Email"
                        input={<Input placeholder="yourmail@gmail.com" />}
                        isRequired={false}
                    />
                </div>
            </div>

            <div className="">
                <p className="text-xl font-semibold">Lựa chọn thanh toán</p>
                <Payment />
            </div>
        </>
    );
};

const Payment = () => {
    return (
        <div className="mx-auto grid grid-cols-3 gap-x-8 h-[150px] px-4">
            <div className=" bg-red-200">Thẻ</div>
            <div className=" bg-red-200">Stripe</div>
            <div className=" bg-red-200">Thanh toán trả sau</div>
        </div>
    );
};

const FormInput = ({
    isRequired = true,
    label,
    input,
}: {
    label: string;
    isRequired?: boolean;
    input: ReactNode;
}) => {
    return (
        <>
            <FormControl isRequired={isRequired}>
                <FormLabel className="text-sm font-semibold">
                    <span className="text-base font-semibold text-gray-800">
                        {label}
                    </span>
                </FormLabel>
                {input}
            </FormControl>
        </>
    );
};
const AddressPopOver = () => {
    return (
        <>
            <Popover>
                <PopoverTrigger>
                    <AddressBox />
                </PopoverTrigger>
                <Portal>
                    <PopoverContent>
                        <PopoverArrow />
                        <PopoverHeader>Header</PopoverHeader>
                        <PopoverCloseButton />
                        <PopoverBody>
                            <Button colorScheme="blue">Button</Button>
                        </PopoverBody>
                        <PopoverFooter>This is the footer</PopoverFooter>
                    </PopoverContent>
                </Portal>
            </Popover>
        </>
    );
};
const AddressBox = () => {
    return (
        <div className="border-2 border-sky-700 bg-sky p-4 rounded-md text-center leading-tight relative cursor-pointer">
            <div className="absolute -top-4 -right-3 rounded-full text-sm text-white bg-sky-700 transform scale-90">
                <Check className="m-1" />
            </div>
            <p className="">
                <span className="font-semibold">Trương Vĩnh Nghi </span>
                0921850113
            </p>
            <p className="text-sm mt-2">
                14/13 đường 53, phường 14, quận Gò Vấp, <br /> thành phố Hồ Chí
                Minh
            </p>
        </div>
    );
};
const AddressForm = () => {
    return (
        <>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <FormInput
                    label="Họ và tên"
                    input={<Input placeholder="Họ và tên người nhận hàng" />}
                    isRequired
                />
                <FormInput
                    label="Điện thoại"
                    input={<Input placeholder="Số điện thoại" />}
                    isRequired
                />
            </div>
            <div className="mt-4">
                <FormInput
                    label="Address"
                    input={<Input placeholder="Tên đường, toà nhà, số nhà" />}
                    isRequired
                />
            </div>

            <div className="flex items-center gap-x-4 mt-6">
                <Select placeholder="Chọn xã/ phường">
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                </Select>
                <Select placeholder="Chọn quận/ huyện">
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                </Select>
                <Select placeholder="Chọn tỉnh/ thành phố">
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                </Select>
            </div>
            <div className="mt-6 flex gap-2 justify-between">
                <div className="flex items-center justify-start gap-3">
                    <span>Loại địa chỉ</span>
                    <HomeIcon /> Nhà riêng
                    <Building /> Văn phòng
                </div>

                <Checkbox className="">Đặt làm địa chỉ mặc định</Checkbox>
            </div>
            <div className="mt-4 text-end">
                <button className="bg-red-400 rounded-md p-2 px-4">
                    Hoàn thành
                </button>
            </div>
        </>
    );
};
export default Form;
