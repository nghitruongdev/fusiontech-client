import { ShippingAddress } from "@/interfaces";
import { Checkbox, Input, Spinner } from "@chakra-ui/react";
import ChakraFormInput from "@components/ui/ChakraFormInput";
import LoadingOverlay from "@components/ui/LoadingOverlay";
import { Building, HomeIcon } from "lucide-react";
import { UseFormRegister, FieldErrors, RegisterOptions } from "react-hook-form";

type Props = {
    register: UseFormRegister<ShippingAddress>;
    errors: FieldErrors<ShippingAddress>;
    formLoading?: boolean;
};

// const validate: {
//     [key in keyof ShippingAddress]: RegisterOptions | undefined;
// } = {
//     id: undefined,
//     name: { required: "Name is required" },
//     phone: { required: "Phone is required" },
//     address: { required: "Address is required" },
//     ward: { required: "Ward is required" },
//     district: { required: "district is required" },
//     province: { required: "province is required" },
// };

const validate: {
    [key in keyof ShippingAddress]: RegisterOptions | undefined;
} = {
    id: undefined,
    name: { required: "Name is required" },
    phone: { required: "Phone is required" },
    address: undefined,
    ward: undefined,
    district: undefined,
    province: undefined,
};

const getInputs = ({
    register,
    errors,
}: Props): {
    [key in keyof ShippingAddress]: React.ReactNode;
} => ({
    id: undefined,
    name: (
        <ChakraFormInput
            label="Họ tên người nhận"
            id="name"
            isInvalid={!!errors?.name}
            errorMessage={`${errors.name?.message}`}
        >
            <Input type="text" {...register("name", validate.name)} />
        </ChakraFormInput>
    ),
    phone: (
        <ChakraFormInput
            label="Số điện thoại"
            id="phone"
            isInvalid={!!errors?.phone}
            errorMessage={`${errors.phone?.message}`}
        >
            <Input type="tel" {...register("phone", validate.phone)} />
        </ChakraFormInput>
    ),
    address: (
        <ChakraFormInput
            label="Địa chỉ"
            id="address"
            isInvalid={!!errors?.address}
            errorMessage={`${errors.address?.message}`}
        >
            <Input type="text" {...register("address", validate.address)} />
        </ChakraFormInput>
    ),
    ward: (
        <ChakraFormInput
            label="Xã/ Phường"
            id="ward"
            isInvalid={!!errors?.ward}
            errorMessage={`${errors.ward?.message}`}
        >
            <Input type="text" {...register("ward", validate.ward)} />
        </ChakraFormInput>
    ),
    district: (
        <ChakraFormInput
            label="Quận/ Huyện"
            id="district"
            isInvalid={!!errors?.district}
            errorMessage={`${errors.district?.message}`}
        >
            <Input type="text" {...register("district", validate.district)} />
        </ChakraFormInput>
    ),
    province: (
        <ChakraFormInput
            label="Tỉnh/ Thành phố"
            isInvalid={!!errors?.province}
            errorMessage={`${errors.province?.message}`}
        >
            <Input
                id="province"
                type="text"
                {...register("province", validate.province)}
            />
        </ChakraFormInput>
    ),
    default: (
        <ChakraFormInput>
            <Checkbox {...register("default")}>Địa chỉ mặc định</Checkbox>
        </ChakraFormInput>
    ),
});

export const AddressForm = ({ formLoading, ...props }: Props) => {
    const inputs = getInputs(props);
    return (
        <div className="relative">
            {formLoading && <LoadingOverlay />}
            {inputs.name}
            {inputs.phone}
            {/* {inputs.address}
            {inputs.ward}
            {inputs.district}
            {inputs.province}
            {inputs.default} */}
            <ChakraFormInput label="Loại địa chỉ">
                <div className="flex gap-4">
                    <p className="px-4 p-2 border-2 border-sky-600 bg-sky-50 rounded-md text-sky-600 flex items-center gap-2 text-sm font-semibold">
                        <HomeIcon /> Nhà riêng
                    </p>
                    <p className="px-4 p-2 border-0 border-gray-500 rounded-md text-gray-700 flex items-center gap-2 text-sm font-semibold">
                        <Building /> Văn phòng
                    </p>
                </div>
            </ChakraFormInput>
        </div>
    );
};
