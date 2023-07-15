"use client";
import { useEffect, useRef } from "react";
import { Portal, PortalProps, forwardRef } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { ConfirmDialog } from "./ConfirmDialog";
import { create } from "zustand";

type AlertProps = {
    header: ReactNode;
    message: ReactNode;
    cancelText?: string;
    okText?: string;
};

interface AnyEvent {
    preventDefault(): void;
}

type StoreState = {
    dialog: ReactNode;
    createDialog?: (props: AlertProps) => Promise<unknown>;
    setDialog: (dialog: StoreState["dialog"]) => void;
    setCreateDialog: (fn: StoreState["createDialog"]) => void;
};

const dialogStore = create<StoreState>()((set) => ({
    dialog: null,
    setDialog: (dialog) => set(() => ({ dialog })),
    setCreateDialog: (fn) => set(() => ({ createDialog: fn })),
}));

const DialogProvider = () => {
    const [dialog, setCreateDialog] = dialogStore(
        ({ dialog, setCreateDialog }) => [dialog, setCreateDialog],
    );

    useEffect(() => {
        setCreateDialog(createDialog);
    }, []);

    return <Portal>{dialog}</Portal>;
};

export const useDialog = () => {
    const [create] = dialogStore((state) => [state.createDialog]);

    const createDialog = (props: AlertProps) => {
        if (!create) {
            throw new Error("Cannot found create dialog");
        }
        return create(props);
    };
    return {
        confirm: (props: AlertProps) => createDialog(props),
    };
};

const setDialog = (dialog: StoreState["dialog"]) =>
    dialogStore.setState(() => ({ dialog }));

const createDialog = (props: AlertProps) => {
    const onOk = (res: (value: unknown) => void, e?: AnyEvent) => {
        e?.preventDefault();
        setDialog(null);
        res(true);
    };

    const onCancel = (res: (value: unknown) => void, e?: AnyEvent) => {
        e?.preventDefault();
        setDialog(null);
        res(undefined);
    };

    return new Promise((res) => {
        setDialog(
            <ConfirmDialog
                {...props}
                onOk={onOk.bind(null, res)}
                onCancel={onCancel.bind(null, res)}
            />,
        );
    });
};

export default DialogProvider;
