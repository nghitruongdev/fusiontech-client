import { Input, Select, Checkbox } from "@chakra-ui/react";
import FormInput from "@components/ui/FormInput";
import { HomeIcon, Building } from "lucide-react";

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
            <div className="mt-6 flex gap-2 justify-between md:block">
                <div className="flex items-center gap-3">
                    <span>Loại địa chỉ</span>
                    <div className="flex flex-1 md:justify-center md:gap-4">
                        <p className="px-4 p-2 border-2 border-sky-600 bg-sky-50 rounded-md text-sky-600 flex items-center gap-2 text-sm font-semibold">
                            <HomeIcon /> Nhà riêng
                        </p>
                        <p className="px-4 p-2 border-0 border-gray-500 rounded-md text-gray-700 flex items-center gap-2 text-sm font-semibold">
                            <Building /> Văn phòng
                        </p>
                    </div>
                </div>

                <Checkbox className="md:mt-6">
                    Đặt làm địa chỉ mặc định
                </Checkbox>
            </div>
        </>
    );
};

export default AddressForm;
