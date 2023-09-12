"use client";
import { Menu, MenuButton, Button, MenuList, MenuItem } from "@chakra-ui/react";
import { Transition } from "@headlessui/react";
import { Fragment } from "react";

const MenuContainer = () => {
    return (
        <>
            <Menu>
                <MenuButton as={Button} variant={"unstyled"}>
                    Actions
                </MenuButton>
                <MenuList className="text-base font-semibold text-black">
                    {[
                        "Download",
                        "Create a Copy",
                        "Mark as Draft",
                        "Delete",
                        "Attend a Workshop",
                    ].map((item) => (
                        <MenuItem
                            key={item}
                            _hover={{
                                bg: "gray.50",
                            }}
                        >
                            <span className="font-semibold text-gray-900">
                                {item}
                            </span>
                            <span className="absolute inset-0" />
                        </MenuItem>
                    ))}
                </MenuList>
            </Menu>
        </>
    );
};
export default MenuContainer;
