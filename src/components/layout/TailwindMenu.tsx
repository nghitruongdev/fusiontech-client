import {
    ChartPieIcon,
    CursorArrowRaysIcon,
    FingerPrintIcon,
    SquaresPlusIcon,
    ArrowPathIcon,
} from "@heroicons/react/20/solid";
import { cn } from "components/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { FaLaptop } from "react-icons/fa";

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
export function PopoverDemo() {
    return (
        <Popover>
            <PopoverTrigger>
                <div className="flex items-center gap-2 navBarHover">
                    <div className="w-4 grid grid-cols-2 gap-[2px]">
                        <span className="w-1.5 h-1.5 border-[1px] border-white inline-flex"></span>
                        <span className="w-1.5 h-1.5 border-[1px] border-white inline-flex"></span>
                        <span className="w-1.5 h-1.5 border-[1px] border-white inline-flex"></span>
                        <span className="w-1.5 h-1.5 border-[1px] border-white inline-flex"></span>
                    </div>
                    <p className="font-semibold ">Departments</p>
                </div>
            </PopoverTrigger>
            <PopoverContent className="border-0 w-screen bg-transparent pt-3 shadow-none">
                <div className="h-[500px] grid grid-cols-6">
                    <div className=""></div>
                    <div className=" col-span-5 h-full flex p-4 bg-white rounded-lg rounded-t-none border mr-4 shadow-lg">
                        <div className="grid grid-cols-2 gap-4 max-w-[500px] ">
                            <div className="bg-zinc-100 rounded-md">
                                <a
                                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md hover:shadow-md"
                                    href="#"
                                >
                                    {/* <Icons.logo className="h-6 w-6" /> */}
                                    <div className="mb-2 mt-4 text-lg font-medium">
                                        shadcn/ui
                                    </div>
                                    <p className="text-sm leading-tight text-muted-foreground">
                                        Beautifully designed components built
                                        with Radix UI and Tailwind CSS.
                                    </p>
                                </a>
                            </div>
                            {/* md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] */}
                            <div className=" rounded-md">
                                {[...solutions].map((item) => (
                                    <>
                                        <a
                                            className={cn(
                                                "block select-none space-y-1 p-3 rounded-md rounded-r-none leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                            )}
                                        >
                                            <div className="text-sm font-medium leading-none flex items-center">                                           
                                                <FaLaptop className="w-5 h-5 mr-2 text-zinc-500" />{item.name}
                                            </div>
                                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                                {item.description}
                                            </p>
                                        </a>
                                    </>
                                ))}
                            </div>
                        </div>
                        <div className=" flex-1 p-4  grid grid-cols-3 gap-4 bg-accent rounded-r-md">
                            <div className="">
                                <p className="text-md font-medium leading-none text-center text-blue-600">
                                    Phân loại sản phẩm
                                </p>
                            </div>
                            <div className="">
                                <p className="text-md font-medium leading-none text-center text-blue-600">
                                    Tìm theo thương hiệu
                                </p>
                            </div>
                            <div className="">
                                <p className="text-md font-medium leading-none text-center text-blue-600">
                                    Sản phẩm nổi bật
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
