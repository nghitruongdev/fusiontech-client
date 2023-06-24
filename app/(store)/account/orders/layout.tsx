import { API_URL } from "@/constants";
import StatusTabs from "./StatusTabs";

const getStatusGroups = async () => {
    const response = await fetch(`${API_URL}/orders/statuses/groups`);

    if (!!!response.ok) {
    }

    return response.json();
};
const OrderLayout = async ({ children }: { children: React.ReactNode }) => {
    const statusGroups = await getStatusGroups();

    return (
        <>
            <div className="">
                <StatusTabs groups={statusGroups} />
                <div className="min-h-[300px] mt-4">{children}</div>
            </div>
        </>
    );
};
export default OrderLayout;
