import { Icon, ComponentWithAs, IconButtonProps } from "@chakra-ui/react";
import React from "react";
import { useThemedLayoutContext } from "@refinedev/chakra-ui";
import {
    IconLayoutSidebarLeftCollapse,
    IconLayoutSidebarLeftExpand,
    IconMenu2,
} from "@tabler/icons";

const HamburgerIcon: ComponentWithAs<"button", IconButtonProps> = (
    props: React.PropsWithChildren,
) => (
    <Icon
        backgroundColor="transparent"
        aria-label="sidebar-toggle"
        boxSize={"24px"}
        display="inline-block"
        {...props}
    >
        {props.children}
    </Icon>
);

export const HamburgerMenu: React.FC = () => {
    const {
        siderCollapsed,
        setSiderCollapsed,
        mobileSiderOpen,
        setMobileSiderOpen,
    } = useThemedLayoutContext();

    return (
        <>
            <HamburgerIcon
                display={{ base: "none", md: "inline-block" }}
                aria-label="drawer-sidebar-toggle"
                as={
                    siderCollapsed
                        ? IconLayoutSidebarLeftExpand
                        : IconLayoutSidebarLeftCollapse
                }
                onClick={() => setSiderCollapsed(!siderCollapsed)}
            />
            <HamburgerIcon
                display={{ base: "inline-block", md: "none" }}
                aria-label="sidebar-toggle"
                as={IconMenu2}
                onClick={() => setMobileSiderOpen(!mobileSiderOpen)}
            />
        </>
    );
};
