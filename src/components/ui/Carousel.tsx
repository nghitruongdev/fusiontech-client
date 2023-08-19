/** @format */

'use client'
import React from 'react'
import {
  Box,
  IconButton,
  useBreakpointValue,
  Stack,
  Heading,
  Text,
  Container,
} from '@chakra-ui/react'
// Here we have used react-icons package for the icons
import { BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi'
// And react-slick as our Carousel Lib
import Slider from 'react-slick'
import Image from 'next/image'
import { cn } from 'components/lib/utils'

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
}

export default function CaptionCarousel() {
  // As we have used custom buttons, we need a reference variable to
  // change the state
  const [slider, setSlider] = React.useState<Slider | null>(null)

  // These are the breakpoints which changes the position of the
  // buttons as the screen size changes
  const top = useBreakpointValue({ base: '90%', md: '50%' })
  const side = useBreakpointValue({ base: '30%', md: '40px' })

  const hoverIconColor = {
    bg: 'gray.50',
    opacity: '0.4',
    color: 'gray.800',
  }
  // This list contains all the data for carousels
  // This can be static or loaded from a server
  //   const cards = [
  //     {
  //       title: 'Design Projects 1',
  //       text: "The project board is an exclusive resource for contract work. It's perfect for freelancers, agencies, and moonlighters.",
  //       image:
  //         'https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fbanner%2FCauhinhcuckhung-800x447.jpg?alt=media&token=0e93b789-4dd7-48ba-a27c-0fb069c8f11d',
  //     },
  //     {
  //       title: 'Design Projects 2',
  //       text: "The project board is an exclusive resource for contract work. It's perfect for freelancers, agencies, and moonlighters.",
  //       image:
  //         'https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fbanner%2Fbanner-laptop-gaming-he-1683277063.png?alt=media&token=c1b6a76f-0f36-43ca-b537-0701fdee1fd3',
  //     },
  //     {
  //       title: 'Design Projects 3',
  //       text: "The project board is an exclusive resource for contract work. It's perfect for freelancers, agencies, and moonlighters.",
  //       image:
  //         'https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fbanner%2Fbanner2.png?alt=media&token=826780d6-fd40-411e-bcf7-fa7bed96b47e',
  //     },
  //     {
  //       title: 'Design Projects 3',
  //       text: "The project board is an exclusive resource for contract work. It's perfect for freelancers, agencies, and moonlighters.",
  //       image:
  //         'https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fbanner%2Fbanner3.jpg?alt=media&token=69111a00-4840-48b5-ac60-981bec66706a',
  //     },
  //     {
  //       title: 'Design Projects 3',
  //       text: "The project board is an exclusive resource for contract work. It's perfect for freelancers, agencies, and moonlighters.",
  //       image:
  //         'https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fbanner%2Fbanner4.png?alt=media&token=9403ae1f-e72c-4a31-a633-7eae88ce52f6',
  //     },
  //     {
  //       title: 'Design Projects 3',
  //       text: "The project board is an exclusive resource for contract work. It's perfect for freelancers, agencies, and moonlighters.",
  //       image:
  //         'https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fbanner%2Fbanner5.jpg?alt=media&token=b8ed2853-9db0-45d1-abe6-cedd39359446',
  //     },
  //     {
  //       title: 'Design Projects 3',
  //       text: "The project board is an exclusive resource for contract work. It's perfect for freelancers, agencies, and moonlighters.",
  //       image:
  //         'https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fbanner%2Fbanner6.jpg?alt=media&token=3f89b71c-9864-45aa-9251-b7c659d7c0ec',
  //     },
  //     {
  //       title: 'Design Projects 3',
  //       text: "The project board is an exclusive resource for contract work. It's perfect for freelancers, agencies, and moonlighters.",
  //       image:
  //         'https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fbanner%2Fbanner7.jpg?alt=media&token=68edd42c-2a29-432e-8da0-ea9d97edb2f5',
  //     },
  //     {
  //       title: 'Design Projects 3',
  //       text: "The project board is an exclusive resource for contract work. It's perfect for freelancers, agencies, and moonlighters.",
  //       image:
  //         'https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fbanner%2Fbanner8.jpg?alt=media&token=9195abfe-cd68-468b-8126-ccf9895f4fd1',
  //     },
  //     {
  //       title: 'Design Projects 3',
  //       text: "The project board is an exclusive resource for contract work. It's perfect for freelancers, agencies, and moonlighters.",
  //       image:
  //         'https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fbanner%2Fbanner9.png?alt=media&token=776b0e37-98ef-4b6b-8003-b69ded9ee704',
  //     },
  //   ]

  const cards = [
    {
      title: '',
      text: '',
      image:
        'https://images.macrumors.com/t/jFpMAW3JISRXIFK4P8SsffxTxoQ=/2000x/article-new/2022/09/samsung-anti-apple-ad.jpg',
    },
    {
      image: 'https://cdn.mos.cms.futurecdn.net/YadkjYkdWbt53C7nE5cbJ5.jpg',
      title: '',
      text: '',
    },
  ]

  return (
    <Box
      position={'relative'}
      // height={"310px"}
      height='full'
      width={'full'}
      overflow={'hidden'}
      // color="gray.500"
      color='whiteAlpha.800'
      role='group'
      cursor='pointer'
      className='rounded-lg'>
      {/* CSS files for react-slick */}
      <link
        rel='stylesheet'
        type='text/css'
        charSet='UTF-8'
        href='https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css'
      />
      <link
        rel='stylesheet'
        type='text/css'
        href='https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css'
      />
      {/* Left Icon */}
      <IconButton
        aria-label='left-arrow'
        variant='ghost'
        color={'whiteAlpha.500'}
        _hover={hoverIconColor}
        position='absolute'
        left={side}
        top={top}
        transform={'translate(0%, -50%)'}
        zIndex={2}
        onClick={() => slider?.slickPrev()}>
        <BiLeftArrowAlt size='40px' />
      </IconButton>
      {/* Right Icon */}
      <IconButton
        aria-label='right-arrow'
        variant='ghost'
        position='absolute'
        color='whiteAlpha.500'
        // display="none"
        // _groupHover={{
        //     display: "block",
        // }}
        _hover={hoverIconColor}
        right={side}
        top={top}
        transform={'translate(0%, -50%)'}
        zIndex={2}
        onClick={() => slider?.slickNext()}>
        <BiRightArrowAlt size='40px' />
      </IconButton>
      {/* Slider */}
      <Slider
        {...settings}
        ref={(slider) => setSlider(slider)}>
        {cards.map((card, index) => (
          <Image
            src={card.image}
            alt={card.text}
            key={index}
            className={cn(`aspect-video h-[350px]`)}
            width='1000'
            height='500'
          />
          //   <Box
          //     key={index}
          //     // height={'410px'} // Thay đổi chiều cao của Box ở đây
          //     width={'100%'} // Thay đổi chiều rộng của Box ở đây
          //     height={'container.md'}
          //     position='relative'
          //     overflow='hidden'
          //     backgroundPosition='center'
          //     backgroundRepeat='no-repeat'
          //     backgroundSize='100% 100%'
          //     backgroundImage={`url(${card.image})`}>
          //     {/* This is the block you need to change, to customize the caption */}
          //     {/* <Container
          //                     size="container.lg"
          //                     height="600px"
          //                     position="relative"
          //                 >
          //                     <Stack
          //                         spacing={6}
          //                         w={"full"}
          //                         maxW={"lg"}
          //                         position="absolute"
          //                         top="50%"
          //                         transform="translate(0, -50%)"
          //                     >
          //                         <Heading
          //                             fontSize={{
          //                                 base: "3xl",
          //                                 md: "4xl",
          //                                 lg: "5xl",
          //                             }}
          //                         >
          //                             {card.title}
          //                         </Heading>
          //                         <Text
          //                             fontSize={{ base: "md", lg: "lg" }}
          //                             color="GrayText"
          //                         >
          //                             {card.text}
          //                         </Text>
          //                     </Stack>
          //                 </Container> */}
          //   </Box>
        ))}
      </Slider>
    </Box>
  )
}
