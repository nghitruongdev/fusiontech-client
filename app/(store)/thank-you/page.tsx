/** @format */

'use client'
import React from 'react'
import { Link } from '@chakra-ui/react'
import Image from 'next/image'
import { thankLogo } from '@public/assets/images'
const ThankYouPage = () => {
  return (
    <div className='bg-gray-100 flex items-center justify-center p-4 '>
      <div className='bg-white p-4 rounded-lg shadow-lg w-2/3  px-8'>
        <div className='flex justify-center items-center'>
          <Image
            src={thankLogo}
            alt='Login icon'
            width='250'
          />
        </div>
        <h2 className='text-2xl font-semibold my-4 text-center'>
          Xin gửi lời cảm ơn chân thành!
        </h2>
        <div className='text-left'>
          <p className='text-gray-700 mb-4'>
            Kính gửi các nhãn hàng, giám khảo, và hội đồng coi thi.
          </p>
          <p className='text-gray-700 mb-2'>
            Chúng em là nhóm sinh viên năm cuối tại trường cao đẳng FPT
            Polytechnic, xin gửi lời cảm ơn sâu sắc và lòng biết ơn đến quý vị.
          </p>
          <p className='text-gray-700 mb-2'>
            Dự án tốt nghiệp của chúng em là một trang web bán hàng thương mại
            điện tử không thể thành công mà không có sự hỗ trợ và đóng góp từ
            những trang website của nhãn hàng thực tế như:
            <p className='text-blue-600'>Phong Vũ: https://phongvu.vn/</p>
            <p className='text-blue-600'>
              Cellphones: https://cellphones.com.vn/
            </p>
            và nhiều trang web bán hàng khác. Những bố cục trang, giao diện,
            hình ảnh và kiến thức mà chúng em đã tham khảo đã là nguồn cảm hứng
            vô cùng quý giá trong quá trình xây dựng trang web này. Nhờ những sự
            chia sẻ, chúng em đã học hỏi và phát triển năng lực chuyên môn, từ
            đó nâng cao chất lượng của sản phẩm của mình.
          </p>
          <p className='text-gray-700 mb-2'>
            Đồng thời, chúng em xin chân thành cảm ơn thầy cô phụ trách, giám
            khảo và hội đồng coi thi, đã dành thời gian và tâm huyết để đánh giá
            và hỗ trợ dự án của chúng em. Những góp ý, phản hồi và định hướng từ
            phía giám khảo sẽ giúp chúng em hoàn thiện và phát triển dự án tốt
            hơn trong tương lai.
          </p>
        </div>

        <div className='flex justify-center'>
          <Link href='/'>
            <button className='bg-blue-500 text-white px-4 py-2 mt-2 rounded-md hover:bg-blue-600'>
              Trở về Trang Chủ
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ThankYouPage
