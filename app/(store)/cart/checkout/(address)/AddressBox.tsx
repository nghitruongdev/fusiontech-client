import { useBoolean } from "@chakra-ui/react";
import { Check, PencilIcon, Plus } from "lucide-react";

const hoverBorderColor = "hover:border-sky-600";

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
            className={`group border bg-sky ${hoverBorderColor} hover:text-sky-600 rounded-md text-center leading-tight relative cursor-pointer ${className}`}
            onMouseEnter={setHover.on}
            onMouseLeave={setHover.off}
            onClick={onClick}
        >
            <div className="m-4">
                <p className="">
                    <span className="font-semibold">Trương Vĩnh Nghi </span>-
                    0921850113
                </p>
                <p className="text-sm mt-2">
                    14/13 đường 53, phường 14, quận Gò Vấp, <br /> thành phố Hồ
                    Chí Minh
                </p>
            </div>

            {!isDefault && showCheck && (
                <div className="absolute -top-4 -right-3 rounded-full text-sm text-white bg-sky-600 group-hover:bg-sky-600 transform scale-75 p-1 shadow-lg border border-gray-50">
                    {hover && <PencilIcon className="m-1 " />}

                    {!hover && <Check className="m-1" />}
                </div>
            )}
            {isDefault && (
                <div className="text-end absolute -bottom-4 -right-2 rounded-full text-sm text-white bg-sky-600 hover:bg-sky-700 transform scale-75 p-1 shadow-lg border border-gray-50">
                    <p className="m-1 mx-2">Địa chỉ mặc định</p>
                </div>
            )}
        </div>
    );
};

export const EmptyAddressBox = () => {
    return (
        <div
            className={`border border-gray-300 bg-gray-100 p-4 rounded-md text-gray-500 flex justify-center items-center cursor-pointer hover:text-sky-600 hover:bg-sky-50 ${hoverBorderColor}`}
        >
            <Plus />
            Thêm mới địa chỉ
        </div>
    );
};

export default AddressBox;
