import { FormControl, FormLabel } from "@chakra-ui/react";
import { ReactNode } from "react";

const FormInput = ({
    isRequired = true,
    label,
    input,
}: {
    label: string;
    isRequired?: boolean;
    input: ReactNode;
}) => {
    return (
        <>
            <FormControl isRequired={isRequired}>
                <FormLabel className="text-sm font-semibold">
                    <span className="text-base font-semibold text-gray-800">
                        {label}
                    </span>
                </FormLabel>
                {input}
            </FormControl>
        </>
    );
};

export default FormInput;
