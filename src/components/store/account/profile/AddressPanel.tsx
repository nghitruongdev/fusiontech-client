import { useBoolean } from "@chakra-ui/react";
import { Edit } from "lucide-react";

export const AddressPanel = () => {
    const [isShow, { on: show, off: close, toggle }] = useBoolean();
    const isDefaultExists = false;
    return (
        <div className={`min-w-[300px]`}>
            <div className={`flex justify-between items-center mb-2`}>
                <h2 className="text-xl font-bold">Địa chỉ mặc định</h2>
                {isDefaultExists && (
                    <Edit
                        className="w-5 h-5 text-gray-400 cursor-pointer"
                        onClick={toggle}
                    />
                )}
            </div>
            <AddressContent showModal={isShow} />
        </div>
    );
};

const AddressContent = ({ showModal }: { showModal: boolean }) => {
    if (!showModal) {
        return (
            <div className="flex flex-col gap-2">
                <p className={`text-xs text-muted-foreground`}>
                    Bạn chưa có địa chỉ nhận hàng mặc định. Vui lòng chọn Thêm
                    địa chỉ nhận hàng.
                </p>
                <hr />
                <p
                    className={`text-xs text-blue-500 underline underline-offset-2`}
                >
                    <span className="mr-2">+</span>Thêm địa chỉ nhận hàng
                </p>
            </div>
        );
    }

    return <></>;
};
