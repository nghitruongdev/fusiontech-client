import {
    Button,
    ButtonProps,
    Flex,
    IconButton,
    MenuItem,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Stack,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";

export type MenuItem = ButtonProps & {
    text: string;
};

function MenuOptions({ items }: { items: MenuItem[] }) {
    return (
        /**
         * You may move the Popover outside Flex.
         */
        <Flex justifyContent="center" mt={4}>
            <Popover placement="bottom" isLazy>
                <PopoverTrigger>
                    <IconButton
                        aria-label="More server options"
                        icon={<BsThreeDotsVertical />}
                        variant="solid"
                        w="fit-content"
                    />
                </PopoverTrigger>
                <PopoverContent w="fit-content" _focus={{ boxShadow: "none" }}>
                    <PopoverArrow />
                    <PopoverBody>
                        <Stack>
                            {items.map(({ text, ...item }) => (
                                <>
                                    <Button
                                        w="194px"
                                        variant="ghost"
                                        justifyContent="space-between"
                                        fontWeight="normal"
                                        fontSize="sm"
                                        {...item}
                                    >
                                        {text}
                                    </Button>
                                </>
                            ))}
                        </Stack>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </Flex>
    );
}

export default MenuOptions;
