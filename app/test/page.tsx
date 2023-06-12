"use client";
import { Menu, MenuButton, Button, MenuList, MenuItem } from "@chakra-ui/react";
import { NavigationMenuDemo } from "app/(store)/NavigationMenu";
import { ChevronDownIcon } from "lucide-react";

const page = () => {
    return (
        <>
            <div className="flex justify-center items-center">
                <NavigationMenuDemo />
                <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                        Actions
                    </MenuButton>
                    <MenuList>
                        <MenuItem>Download</MenuItem>
                        <MenuItem>Create a Copy</MenuItem>
                        <MenuItem>Mark as Draft</MenuItem>
                        <MenuItem>Delete</MenuItem>
                        <MenuItem>Attend a Workshop</MenuItem>
                    </MenuList>
                </Menu>
            </div>
        </>
    );
};
export default page;
