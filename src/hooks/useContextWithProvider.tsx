import { createContext, useContext, PropsWithChildren, ReactNode } from "react";

export function createContextWithProvider<T>() {
    const Context = createContext<T | null>(null);
    const useContextProvider = () => {
        const ctx = useContext(Context);
        if (!ctx) throw new Error("Context Provider is missing");
        return ctx;
    };

    const ContextProvider = ({
        children,
        provider,
    }: {
        children: ReactNode;
        provider: T;
    }) => {
        return <Context.Provider value={provider}>{children}</Context.Provider>;
    };

    return {
        useContextProvider,
        ContextProvider,
    };
}
