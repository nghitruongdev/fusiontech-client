import { API_URL, fakeUserId } from "@/constants";
import { IFullOrderStatus, IOrder } from "@/interfaces";
import { springDataProvider } from "@/rest-data-provider";

const getOrderByGroup = async (group: string) => {
    const statusListResp = await fetch(
        `${API_URL}/orders/statuses?group=${group}`,
    );
    if (!!!statusListResp.ok) {
    }

    const statusList = (await statusListResp.json()) as IFullOrderStatus[];
    const statusParam = statusList.map((item) => item.name).join(",");

    const response = await springDataProvider(API_URL).custom({
        url: `${API_URL}/orders/search/byUserIdAndStatusIn`,
        method: "get",
        query: {
            uid: fakeUserId,
            st: statusParam,
        },
        meta: {
            _embeddedResource: "orders",
        },
    });
    return response.data;
};

const OrderByGroup = async ({
    params: { group },
}: {
    params: { group: string };
}) => {
    const orders = ((await getOrderByGroup(group)) ?? []) as IOrder[];
    return (
        <div>
            <div className="bg-white rounded-lg overflow-y-auto">
                <table className="text-center  w-full">
                    <thead>
                        <tr>
                            <th className="px-4 py-4">Mã đơn hàng</th>
                            <th className="px-4 py-4">Ngày mua</th>
                            <th className="px-4 py-4">Sản phẩm</th>
                            <th className="px-4 py-4">Tổng tiền (VND)</th>
                            <th className="px-4 py-4">Trạng thái</th>
                            <th className="px-4 py-4">Thanh Toán</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className="border-t">
                                <td className="px-4 py-4 text-blue-500">
                                    {order.id}
                                </td>
                                <td className="px-4 py-4">
                                    {order.purchasedAt}
                                </td>
                                <td className="px-4 py-4">
                                    {/* {order.products.join(", ")} */}
                                </td>
                                <td className="px-4 py-4">{order.total}</td>
                                <td className="px-4 py-4 text-blue-500">
                                    {order.status}
                                </td>
                                <td className="px-4 py-4 text-blue-500">
                                    {order.payment.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default OrderByGroup;
