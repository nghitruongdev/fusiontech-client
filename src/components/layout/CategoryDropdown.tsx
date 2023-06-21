"use client";
import {
    ChartPieIcon,
    CursorArrowRaysIcon,
    FingerPrintIcon,
    SquaresPlusIcon,
    ArrowPathIcon,
    ChevronDownIcon,
} from "@heroicons/react/20/solid";
import { FaLaptop } from "react-icons/fa";
import {
    Box,
    Button,
    ChakraComponent,
    Menu,
    MenuButton,
    MenuButtonProps,
    MenuItem,
    MenuList,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    forwardRef,
} from "@chakra-ui/react";

const solutions = [
    {
        name: "Laptop",
        description: "Get a better understanding of your traffic",
        href: "#",
        icon: ChartPieIcon,
    },
    {
        name: "Điện thoại",
        description: "Speak directly to your customers",
        href: "#",
        icon: CursorArrowRaysIcon,
    },
    {
        name: "Thiết bị âm thanh",
        description: "Your customers' data will be safe and secure",
        href: "#",
        icon: FingerPrintIcon,
    },
    {
        name: "Phụ kiện khác",
        description: "Connect with third-party tools",
        href: "#",
        icon: SquaresPlusIcon,
    },
    {
        name: "Phụ kiện khác",
        description: "Connect with third-party tools",
        href: "#",
        icon: SquaresPlusIcon,
    },
    {
        name: "Phụ kiện khác",
        description: "Connect with third-party tools",
        href: "#",
        icon: SquaresPlusIcon,
    },
    {
        name: "Phụ kiện khác",
        description: "Connect with third-party tools",
        href: "#",
        icon: SquaresPlusIcon,
    },
];
export function CategoryDropDown() {
    return (
        // <>
        //     <Menu isLazy>
        //         {({ isOpen }) => (
        //             <>
        //                 <MenuButton
        //                     as={CatMenuButton}
        //                     className={`navBarHover font-semibold`}
        //                     isActive={isOpen}
        //                 />
        //                 <div className="relative">
        //                     <MenuList
        //                         color="gray.700"
        //                         fontSize="sm"
        //                         fontWeight="normal"
        //                         lineHeight="base"
        //                         minW={"200px"}
        //                         mt="2"
        //                     >
        //                         <MenuItem>Download</MenuItem>
        //                         <MenuItem onClick={() => alert("Kagebunshin")}>
        //                             Create a Copy
        //                         </MenuItem>
        //                     </MenuList>
        //                     <div className="absolute right-0 top-0 h-[400px] bg-red-500">
        //                         Hello there
        //                     </div>
        //                 </div>
        //             </>
        //         )}
        //     </Menu>
        // </>
        <>
            <Popover isLazy>
                <PopoverTrigger>
                    <Button>Danh mục</Button>
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader>Confirmation!</PopoverHeader>
                    <PopoverBody>
                        Are you sure you want to have that milkshake?
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </>
    );
}

const CatMenuButton = forwardRef<
    MenuButtonProps & {
        isActive?: boolean;
    },
    "div"
>(({ isActive, ...props }, ref) => (
    <Box
        ref={ref}
        {...props}
        className={`navBarHover font-semibold group ${
            isActive && "navBarActive"
        }`}
    >
        <div className={`w-4 grid grid-cols-2 gap-[2px]`}>
            {Array.from({ length: 4 }).map((_, idx) => (
                <span
                    key={idx}
                    className={` group-hover:bg-white w-1.5 h-1.5 border-[1px] border-white inline-flex ${
                        isActive && "bg-white"
                    }`}
                ></span>
            ))}
        </div>
        Danh mục
    </Box>
));
