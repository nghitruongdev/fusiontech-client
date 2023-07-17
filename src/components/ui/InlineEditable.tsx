import { CloseIcon, CheckIcon, DeleteIcon } from "@chakra-ui/icons";
import {
    useEditableControls,
    ButtonGroup,
    IconButton,
    Editable,
    Tooltip,
    EditablePreview,
    useColorModeValue,
    Input,
    EditableInput,
    EditableProps,
    InputProps,
    Icon,
} from "@chakra-ui/react";
import { Ban, MinusCircle, Trash } from "lucide-react";
import {
    createContext,
    forwardRef,
    useEffect,
    useRef,
    PropsWithChildren,
    useContext,
} from "react";

type State = {
    control: ReturnType<typeof useEditableControls>;
} & Props;
const Context = createContext<State | null>(null);
const useEditableContext = () => {
    const ctx = useContext(Context);
    if (!ctx) throw new Error("Editable.Provider is missing");
    return ctx;
};
const Provider = ({ children, ...props }: PropsWithChildren<Props>) => {
    const methods = useEditableControls();
    return (
        <Context.Provider value={{ control: methods, ...props }}>
            {children}
        </Context.Provider>
    );
};

type Props = {
    inputProps?: InputProps;
    editableProps?: EditableProps;
    remove?: () => void;
    showButtonControl?: boolean;
    value?: string;
};

const InlineEditable = forwardRef((props: Props, ref) => {
    const { editableProps, remove, showButtonControl, value } = props;
    const previewRef = useRef(null);
    const inputRef = useRef(null);
    // const isHover = useHover(previewRef);

    useEffect(() => {
        console.log("inputRef.current", !!inputRef.current);
    }, [inputRef.current]);
    const onBlurHandler = () => {
        console.log("editable blurred");
        if (!value) remove?.();
    };
    return (
        <Editable
            isPreviewFocusable={true}
            selectAllOnFocus={true}
            placeholder={"Enter your placeholder here ⚡️"}
            {...editableProps}
            _placeholder={{
                color: "red",
            }}
            onBlur={onBlurHandler}
        >
            <Provider {...props}>
                <div className="flex items-center">
                    <DeleteButton />
                    <Preview />
                    <InlineInput />
                </div>
                {showButtonControl && <EditableControls />}
            </Provider>
            {/* isHover && remove && */}
        </Editable>
    );
});
const DeleteButton = () => {
    const { remove } = useEditableContext();
    return (
        <>
            {remove && (
                <IconButton
                    icon={
                        <Icon
                            as={MinusCircle}
                            color={"white"}
                            fill={"red.500"}
                            _hover={{
                                fill: "red.400",
                            }}
                        />
                    }
                    boxSize={"fit-content"}
                    p={0}
                    onClick={remove}
                    aria-label="Delete feature"
                    variant="unstyled"
                    display={"flex"}
                    justifyContent="center"
                />
            )}
        </>
    );
};

const Preview = () => {
    const { value } = useEditableContext();

    return (
        <Tooltip label={`Chỉnh sửa`} shouldWrapChildren={true}>
            <EditablePreview
                py={2}
                px={2}
                _hover={{
                    background: useColorModeValue("gray.100", "gray.700"),
                }}
                color={value ? "gray.600" : "gray.500"}
            />
        </Tooltip>
    );
};

const InlineInput = () => {
    const { inputProps, remove } = useEditableContext();
    const inputRef = useRef<HTMLInputElement>(null);
    const onBlurHandler = () => {
        console.log("inputRef.current?.value", inputRef.current?.value);
        if (!inputRef.current?.value) {
            remove?.();
        }
        console.log("inputBlur");
    };
    return (
        <Input
            py={2}
            px={4}
            as={EditableInput}
            {...inputProps}
            ref={inputRef}
            {...(remove && { onBlur: onBlurHandler })}
        />
    );
};

const EditableControls = () => {
    const {
        control: { isEditing, getCancelButtonProps, getSubmitButtonProps },
    } = useEditableContext();
    return isEditing ? (
        <ButtonGroup justifyContent="end" size="sm" w="full" spacing={2} mt={2}>
            <IconButton
                icon={<CheckIcon />}
                {...getSubmitButtonProps()}
                aria-label="Check icon"
            />
            <IconButton
                icon={<CloseIcon boxSize={3} />}
                {...getCancelButtonProps()}
                aria-label="Close Icon"
            />
        </ButtonGroup>
    ) : null;
};

export default InlineEditable;
