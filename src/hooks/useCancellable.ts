import { useConst } from "@chakra-ui/react";
import { useCallback, useEffect, useRef } from "react";

const useCancellable = () => {
    const abortControllerRef = useRef(new AbortController());
    const signalRef = useRef(abortControllerRef.current.signal);

    const cancellablePromise = useCallback(
        (
            callback: (
                res: (value: unknown) => void,
                rej: (reason?: any) => void,
            ) => void,
        ) => {
            return new Promise((resolve, reject) => {
                const cleanup = () => {
                    signalRef.current.removeEventListener("abort", handleAbort);
                };

                const handleAbort = () => {
                    cleanup();
                    reject(new Error("Promise was canceled."));
                };

                signalRef.current.addEventListener("abort", handleAbort);

                callback(resolve, reject);
            });
        },
        [],
    );

    const cancel = () => {
        abortControllerRef.current.abort();
    };

    // Clean up the signal event listener on unmount
    useEffect(() => {
        const cleanup = () => {
            signalRef.current.removeEventListener("abort", handleAbort);
        };

        const handleAbort = () => {
            cleanup();
        };

        signalRef.current.addEventListener("abort", handleAbort);

        return () => {
            cleanup();
        };
    }, []);

    return { cancellablePromise, cancel };
};

export default useCancellable;
