/** @format */

'use client'
import React, { useEffect, useState, useRef } from 'react'
import reviewApi from 'src/api/reviewAPI'
import { FcBusinessman } from 'react-icons/fc'
import { AiFillStar } from 'react-icons/ai'
import Image from 'next/image'
import { loginImg } from '@public/assets/images'
import { IoIosArrowBack } from 'react-icons/io'
import useMyToast from '@/hooks/useToast'
import { format } from 'date-fns'
import {
  Container,
  Box,
  Flex,
  Text,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react'
import { useAuthUser } from '@/hooks/useAuth/useAuthUser'
import { useRouter } from 'next/navigation'
import useCallbackUrl from '@/hooks/useCallbackUrl'
import { NEXT_PATH } from 'types/constants'

const ReviewComponent = ({ productId }: { productId: string }) => {
  const [reviewList, setReviewList] = useState<any[]>([])
  const [averageRating, setAverageRating] = useState<number>(0)
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false)
  const [rating, setRating] = useState<number>(0)
  const [comment, setComment] = useState<string>('')
  const [userReviewed, setUserReviewed] = useState<boolean>(false)
  const { claims } = useAuthUser()
  const sortedReviewList = [...reviewList]
  const uid = claims?.id
  const { user } = useAuthUser()
  const router = useRouter()
  const { callbackUrl } = useCallbackUrl()
  /* Call api lấy các review từ product id */
  useEffect(() => {
    const fetchReviewList = async () => {
      try {
        const response = await reviewApi.get(`${productId}`)
        setReviewList(response.data)
        calculateAverageRating(response.data)
      } catch (error) {
        console.log('fail to fetch review list', error)
      }
    }
    if (productId) {
      fetchReviewList()
    }
  }, [productId]) // Khi giá trị ID thay đổi, sẽ gọi lại fetchReviewList
  {
    /* Hiển thị số sao dựa theo rating của user */
  }
  const renderRatingStars = (rating: number) => {
    const stars = []
    for (let i = 0; i < rating; i++) {
      stars.push(
        <AiFillStar
          key={i}
          className='w-5 h-5 text-yellow'
        />,
      )
    }
    return stars
  }

  {
    /* Button bật / tắt form đánh giá */
  }
  const ReviewFormButtonClick = () => {
    if (!user) {
      const url = encodeURIComponent(`${callbackUrl}#review-section`)
      router.push(`${NEXT_PATH['login']}?callbackUrl=${url}`)
      return
    }
    setShowReviewForm(!showReviewForm)
  }

  const handleRatingSelect = (selectedRating: number) => {
    setRating(selectedRating)
  }

  const handleCommentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setComment(event.target.value)
  }

  // Tạo một instance của useToast()
  const toast = useMyToast()
  // call Post api review
  const createReview = async (reviewData: any) => {
    try {
      const response = await reviewApi.create(reviewData)
      const newReview = response.data // Đánh giá mới được trả về từ API
      setReviewList((prevReviews) => [...prevReviews, newReview]) // Thêm đánh giá mới vào danh sách hiện tại
      console.log(response.data)
      toast
        .ok({
          title: 'Thành công',
          message: 'Đánh giá thành công',
        })
        .fire()
    } catch (error) {
      console.log('Lỗi khi tạo đánh giá:', error)
      toast
        .fail({
          title: 'Thành công',
          message: 'Đánh giá thất bại',
        })
        .fire()
    }
  }
  // gửi review khi user click button
  const handleReviewSubmit = (event: any) => {
    event.preventDefault()

    const now = new Date().toISOString() // Sử dụng định dạng ISO 8601
    const reviewData = {
      product: {
        id: productId,
      },
      user: {
        id: uid,
      },
      rating: rating,
      comment: comment,
      createdAt: now,
    }
    console.log(reviewData)
    createReview(reviewData)
    ReviewFormButtonClick()

    setRating(0)
    setComment('')
  }
  {
    /* Hàm tính đánh giá trung bình dựa trên rating */
  }
  const calculateAverageRating = (reviews: any[]) => {
    if (reviews.length > 0) {
      const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0,
      )
      const averageRating = totalRating / reviews.length
      setAverageRating(averageRating)
    } else {
      setAverageRating(0)
    }
  }

  // tính phần trăm review của 1,2,3,4,5 sao
  const calculatePercentage = (reviews: any[], rating: number) => {
    const totalReviews = reviews.length
    if (totalReviews === 0) {
      return '0%'
    }

    const ratingCount = reviews.filter(
      (review) => review.rating === rating,
    ).length
    const percentage = Math.round((ratingCount / totalReviews) * 100)
    return `${percentage}%`
  }

  const ratingSummary = [
    { id: 1, rating: 5, percentage: calculatePercentage(reviewList, 5) },
    { id: 2, rating: 4, percentage: calculatePercentage(reviewList, 4) },
    { id: 3, rating: 3, percentage: calculatePercentage(reviewList, 3) },
    { id: 4, rating: 2, percentage: calculatePercentage(reviewList, 2) },
    { id: 5, rating: 1, percentage: calculatePercentage(reviewList, 1) },
  ]

  // kiểm tra người dùng đã đánh giá hay chưa
  useEffect(() => {
    if (reviewList.some((review) => review.user.id === uid)) {
      setUserReviewed(true)
    } else {
      setUserReviewed(false)
    }
  }, [reviewList, uid])

  // sắp xếp cho đánh giá của người dùng đứng đầu
  sortedReviewList.sort((a, b) => {
    if (a.user.id === uid) {
      return -1 // Đánh giá của người dùng đang đăng nhập đứng đầu
    } else if (b.user.id === uid) {
      return 1
    }
    return 0
  })

  return (
    <div id='review-section'>
      {/* Hiển thị bảng thống kê review */}
      <div className='mb-4'>
        <p className='font-bold text-2xl mt-12 mb-2'>Đánh giá sản phẩm</p>
        <div className='flex mt-2 text-zinc-700'>
          {/* Hiển thị đánh giá trung bình */}
          <div className='flex flex-col justify-center items-center w-1/3 border border-gray-200 p-4 space-y-2 rounded-tl-2xl rounded-bl-2xl'>
            <div className='flex gap-2'>
              <p className='text-7xl font-bold'>{averageRating.toFixed(1)}</p>
              <p className='text-4xl font-bold self-end pb-2'>/5</p>
            </div>
            <div className='flex'>
              {[1, 2, 3, 4, 5].map((index) => (
                <AiFillStar
                  key={index}
                  className={`w-5 h-5 ${
                    index <= Math.floor(averageRating)
                      ? 'text-yellow'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p>{reviewList.length} đánh giá và nhận xét</p>
          </div>
          <div className='flex flex-col justify-center items-center w-2/3 border border-gray-200 p-4 space-y-2 rounded-tr-2xl rounded-br-2xl'>
            <Container className='col-span-2 h-full mt-6'>
              <Box
                mb={8}
                mx='auto h-full'>
                <Flex
                  direction='column'
                  justify='space-between'
                  h='full'>
                  {ratingSummary.map((data) => {
                    return (
                      <HStack
                        key={data.id}
                        spacing={5}
                        mr={0}
                        pr={0}>
                        <Text
                          fontWeight='bold'
                          fontSize='md'>
                          {data.rating}
                        </Text>
                        <Box
                          w={{
                            base: '100%',
                            md: '70%',
                          }}>
                          <Box
                            w='100%'
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            bg={useColorModeValue('gray.300', 'gray.600')}
                            rounded='md'>
                            <Box
                              w={data.percentage}
                              h={3}
                              bg='yellow.400'
                              rounded='md'></Box>
                          </Box>
                        </Box>
                        <Text
                          fontWeight='bold'
                          fontSize='md'>
                          {data.percentage}
                        </Text>
                      </HStack>
                    )
                  })}
                </Flex>
              </Box>
            </Container>
          </div>
        </div>
        {/* Button đánh giá ngay */}
        {!userReviewed && (
          <div className='w-full flex flex-col justify-center items-center mt-2'>
            {/* <p>Bạn đánh giá sao sản phẩm này</p> */}
            <button
              className='bg-blue-500 text-white px-2 w-32 h-10 rounded-full hover:bg-blue-600'
              onClick={ReviewFormButtonClick}>
              Đánh giá ngay
            </button>
          </div>
        )}
      </div>
      {showReviewForm && (
        <div className='fixed inset-0 flex items-center justify-center  bg-black bg-opacity-50 z-50'>
          <form className='flex flex-col w-1/3 p-4 bg-white rounded-lg '>
            <IoIosArrowBack
              className='flex justify-end items-end hover:bg-gray-200'
              onClick={ReviewFormButtonClick}
            />
            <div className='flex justify-center'>
              <Image
                src={loginImg}
                alt='Login img'
                className='w-56 h-auto'
              />
            </div>
            <h3 className='text-2xl text-center font-semibold mb-4'>
              Đánh giá sản phẩm
            </h3>
            <div className='mb-2'>
              <textarea
                id='comment'
                className='w-full h-24 border border-gray-300 rounded p-2 placeholder:p-2'
                placeholder='Xin mời chia sẻ một số cảm nhận về sản phẩm'
                value={comment}
                onChange={handleCommentChange}
              />
            </div>
            <div className='flex flex-col border border-gray-300 rounded p-4 mb-4'>
              <p className='font-semibold mb-2'>
                Bạn thấy sản phẩm này như thế nào?
              </p>
              <div className='flex justify-center items-center space-x-8'>
                {[1, 2, 3, 4, 5].map((index) => (
                  <div
                    className='flex flex-col justify-center items-center'
                    onClick={() => handleRatingSelect(index)}
                    key={index}>
                    <AiFillStar
                      className={`w-5 h-5 ${
                        index <= rating ? 'text-yellow' : 'text-gray-300'
                      }`}
                    />
                    <p>
                      {index === 1 && 'Rất tệ'}
                      {index === 2 && 'Tệ'}
                      {index === 3 && 'Bình thường'}
                      {index === 4 && 'Tốt'}
                      {index === 5 && 'Rất tốt'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <button
              className=' font-semibold w-full bg-blue-500 text-white px-4 py-2 rounded-md'
              type='submit'
              onClick={handleReviewSubmit}>
              Gửi đánh giá
            </button>
          </form>
        </div>
      )}

      {/* Hiển thị reviews */}
      <div className='overflow-auto h-[500px]'>
        {!!sortedReviewList?.length &&
          sortedReviewList.map((review) => (
            <div
              className='mb-4 mr-4 '
              key={review.id}>
              <div className='flex justify-between mb-2'>
                <div className='flex font-medium items-center space-x-2'>
                  <img
                    src={review.user.image}
                    className='w-8 h-8 rounded-full border-2 bg-gray-300'
                    alt={`${review.user.firstName} avatar`}
                  />
                  <span>{review.user.firstName}</span>
                </div>
                <p>{review.createdAt}</p>
              </div>
              <div className='flex flex-col border bg-gray-100 rounded-2xl p-4'>
                <div className='flex'>
                  <p className='font-medium mr-1'>Đánh giá:</p>
                  {renderRatingStars(review.rating)}
                </div>
                <div className='flex'>
                  <p className='font-medium mr-1'>Nhận xét:</p>
                  {review.comment}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default ReviewComponent
