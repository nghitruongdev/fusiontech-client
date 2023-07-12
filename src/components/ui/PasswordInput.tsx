import {
    Button,
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
        <InputGroup size="md">
            <Input
                pr="4.5rem"
                placeholder="Enter password"
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
    );
});
export default PasswordInput;
