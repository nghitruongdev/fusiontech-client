import {
    Button,
    FormHelperText,
    Input,
    InputGroup,
    InputProps,
    InputRightElement,
    forwardRef,
} from "@chakra-ui/react";
import React from "react";

const PasswordInput = forwardRef<InputProps, "input">((props, ref) => {
    const [show, setShow] = React.useState(false);
    const handleClick = () => setShow(!show);

    return (
        <>
            <InputGroup size="md">
                <Input
                    pr="4.5rem"
                    placeholder="Nhập mật khẩu"
                    {...props}
                    type={show ? "text" : "password"}
                    ref={ref}
                />
                <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                        {show ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
            <FormHelperText color="gray.500" fontSize={"sm"}>
                Mật khẩu tối thiểu 8 ký tự
            </FormHelperText>
        </>
    );
});
export default PasswordInput;

export const validatePassword = (password: string) => {
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};
