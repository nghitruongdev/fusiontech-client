import { waitPromise } from "@/lib/promise";
import { UseToastOptions, useToast } from "@chakra-ui/react";
import { useCancelNotification } from "@refinedev/core";
import { ReactNode } from "react";

export type NotificationType = "success" | "warning" | "error" | "info";
type OptionType = {
    type: NotificationType;
    title: ReactNode;
    message?: ReactNode;
    description?: ReactNode;
} & UseToastOptions;
const defaultStyle: UseToastOptions = {
    position: "top",
    variant: "left-accent",
    duration: 5000,
    // description: `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquid ad
    //         odio maxime libero eius debitis possimus, alias quo laudantium vel.
    //         Soluta reiciendis, eligendi eum nulla blanditiis illum dignissimos
    //         quo obcaecati.`,
};
const style: { [key in NotificationType]: UseToastOptions } = {
    info: {
        ...defaultStyle,
        status: "info",
    },
    success: {
        ...defaultStyle,
        status: "success",
    },
    error: {
        ...defaultStyle,
        status: "error",
    },
    warning: {
        ...defaultStyle,
        status: "warning",
    },
};
const useNotification = () => {
    const toast = useToast();

    const open = ({ message, type, title, ...props }: OptionType) => {
        return toast({
            ...style[type],
            ...props,
            title: title ?? message,
        });
    };
    return {
        open,
    };
};
export default useNotification;
