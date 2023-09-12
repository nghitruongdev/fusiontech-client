"use client";
import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import {
    ChevronDownIcon,
    PhoneIcon,
    PlayCircleIcon,
} from "@heroicons/react/20/solid";
import {
    ArrowPathIcon,
    ChartPieIcon,
    CursorArrowRaysIcon,
    FingerPrintIcon,
    SquaresPlusIcon,
} from "@heroicons/react/24/outline";

const solutions = [
    {
        name: "Download",
        description: "Get a better understanding of your traffic",
        href: "#",
        icon: ChartPieIcon,
    },
    {
        name: "Engagement",
        description: "Speak directly to your customers",
        href: "#",
        icon: CursorArrowRaysIcon,
    },
    {
        name: "Security",
        description: "Your customers' data will be safe and secure",
        href: "#",
        icon: FingerPrintIcon,
    },
    {
        name: "Integrations",
        description: "Connect with third-party tools",
        href: "#",
        icon: SquaresPlusIcon,
    },
    {
        name: "Automations",
        description: "Build strategic funnels that will convert",
        href: "#",
        icon: ArrowPathIcon,
    },
];
// const callsToAction = [
//     { name: "Watch demo", href: "#", icon: PlayCircleIcon },
//     { name: "Contact sales", href: "#", icon: PhoneIcon },
// ];

export default function Example() {
    return (
        <Popover className="relative">
            {/* <Popover.Button className="inline-flex items-center gap-x-2 navBarHover text-sm font-semibold leading-6 text-gray-900"> */}
            <Popover.Button className="inline-flex items-center gap-x-2 navBarHover">
                {/* <div className="flex items-center gap-2 navBarHover"> */}
                <div className="w-4 grid grid-cols-2 gap-[2px]">
                    <span className="w-1.5 h-1.5 border-[1px] border-white inline-flex"></span>
                    <span className="w-1.5 h-1.5 border-[1px] border-white inline-flex"></span>
                    <span className="w-1.5 h-1.5 border-[1px] border-white inline-flex"></span>
                    <span className="w-1.5 h-1.5 border-[1px] border-white inline-flex"></span>
                </div>
                <p className="font-semibold ">Departments</p>
                {/* </div> */}
            </Popover.Button>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
            >
                <Popover.Panel className="absolute -left-full z-10 mt-4 flex w-screen max-w-max px-4">
                    <div className="max-w-screen grid grid-cols-3 overflow-hidden rounded-2xl mx-4 rounded-t-none bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                        <div>Hello theree</div>
                        {/* <div className="p-4">
                            {solutions.map((item) => (
                                <div
                                    key={item.name}
                                    className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50"
                                >
                                    <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                        <item.icon
                                            className="h-6 w-6 text-gray-600 group-hover:bg-white group-hover:text-blue"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <div>
                                        <a
                                            href={item.href}
                                            className="font-semibold text-gray-900 hover:text-blue"
                                        >
                                            {item.name}
                                            <span className="absolute inset-0" />
                                        </a>
                                        <p className="mt-1 text-gray-600 hover:text-lightBlue">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div> */}
                    </div>
                </Popover.Panel>
            </Transition>
        </Popover>
    );
}

{
}
