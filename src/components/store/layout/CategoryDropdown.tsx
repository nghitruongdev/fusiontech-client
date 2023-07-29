"use client";
import {
    Button,
    Menu,
    MenuItem,
    MenuList,
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
} from "@chakra-ui/react";
import { Laptop } from "lucide-react";
import { ICategory } from "types";

export function CategoryDropDown({ categories }: { categories: ICategory[] }) {
    return (
        <>
            <Popover isLazy>
                {({ isOpen }) => (
                    <>
                        <PopoverTrigger>
                            <Button variant={"unstyled"}>
                                <div
                                    className={`group navBarHover text-white font-semibold   ${
                                        isOpen && "navBarActive"
                                    }`}
                                >
                                    <div
                                        className={`w-4 grid grid-cols-2 gap-[2px]`}
                                    >
                                        {Array.from({ length: 4 }).map(
                                            (_, idx) => (
                                                <span
                                                    key={idx}
                                                    className={`  w-1.5 h-1.5 border-[1px] border-white inline-flex ${
                                                        isOpen && "bg-white"
                                                    }`}
                                                ></span>
                                            ),
                                        )}
                                    </div>
                                    Danh mục
                                </div>
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent
                            color="black"
                            mt="3"
                            w="200px"
                            pos="relative"
                        >
                            <PopoverBody>
                                <Menu isOpen>
                                    <MenuList>
                                        {categories.map((item) => (
                                            <MenuItem key={`${Math.random()}`}>
                                                <Laptop className="mr-2" />
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                    </MenuList>
                                </Menu>
                            </PopoverBody>
                        </PopoverContent>
                    </>
                )}
            </Popover>
        </>
    );
}

export function CategoryDropDownButton({ isOpen }: { isOpen?: boolean }) {
    return (
        <div
            className={`group navBarHover text-white font-semibold   ${
                isOpen && "navBarActive"
            }`}
        >
            <div className={`w-4 grid grid-cols-2 gap-[2px]`}>
                {Array.from({ length: 4 }).map((_, idx) => (
                    <span
                        key={idx}
                        className={`  w-1.5 h-1.5 border-[1px] border-white inline-flex ${
                            isOpen && "bg-white"
                        }`}
                    ></span>
                ))}
            </div>
            Danh mục
        </div>
    );
}