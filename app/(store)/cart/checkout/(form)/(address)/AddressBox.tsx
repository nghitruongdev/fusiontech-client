import { ShippingAddress } from "@/interfaces";
import { Flex, useBoolean, Radio, Spinner } from "@chakra-ui/react";
import MenuOptions, { MenuItem } from "@components/ui/MenuOptions";
import { BaseKey } from "@refinedev/core";
import { Check, LoaderIcon, Plus } from "lucide-react";
import { BsChatSquareQuote } from "react-icons/bs";
import { RiFileShredLine, RiShutDownLine } from "react-icons/ri";

const hoverBorderColor = "hover:border-blue-700";

const AddressBox = ({
    address,
    onClick,
    showCheck,
    className,
    isDefault,
}: {
    address: ShippingAddress;
    showCheck?: boolean;
    onClick?: () => void;
    className?: string;
    isDefault?: boolean;
}) => {
    const [hover, setHover] = useBoolean();

    return (
        <div
            className={`group border ${hoverBorderColor} rounded-md bg-white flex items-center justify-start text-start leading-tight relative cursor-pointer h-[150px] shadow-lg hover:bg-blue-50 hover:text-blue-600 ${className}`}
            onMouseEnter={setHover.on}
            onMouseLeave={setHover.off}
            onClick={onClick}
        >
            <div className="m-4 leading-12">
                <p className="">
                    <span className="font-semibold">{address.name}</span>
                </p>
                <p className="text-sm mt-2">
                    {`${address.address}, ${address.ward}, ${address.district}, ${address.province}`}
                </p>
                <p className="text-sm">
                    Số điện thoại:{" "}
                    <span className="font-semibold underline">
                        {address.phone}
                    </span>
                </p>
            </div>

            {!isDefault && showCheck && (
                <div className="absolute top-0 right-0 rounded-full text-sm text-white bg-blue-600 transform scale-50 p-1 shadow-md border">
                    {/* {hover && <PencilIcon className="m-1 " />} */}

                    <Check className="m-1" />
                </div>
            )}
            {isDefault && (
                <div className="text-end absolute -bottom-4 -right-2 rounded-full text-sm text-white bg-blue-600 hover:bg-blue-700 transform scale-75 p-1 shadow-lg border border-gray-50">
                    <p className="m-1 mx-2">Địa chỉ mặc định</p>
                </div>
            )}
        </div>
    );
};

const LoadingAddressBox = () => {
    return (
        <div
            className={`group border ${hoverBorderColor} rounded-md bg-white flex items-center justify-center leading-tight relative cursor-pointer h-[150px] shadow-lg`}
        >
            <Spinner
                thickness="2px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.600"
                size="xl"
            />
        </div>
    );
};
const EmptyAddressBox = () => {
    return (
        <div
            className={`border text-sm shadow-md border-gray-300 min-h-[150px] bg-gray-50 p-4 rounded-md text-gray-400 flex justify-center items-center cursor-pointer hover:text-blue-600 hover:bg-blue-50 ${hoverBorderColor}`}
        >
            <Plus />
            Thêm mới địa chỉ
        </div>
    );
};

const AddressRadioBox = ({
    value,
    isSelected,
    address,
    isDefault,
    setDefaultAddress,
    openEditModal,
    deleteAddress,
}: {
    value: string;
    isSelected?: boolean;
    isDefault?: boolean;
    address: ShippingAddress;
    setDefaultAddress: (addressId: number) => void;
    openEditModal: (id: BaseKey | undefined) => void;
    deleteAddress: (address: ShippingAddress) => void;
}) => {
    const items: MenuItem[] = [
        {
            text: "Chỉnh sửa",
            rightIcon: <BsChatSquareQuote />,
            onClick: openEditModal.bind(this, address?.id),
            w: "150px",
        },
        {
            text: "Đặt mặc định",
            rightIcon: <RiFileShredLine />,
            onClick: setDefaultAddress.bind(this, +value),
            w: "150px",
            display: `${isDefault && "none"}`,
        },
        {
            text: "Xoá địa chỉ",
            rightIcon: <RiShutDownLine />,
            colorScheme: "red",
            onClick: deleteAddress.bind(this, address),
            w: "150px",
            isDisabled: isDefault,
        },
    ];

    return (
        <div className="flex items-center mt-4">
            <Flex as="label" flexGrow="1" gap="2">
                <Radio value={value} />
                <AddressBox
                    address={address}
                    className={`flex-1 text-center ${
                        isSelected ? "border-blue-600" : ""
                    }`}
                    isDefault={isDefault}
                />
            </Flex>

            <div className="mx-4">
                <MenuOptions items={items} />
            </div>
        </div>
    );
};

export { AddressBox, EmptyAddressBox, LoadingAddressBox, AddressRadioBox };
