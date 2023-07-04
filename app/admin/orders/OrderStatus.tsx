"use client";
import { IOrderStatus, IProblemResponse } from "types";
import {
    Badge,
    useEditableControls,
    Select,
    ButtonGroup,
    IconButton,
    CloseButton,
    Editable,
    EditablePreview,
    Tooltip,
} from "@chakra-ui/react";
import { useUpdate } from "@refinedev/core";
import { Check, Loader } from "lucide-react";
import { useState, useEffect } from "react";

export const OrderStatus = ({
    status,
    control,
}: {
    status: IOrderStatus;
    control: React.ReactNode;
}) => {
    return (
        <Editable
            value={status.detailName}
            isPreviewFocusable={true}
            selectAllOnFocus={false}
        >
            <Tooltip label="Click to change" shouldWrapChildren={true}>
                <Badge
                    as={EditablePreview}
                    colorScheme={statusColor(status)}
                    px={4}
                />
            </Tooltip>
            {control}
        </Editable>
    );
};

export const EditableControls = ({
    options,
    status,
    orderId,
}: {
    options: { label: string; value: IOrderStatus }[];
    status: IOrderStatus;
    orderId: string;
}) => {
    const { mutate, isLoading, isError, isSuccess } = useUpdate();

    const {
        isEditing,
        getSubmitButtonProps: submitProps,
        getCancelButtonProps,
        getEditButtonProps,
    } = useEditableControls();
    const [selectedStatus, setSelectedStatus] = useState<IOrderStatus>();

    const findStatus = (name: string): IOrderStatus | undefined => {
        return options.find((option) => option.value.name === name)?.value;
    };

    useEffect(() => {
        setSelectedStatus(status);
    }, [status]);

    const onChangeHandler = (event: any) => {
        setSelectedStatus(findStatus(event.target.value));
    };

    const submitHandler = async (event: any) => {
        mutate(
            {
                resource: "orders",
                id: orderId,
                values: selectedStatus?.name ?? "",
                meta: {
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
                errorNotification(error, values, resource) {
                    const {
                        data: { title, detail },
                    } = error?.response as IProblemResponse;
                    return {
                        message: `Lỗi khi cập nhật trạng thái đơn hàng(status code: ${error?.statusCode})`,
                        type: "error",
                        description: `${title} - ${detail}`,
                    };
                },
            },
            {
                onSuccess: () => {
                    submitProps().onClick?.(event);
                },
            },
        );
    };

    if (isEditing)
        return (
            <>
                {" "}
                <Select
                    value={selectedStatus?.name ?? "Loading..."}
                    size="sm"
                    variant="outline"
                    rounded={"md"}
                    onChange={onChangeHandler}
                    colorScheme={statusColor(selectedStatus)}
                >
                    {options
                        .filter((item) => item.value.id >= status.id)
                        .map((item) => (
                            <option key={item.label} value={item.value.name}>
                                {item.label}
                            </option>
                        ))}
                </Select>
                <ButtonGroup
                    justifyContent="end"
                    size="sm"
                    w="full"
                    spacing={2}
                    mt={2}
                >
                    <IconButton
                        aria-label={""}
                        icon={!isLoading ? <Check /> : <Loader />}
                        {...submitProps()}
                        onClick={(event) => {
                            submitHandler(event);
                        }}
                    />
                    <CloseButton {...getCancelButtonProps()} />
                </ButtonGroup>
            </>
        );
};

export const statusColor = (status: IOrderStatus | undefined) => {
    switch (status?.group) {
        case "CANCELLED":
            return "red";
        case "VERIFY":
            return "gray";
        case "PROCESSING":
            return "orange";
        case "ON_DELIVERY":
            return "linkedin";
        case "COMPLETED":
            return "green";
        case "FAILED":
            return "purple";
    }
};
