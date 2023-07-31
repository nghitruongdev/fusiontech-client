import React from "react";
import { IconButton, useBreakpointValue } from "@chakra-ui/react";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import Slider from "react-slick";

interface SliderButtonProps {
    sliderRef: React.MutableRefObject<Slider | null>; // Thêm kiểu cho sliderRef ở đây
}

const SliderButton: React.FC<SliderButtonProps> = ({ sliderRef }) => {
    const top = useBreakpointValue({ base: "90%", md: "50%" });
    const side = useBreakpointValue({ base: "30%", md: "40px" });

    return (
        <>
            <IconButton
                aria-label="left-arrow"
                variant="solid"
                color={"black"}
                position="absolute"
                left={side}
                top={top}
                transform={"translate(-140%, -50%)"}
                zIndex={2}
                onClick={() => sliderRef.current?.slickPrev()}
                bg="white"
            >
                <BiLeftArrowAlt size="40px" />
            </IconButton>
            <IconButton
                aria-label="right-arrow"
                variant="solid"
                position="absolute"
                color={"black"}
                bg="white"
                right={side}
                top={top}
                transform={"translate(140%, -50%)"}
                zIndex={2}
                onClick={() => sliderRef.current?.slickNext()}
            >
                <BiRightArrowAlt size="40px" />
            </IconButton>
        </>
    );
};

export default SliderButton;
