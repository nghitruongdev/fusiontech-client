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
    useDisclosure,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";

export type MenuItem = ButtonProps & {
    text: string;
};

function MenuOptions({ items }: { items: MenuItem[] }) {
    const disclosure = useDisclosure();
    const { onClose } = disclosure;
    return (
        /**
         * You may move the Popover outside Flex.
         */
        <Flex justifyContent="center" mt={4}>
            <Popover placement="bottom" isLazy {...disclosure}>
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
                            {items.map(({ text, onClick, ...item }) => (
                                <Button
                                    key={text}
                                    w="200px"
                                    variant="ghost"
                                    justifyContent="space-between"
                                    fontWeight="normal"
                                    fontSize="sm"
                                    onClick={(event) => {
                                        onClick?.(event);
                                        onClose();
                                    }}
                                    {...item}
                                >
                                    {text}
                                </Button>
                            ))}
                        </Stack>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </Flex>
    );
}

export default MenuOptions;
