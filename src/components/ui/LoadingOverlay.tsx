"use client";
import { Spinner } from "@chakra-ui/react";

const LoadingOverlay = () => {
    return (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <Spinner />
        </div>
    );
};
export default LoadingOverlay;
