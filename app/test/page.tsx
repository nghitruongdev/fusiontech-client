import { APP_API } from "@/constants";

const getAddress = async () => {
    const data = await fetch(APP_API.shippingAddress.url);

    if (!data.ok) {
        throw new Error("Failed to fetch data");
    }

    return data.json();
};

const page = async () => {
    const address = await getAddress();
    return <>{JSON.stringify(address)}</>;
};
export default page;
