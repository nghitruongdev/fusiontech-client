"use client";

import { Spinner } from "@chakra-ui/react";

const LoadingOrder = () => {
    return (
        <div className="flex justify-center w-full h-full items-center">
            LoadingOrder... <Spinner />
        </div>
    );
};
export default LoadingOrder;
