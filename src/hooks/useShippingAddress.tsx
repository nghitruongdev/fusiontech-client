import { useCallback, useState } from "react";
import useAxios, { AxiosOptions } from "./useAxios";
import { getFetcher } from "./useFetcher";
import useMyToast from "./useToast";
import useSWR from "swr";
import { ShippingAddress } from "@/interfaces";
import { APP_API } from "@/constants";
import { useForm } from "react-hook-form";
import { useDisclosure } from "@chakra-ui/react";

const fetcher = getFetcher();

const useShippingAddress = ({ mutate }: { mutate: () => void }) => {
    const { post, patch, remove, isLoading } = useAxios();
    const { ok, fail } = useMyToast();

    const [current, setCurrent] = useState<ShippingAddress>();
    const disclosure = useDisclosure();
    const { onOpen } = disclosure;

    const swr = useSWR(fetcher);
    const { handleSubmit, ...form } = useShippingAddressForm({ current });

    const showInfo = useCallback((current?: ShippingAddress) => {
        setCurrent(current);
        onOpen();
    }, []);
    const handleError = useCallback(() => {}, []);

    const axiosOptions: AxiosOptions = { throwOnError: true };

    const validateData = (formValue: ShippingAddressFormValue) => {
        return true;
    };

    const saveAddress = handleSubmit(
        async (formValue: ShippingAddressFormValue, event: any) => {
            if (!validateData(formValue)) return;
            const successAction = (response: ShippingAddress) => {
                // ?: do you want to clear the current data

                //send a notification
                ok({
                    title: "Lưu địa chỉ thành công.",
                    message: "Sản phẩm đã được lưu vào hệ thống",
                }).fire();
                //fetch data from server
                if (response) {
                    // get({
                    //     requestUrl: `${config.api.products.url}/${responseData}`,
                    // }).then((response: any) => setCurrent(response.data));
                }
            };

            let submitHandler: () => Promise<any>;
            if (!!current) {
                submitHandler = async () => {
                    const response = await patch({
                        requestUrl: ``,
                        data: ``,
                        options: axiosOptions,
                    });
                    if (response?.status) return successAction(response.data);
                    throw Error("Lỗi cập nhật địa chỉ nhận hàng");
                };
            } else {
                submitHandler = async () => {
                    const response = await post({
                        requestUrl: ``,
                        data: ``,
                        options: axiosOptions,
                    });
                    if (response?.status) return successAction(response.data);
                    throw Error("Lỗi thêm địa chỉ - 500");
                };
            }

            await submitHandler().then(mutate).catch(handleError);
        },
    );

    const updateDefaultAddress = (uid: string, addressId: number) => {
        console.log("update default address for address id ", addressId);
        const updateHandler = async () => {
            const response = await patch({
                requestUrl: `${APP_API.users.defaultAddress.update(
                    uid,
                    addressId,
                )}`,
                options: axiosOptions,
            });
            console.log("Response", response);
            if (response?.status) {
                ok({
                    title: "Đặt địa chỉ mặc định thành công",
                }).fire();
            } else {
                throw Error("Xoá địa chỉ nhận hàng đã xảy ra lỗi - 500");
            }
        };
        updateHandler().then(mutate).catch(handleError);
    };

    const deleteAddress = (addressId: number) => {
        const removeHandler = async () => {
            const response = await remove({
                requestUrl: `${APP_API.shippingAddress.url}/${addressId}`,
                options: axiosOptions,
            });
            if (response?.status) {
                ok({
                    title: "Xoá địa chỉ thành công",
                }).fire();
            } else {
                throw Error("Xoá địa chỉ nhận hàng đã xảy ra lỗi - 500");
            }
            removeHandler().then(mutate).catch(handleError);
        };
    };
    return {
        showInfo,
        current,
        saveAddress,
        updateDefaultAddress,
        deleteAddress,
        isLoading,
        disclosure,
    };
};

type FormProps = {
    current?: ShippingAddress;
};
type ShippingAddressFormValue = {
    id?: number;
    name: string;
    phone: string;
    address: string;
    ward: string;
    district: string;
    province: string;
    default?: boolean;
    user?: any;
};

const defaultShippingAddress: ShippingAddressFormValue = {
    name: "",
    phone: "",
    address: "",
    ward: "",
    district: "",
    province: "",
    default: false,
};

export type ShippingAddressInputs = {
    [key in keyof ShippingAddressFormValue]: JSX.Element;
};
const useShippingAddressForm = ({ current }: FormProps) => {
    const { handleSubmit, ...form } = useForm<ShippingAddressFormValue>({
        mode: "onBlur",
        defaultValues: defaultShippingAddress,
    });

    const inputs: ShippingAddressInputs = {
        name: <></>,
        phone: <></>,
        address: <></>,
        ward: <></>,
        district: <></>,
        province: <></>,
    };
    return {
        handleSubmit,
        form,
        inputs,
    };
};
export default useShippingAddress;
