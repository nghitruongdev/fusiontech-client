"use client";
import { Category } from "@/interfaces";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@components/ui/shadcn/dropdown-menu";
import { useState } from "react";

const getCategories = async () => {
    const response = await fetch("api/categories");
    if (!!!response.ok) {
    }

    return response.json();
};
const CategoryNavigation = async () => {
    const [open, setOpen] = useState<boolean>(false);
    const categories = (await getCategories()) as Category[];
    console.log("open", open);
    return (
        <DropdownMenu open={open}>
            <DropdownMenuTrigger
                className="outline-none"
                onClick={() => setOpen((prev) => !prev)}
            >
                <CategoryMenuButton className={``} open={open} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-[200px] mt-3">
                {categories.map((cat) => (
                    <DropdownMenuItem key={cat.id}>{cat.name}</DropdownMenuItem>
                ))}
                {/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem> */}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
export const CategoryMenuButton = ({
    className,
    open,
}: {
    className?: string;
    open?: boolean;
}) => {
    return (
        <div
            className={`navBarHover text-white font-semibold border-0 border-outline-none outline-none ${className}`}
        >
            <div className={`w-4 grid grid-cols-2 gap-[2px]`}>
                {Array.from({ length: 4 }).map((_, idx) => (
                    <span
                        key={idx}
                        className={`w-1.5 h-1.5 border-[1px] border-white inline-flex ${
                            open && "bg-white"
                        }`}
                    ></span>
                ))}
                {/* <span className="w-1.5 h-1.5 border-[1px] border-white inline-flex"></span> */}
                {/* <span className="w-1.5 h-1.5 border-[1px] border-white inline-flex"></span> */}
                {/* <span className="w-1.5 h-1.5 border-[1px] border-white inline-flex"></span> */}
            </div>
            <p>Danh mục</p>
        </div>
    );
};

export default CategoryNavigation;
