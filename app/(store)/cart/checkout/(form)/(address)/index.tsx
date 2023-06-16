import { APP_API } from "@/constants";
import useShippingAddress from "@/hooks/useShippingAddress";
import { useCallback } from "react";
import useSWR from "swr";
import { EmptyAddressBox } from "./box";
import { AddressModalForm, AddressModalList } from "./modal";
import { getFetcher } from "@/hooks/useFetcher";
import { Portal, useDisclosure } from "@chakra-ui/react";

const fetcher: any = getFetcher();
const AddressSection = () => {
    const userId = "d0e27c38-74e3-43a4-a148-841927b3eb0d";

    const {
        data,
        isLoading,
        error,
        mutate: mutateList,
    } = useSWR(APP_API.shippingAddress.url, fetcher);

    const { data: defaultAddress, mutate: mutateDefault } = useSWR(
        `http://localhost:8080/api/shippingAddresses/search/findDefaultShippingAddressByUserId?uid=${userId}`,
        fetcher,
    );

    const mutateAll = useCallback(() => {
        mutateList();
        mutateDefault();
    }, []);

    const {
        updateDefaultAddress,
        isLoading: axiosLoading,
        disclosure: { isOpen, onOpen, onClose },
        showInfo,
    } = useShippingAddress({ mutate: mutateAll });

    const addresses = data?._embedded.shippingAddresses ?? [];

    return (
        <>
            <AddressModalList
                addressList={addresses}
                defaultAddress={defaultAddress}
                updateDefaultAddress={updateDefaultAddress.bind(this, userId)}
                openEditModal={showInfo}
            />
            <div onClick={() => showInfo()}>
                <EmptyAddressBox />
            </div>
            <Portal>
                <AddressModalForm isOpen={isOpen} onClose={onClose} />
            </Portal>
        </>
    );
};
export default AddressSection;
