import { useBoolean } from "@chakra-ui/react";
import { Check, PencilIcon, Plus } from "lucide-react";

const hoverBorderColor = "hover:border-blue-700";

const AddressBox = ({
    onClick,
    showCheck,
    className,
    isDefault,
}: {
    showCheck?: boolean;
    onClick?: () => void;
    className?: string;
    isDefault?: boolean;
}) => {
    const [hover, setHover] = useBoolean();
    return (
        <div
            className={`group border ${hoverBorderColor} rounded-md bg-white flex items-center justify-start text-start leading-tight relative cursor-pointer ${className} h-[150px] shadow-lg`}
            onMouseEnter={setHover.on}
            onMouseLeave={setHover.off}
            onClick={onClick}
        >
            <div className="m-4 leading-12">
                <p className="">
                    <span className="font-semibold">Trương Vĩnh Nghi</span>
                </p>
                <p className="text-sm mt-2">
                    14/13 đường 53, phường 14, quận Gò Vấp, thành phố Hồ Chí
                    Minh
                </p>
                <p className="text-sm">
                    Số điện thoại:{" "}
                    <span className="font-semibold underline">0921850113</span>
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

export const EmptyAddressBox = () => {
    return (
        <div
            className={`border shadow-md border-gray-300 bg-gray-100 p-4 rounded-md text-gray-500 flex justify-center items-center cursor-pointer hover:text-blue-600 hover:bg-blue-100 ${hoverBorderColor}`}
        >
            <Plus />
            Thêm mới địa chỉ
        </div>
    );
};

export default AddressBox;
