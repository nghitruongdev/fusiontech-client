import {
    FormControl,
    FormLabel,
    FormHelperText,
    FormErrorMessage,
    FormControlProps,
    FormHelperTextProps,
    FormLabelProps,
} from "@chakra-ui/react";

type FormInputProps = FormControlProps & {
    children: React.ReactNode;
    label?: string;
    labelProps?: FormLabelProps;
    showError?: boolean;
    errorMessage?: string;
    helperText?: string;
    helperTextProps?: FormHelperTextProps;
};
const ChakraFormInput = ({
    children,
    label,
    labelProps,
    errorMessage,
    showError = true,
    helperText,
    helperTextProps,
    ...props
}: FormInputProps) => {
    return (
        <FormControl mb="3" {...props}>
            {!!label && <FormLabel {...labelProps}>{label}</FormLabel>}
            {children}
            {!!helperText && (
                <FormHelperText {...helperTextProps}>
                    {helperText}
                </FormHelperText>
            )}
            {showError && <FormErrorMessage>{errorMessage}</FormErrorMessage>}
        </FormControl>
    );
};

export default ChakraFormInput;
