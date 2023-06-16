"use client";
import {
    Container,
    Heading,
    Box,
    Flex,
    Text,
    Stack,
    HStack,
    Avatar,
    useColorModeValue,
    SimpleGrid,
} from "@chakra-ui/react";
import ButtonPrimary from "@components/ButtonPrimary";
import { Button } from "components/ui/button";
import { Separator } from "components/ui/separator";

const reviewData = [
    {
        avatarSrc:
            "https://s.gravatar.com/avatar/4f9135f54df98fe894a9f9979d600a87?s=80",
        review: `What a wonderful little cottage! More spacious and adorable than the What a wonderful little cottage! More spacious and adorable than the
            pictures show. We never met our hosts and...`,
        stars: 3,
        userName: "Ahmad",
        dateTime: "2 months ago",
    },
    {
        avatarSrc: "",
        review: `What a wonderful little cottage! More spacious and adorable than the
            pictures show. We never met our hosts, but we felt welcomed and...`,
        stars: 4,
        userName: "Ali",
        dateTime: "1 months ago",
    },
    {
        avatarSrc: "",
        review: `What a wonderful little cottage! More spacious and adorable than the
            pictures show. We never met our hosts, but we felt welcomed and...`,
        stars: 2,
        userName: "Zac",
        dateTime: "4 months ago",
    },
];

const ratingSummary = [
    { id: 1, rating: 5, percentage: "80%" },
    { id: 2, rating: 4, percentage: "65%" },
    { id: 3, rating: 3, percentage: "35%" },
    { id: 4, rating: 2, percentage: "75%" },
    { id: 5, rating: 1, percentage: "55%" },
];

const Review = () => {
    return (
        <>
            <div className="grid grid-cols-3 gap-4 border shadow-md rounded-lg p-4">
                <div className="mx-auto">
                    <p>
                        <span className="text-[72px] font-bold">4.5</span>{" "}
                        <span className="text-4xl font-extrabold leading-loose">
                            trên{" "}
                        </span>
                        <span className="text-[72px] font-bold">5</span>
                    </p>
                    <Box as="div" className="flex items-center justify-between">
                        <div className="">
                            <HStack>
                                <Flex alignItems="center" justify="start">
                                    {Array.from(Array(4).keys()).map((id) => {
                                        return (
                                            <Star
                                                key={id}
                                                fillColor="#EACA4E"
                                            />
                                        );
                                    })}
                                    {Array.from(Array(5 - 4).keys()).map(
                                        (id) => {
                                            return (
                                                <Star
                                                    key={id}
                                                    fillColor="#e2e8f0"
                                                />
                                            );
                                        },
                                    )}
                                </Flex>
                            </HStack>
                            <Text
                                fontWeight="medium"
                                fontSize="sm"
                                className=" underline"
                            >
                                (1355 ratings)
                            </Text>
                        </div>
                        <div className="">
                            <Button
                                variant="secondary"
                                className="my-2 shadow-md font-medium text-sm bg-blue-600 text-white hover:bg-blue-700"
                            >
                                Đánh giá ngay
                            </Button>
                        </div>
                    </Box>
                </div>
                <Container
                    className="col-span-2 h-full"
                    // maxW="5xl"
                    // p={{ base: 5, md: 10 }}
                    // className="col-span-2"
                >
                    <Box mb={8} mx="auto h-full">
                        {/* <Heading
                        as="h3"
                        size="lg"
                        fontWeight="bold"
                        textAlign="left"
                        mb={3}
                    >
                        Audience rating summary
                    </Heading> */}
                        {/* <Stack spacing={3}> */}
                        <Flex
                            direction="column"
                            justify="space-between"
                            h="full"
                        >
                            {ratingSummary.map((data) => {
                                return (
                                    <HStack
                                        key={data.id}
                                        spacing={5}
                                        mr={0}
                                        pr={0}
                                    >
                                        <Text fontWeight="bold" fontSize="md">
                                            {data.rating}
                                        </Text>
                                        <Box w={{ base: "100%", md: "70%" }}>
                                            <Box
                                                w="100%"
                                                bg={useColorModeValue(
                                                    "gray.300",
                                                    "gray.600",
                                                )}
                                                rounded="md"
                                            >
                                                <Box
                                                    w={data.percentage}
                                                    h={3}
                                                    bg="yellow.400"
                                                    rounded="md"
                                                ></Box>
                                            </Box>
                                        </Box>
                                        <Text fontWeight="bold" fontSize="md">
                                            {data.percentage}
                                        </Text>
                                    </HStack>
                                );
                            })}
                        </Flex>
                        {/* </Stack> */}
                    </Box>
                </Container>
            </div>
            <Separator />
            <div className="p-4">
                <Box>
                    {/* <Heading
                        as="h3"
                        size="lg"
                        fontWeight="bold"
                        textAlign="left"
                        mb={4}
                    >

                    </Heading> */}
                    <Stack direction="column" spacing={5}>
                        {reviewData.map((review, index) => {
                            return (
                                <Box key={index}>
                                    <HStack spacing={3} mb={2}>
                                        <Avatar
                                            size="md"
                                            name={review.userName}
                                            src={review.avatarSrc}
                                        />
                                        <Stack direction="column" spacing={2}>
                                            <Text
                                                fontWeight="bold"
                                                fontSize="md"
                                            >
                                                {review.userName}
                                            </Text>
                                            <Flex
                                                alignItems="center"
                                                justify="start"
                                            >
                                                {Array.from(
                                                    Array(review.stars).keys(),
                                                ).map((id) => {
                                                    return (
                                                        <Star
                                                            key={id}
                                                            fillColor="#EACA4E"
                                                        />
                                                    );
                                                })}
                                                {Array.from(
                                                    Array(
                                                        5 - review.stars,
                                                    ).keys(),
                                                ).map((id) => {
                                                    return (
                                                        <Star
                                                            key={id}
                                                            fillColor="#e2e8f0"
                                                        />
                                                    );
                                                })}
                                            </Flex>
                                        </Stack>
                                    </HStack>
                                    <Text
                                        color={useColorModeValue(
                                            "gray.700",
                                            "gray.400",
                                        )}
                                        fontSize="0.87rem"
                                        textAlign="left"
                                        lineHeight="1.375"
                                        fontWeight="300"
                                    >
                                        {review.review}
                                    </Text>
                                </Box>
                            );
                        })}
                    </Stack>
                </Box>
            </div>
        </>
    );
};

const Star = ({ fillColor }: { fillColor: string }) => {
    return (
        <svg
            style={{
                width: "1rem",
                height: "1rem",
                fill: fillColor,
                marginRight: "0.25rem",
            }}
            viewBox="0 0 1000 1000"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M972 380c9 28 2 50-20 67L725 619l87 280c11 39-18 75-54 75-12 0-23-4-33-12L499 790 273 962a58 58 0 0 1-78-12 50 50 0 0 1-8-51l86-278L46 447c-21-17-28-39-19-67 8-24 29-40 52-40h280l87-279c7-23 28-39 52-39 25 0 47 17 54 41l87 277h280c24 0 45 16 53 40z" />
        </svg>
    );
};

export default Review;
