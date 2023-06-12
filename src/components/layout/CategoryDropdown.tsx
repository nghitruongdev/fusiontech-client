"use client";

import { Portal } from "@headlessui/react";
import { cn } from "components/lib/utils";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "components/ui/navigation-menu";
import React, { ReactNode } from "react";

const components = [];
const CategoryDropdown = ({ trigger }: { trigger: ReactNode }) => {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem className="">
                    {trigger}
                    {/* <NavigationMenuTrigger>{trigger}</NavigationMenuTrigger> */}
                    <Portal>
                        <div className="mt-4">
                            {" "}
                            <NavigationMenuContent>
                                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                    <li className="row-span-6">
                                        <NavigationMenuLink asChild>
                                            <a
                                                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                                href="#"
                                            >
                                                {/* <Icons.logo className="h-6 w-6" /> */}
                                                <div className="mb-2 mt-4 text-lg font-medium">
                                                    shadcn/ui
                                                </div>
                                                <p className="text-sm leading-tight text-muted-foreground">
                                                    Beautifully designed
                                                    components built with Radix
                                                    UI and Tailwind CSS.
                                                </p>
                                            </a>
                                        </NavigationMenuLink>
                                    </li>
                                    <ListItem href="/docs" title="Laptop">
                                        Re-usable components built using Radix
                                        UI and Tailwind CSS.
                                    </ListItem>
                                    <ListItem
                                        href="/docs/installation"
                                        title="Điện thoại"
                                    >
                                        How to install dependencies and
                                        structure your app.
                                    </ListItem>
                                    <ListItem
                                        href="/docs/primitives/typography"
                                        title="Phụ kiện âm thanh"
                                    >
                                        Styles for headings, paragraphs,
                                        lists...etc
                                    </ListItem>
                                    <ListItem
                                        href="/docs/primitives/typography"
                                        title="Đồ chơi công nghệ"
                                    >
                                        Styles for headings, paragraphs,
                                        lists...etc
                                    </ListItem>
                                </ul>
                            </NavigationMenuContent>
                        </div>
                    </Portal>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
};
export default CategoryDropdown;

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className,
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">
                        {title}
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    );
});
ListItem.displayName = "ListItem";
