"use client";

import { IOrderStatusGroup } from "types";
import Link from "next/link";
import { usePathname } from "next/navigation";

const StatusTabs = ({ groups }: { groups: IOrderStatusGroup[] }) => {
    const route = usePathname();

    return (
        <div className="w-full flex justify-between mt-4">
            <p className="text-xl font-semibold">Quản lý đơn hàng</p>
            <div className="flex rounded-md shadow-md bg-red max-w-[600px] overflow-scroll">
                {groups.map(({ id, name, detailName }) => {
                    const href = `/account/orders/${name}`;
                    const isActive = route == href;
                    return (
                        <Link
                            key={id}
                            href={href}
                            className={`${
                                isActive
                                    ? "bg-zinc-50 text-blue-600"
                                    : "bg-white text-zinc-400"
                            } min-w-[100px] px-4 py-2 text-sm font-semibold text-center`}
                        >
                            <p className="whitespace-nowrap">{detailName}</p>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};
export default StatusTabs;
