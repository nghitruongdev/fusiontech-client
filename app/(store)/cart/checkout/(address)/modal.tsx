import {
    useDisclosure,
    Flex,
    Portal,
    Modal,
    Radio,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    RadioGroup,
    ModalFooter,
    Button,
    Input,
    Select,
    Checkbox,
    FormControl,
    FormLabel,
} from "@chakra-ui/react";
import FormInput from "@components/ui/FormInput";
import MenuOptions, { MenuItem } from "@components/ui/MenuOptions";
import { HomeIcon, Building } from "lucide-react";
import React, { ReactNode, useState } from "react";
import { BsChatSquareQuote } from "react-icons/bs";
import { RiFileShredLine, RiShutDownLine } from "react-icons/ri";
import AddressBox from "./AddressBox";

export const AddressModalList = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selected, setSelected] = useState<string>("1");
    const btnRef = React.useRef(null);
    const [defaultAddress, setDefaultAddress] = useState<string>("1");

    const AddressRadioBox = ({
        value,
        isSelected,
    }: {
        value: string;
        isSelected?: boolean;
    }) => {
        const { isOpen, onOpen, onClose } = useDisclosure();
        const isDefault = defaultAddress === value;
        const items: MenuItem[] = [
            {
                text: "Edit",
                rightIcon: <BsChatSquareQuote />,
                onClick: onOpen,
                w: "150px",
            },
            {
                text: "Mark default",
                rightIcon: <RiFileShredLine />,
                onClick: setDefaultAddress.bind(this, value),
                w: "150px",
                isDisabled: isDefault,
            },
            {
                text: "Delete",
                rightIcon: <RiShutDownLine />,
                colorScheme: "red",
                onClick: () => {},
                w: "150px",
            },
        ];

        return (
            <div className="flex items-center mt-4">
                <Flex as="label" flexGrow="1" gap="2">
                    <Radio value={value} />
                    <AddressBox
                        className={`flex-1 ${
                            isSelected ? "border-sky-600" : ""
                        }`}
                        isDefault={isDefault}
                    />
                </Flex>

                <div className="mx-4">
                    <MenuOptions items={items} />
                    <Portal>
                        <AddressModalForm isOpen={isOpen} onClose={onClose} />
                    </Portal>
                </div>
            </div>
        );
    };

    return (
        <>
            <AddressBox
                onClick={onOpen}
                showCheck
                className="border-sky-600 bg-sky-50 text-gray-700"
            />

            <Modal
                onClose={onClose}
                finalFocusRef={btnRef}
                isOpen={isOpen}
                scrollBehavior={"inside"}
                isCentered
                size="lg"
            >
                <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(3px)" />
                <ModalContent>
                    <ModalHeader>Địa chỉ nhận hàng</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <RadioGroup
                            name="shippingAddress"
                            defaultValue={selected}
                            onChange={(value) => setSelected(value)}
                        >
                            {[1, 2, 3, 4].map((item) => (
                                <div>
                                    <AddressRadioBox
                                        value={item.toString()}
                                        isSelected={selected === item + ""}
                                        key={item}
                                    />
                                </div>
                            ))}
                        </RadioGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

const AddressModalForm = ({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) => {
    // const initialRef = React.useRef(null);
    // const finalRef = React.useRef(null);
    return (
        <>
            <Modal
                // initialFocusRef={initialRef}
                // finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
                size="lg"
            >
                <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(20px)" />
                <ModalContent className="h-ful">
                    <ModalHeader>Thay đổi địa chỉ</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        {/* <FormControl> */}
                        {/* <FormLabel>First name</FormLabel> */}
                        {/* <Input ref={initialRef} placeholder="First name" /> */}
                        {/* </FormControl> */}
                        <AddressForm />
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3}>
                            Save
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

const AddressForm = () => {
    return (
        <>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <FormInput
                    label="Họ và tên"
                    input={<Input placeholder="Họ và tên người nhận hàng" />}
                    isRequired
                />
                <FormInput
                    label="Điện thoại"
                    input={<Input placeholder="Số điện thoại" />}
                    isRequired
                />
            </div>
            <div className="mt-4">
                <FormInput
                    label="Address"
                    input={<Input placeholder="Tên đường, toà nhà, số nhà" />}
                    isRequired
                />
            </div>

            <div className="flex items-center gap-x-4 mt-6">
                <Select placeholder="Chọn xã/ phường">
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                </Select>
                <Select placeholder="Chọn quận/ huyện">
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                </Select>
                <Select placeholder="Chọn tỉnh/ thành phố">
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                </Select>
            </div>
            <div className="mt-6 flex gap-2 justify-between md:block">
                <div className="flex items-center gap-3">
                    <span>Loại địa chỉ</span>
                    <div className="flex flex-1 md:justify-center md:gap-4">
                        <p className="px-4 p-2 border-2 border-sky-600 bg-sky-50 rounded-md text-sky-600 flex items-center gap-2 text-sm font-semibold">
                            <HomeIcon /> Nhà riêng
                        </p>
                        <p className="px-4 p-2 border-0 border-gray-500 rounded-md text-gray-700 flex items-center gap-2 text-sm font-semibold">
                            <Building /> Văn phòng
                        </p>
                    </div>
                </div>

                <Checkbox className="md:mt-6">
                    Đặt làm địa chỉ mặc định
                </Checkbox>
            </div>
        </>
    );
};
