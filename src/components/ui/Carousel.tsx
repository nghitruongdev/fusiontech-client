"use client";
import React from "react";
import {
    Box,
    IconButton,
    useBreakpointValue,
    Stack,
    Heading,
    Text,
    Container,
} from "@chakra-ui/react";
// Here we have used react-icons package for the icons
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
// And react-slick as our Carousel Lib
import Slider from "react-slick";
import {
    banner1,
    banner2,
    banner3,
    banner4,
    banner5,
} from "public/assets/images";

// Settings for the slider
const settings = {
    dots: true,
    arrows: true,
    fade: true,
    infinite: true,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
};

export default function CaptionCarousel() {
    // As we have used custom buttons, we need a reference variable to
    // change the state
    const [slider, setSlider] = React.useState<Slider | null>(null);

    // These are the breakpoints which changes the position of the
    // buttons as the screen size changes
    const top = useBreakpointValue({ base: "90%", md: "50%" });
    const side = useBreakpointValue({ base: "30%", md: "40px" });

    const hoverIconColor = {
        bg: "gray.50",
        opacity: "0.4",
        color: "gray.800",
    };
    // This list contains all the data for carousels
    // This can be static or loaded from a server
    const cards = [
        {
            title: "Design Projects 1",
            text: "The project board is an exclusive resource for contract work. It's perfect for freelancers, agencies, and moonlighters.",
            image: banner1.src,
        },
        {
            title: "Design Projects 2",
            text: "The project board is an exclusive resource for contract work. It's perfect for freelancers, agencies, and moonlighters.",
            image: banner2.src,
        },
        {
            title: "Design Projects 3",
            text: "The project board is an exclusive resource for contract work. It's perfect for freelancers, agencies, and moonlighters.",
            image: banner3.src,
        },
        {
            title: "Design Projects 3",
            text: "The project board is an exclusive resource for contract work. It's perfect for freelancers, agencies, and moonlighters.",
            image: banner4.src,
        },
        {
            title: "Design Projects 3",
            text: "The project board is an exclusive resource for contract work. It's perfect for freelancers, agencies, and moonlighters.",
            image: banner5.src,
        },
    ];

    return (
        <Box
            position={"relative"}
            // height={"310px"}
            height="full"
            width={"full"}
            overflow={"hidden"}
            // color="gray.500"
            color="whiteAlpha.800"
            role="group"
            cursor="pointer"
            className="rounded-lg"
        >
            {/* CSS files for react-slick */}
            <link
                rel="stylesheet"
                type="text/css"
                charSet="UTF-8"
                href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
            />
            <link
                rel="stylesheet"
                type="text/css"
                href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
            />
            {/* Left Icon */}
            <IconButton
                aria-label="left-arrow"
                variant="ghost"
                color={"whiteAlpha.500"}
                _hover={hoverIconColor}
                position="absolute"
                left={side}
                top={top}
                transform={"translate(0%, -50%)"}
                zIndex={2}
                onClick={() => slider?.slickPrev()}
            >
                <BiLeftArrowAlt size="40px" />
            </IconButton>
            {/* Right Icon */}
            <IconButton
                aria-label="right-arrow"
                variant="ghost"
                position="absolute"
                color="whiteAlpha.500"
                // display="none"
                // _groupHover={{
                //     display: "block",
                // }}
                _hover={hoverIconColor}
                right={side}
                top={top}
                transform={"translate(0%, -50%)"}
                zIndex={2}
                onClick={() => slider?.slickNext()}
            >
                <BiRightArrowAlt size="40px" />
            </IconButton>
            {/* Slider */}
            <Slider {...settings} ref={(slider) => setSlider(slider)}>
                {cards.map((card, index) => (
                    <Box
                        key={index}
                        height={"410px"} // Thay đổi chiều cao của Box ở đây
                        width={"100%"} // Thay đổi chiều rộng của Box ở đây
                        position="relative"
                        overflow="hidden"
                        backgroundPosition="center"
                        backgroundRepeat="no-repeat"
                        backgroundSize="100% 100%"
                        backgroundImage={`url(${card.image})`}
                    >
                        {/* This is the block you need to change, to customize the caption */}
                        {/* <Container
                            size="container.lg"
                            height="600px"
                            position="relative"
                        >
                            <Stack
                                spacing={6}
                                w={"full"}
                                maxW={"lg"}
                                position="absolute"
                                top="50%"
                                transform="translate(0, -50%)"
                            >
                                <Heading
                                    fontSize={{
                                        base: "3xl",
                                        md: "4xl",
                                        lg: "5xl",
                                    }}
                                >
                                    {card.title}
                                </Heading>
                                <Text
                                    fontSize={{ base: "md", lg: "lg" }}
                                    color="GrayText"
                                >
                                    {card.text}
                                </Text>
                            </Stack>
                        </Container> */}
                    </Box>
                ))}
            </Slider>
        </Box>
    );
}
