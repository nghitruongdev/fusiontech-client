/** @format */

import React from 'react'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'

const AsusVivobookGo15 = () => {
  return (
    <div className='mx-20 my-5 grid grid-cols-3 gap-4 font-roboto'>
      <div className='col-span-2 px-10 py-5  bg-white rounded-lg shadow'>
        <div className=' flex flex-row items-center space-x-1 text-slate-500 text-sm   '>
          <p className='hover:underline cursor-pointer'>Trang chủ</p>
          <ChevronRight
            size={16}
            strokeWidth={1}
          />
          <p className='hover:underline cursor-pointer'>Tin tức</p>
          <ChevronRight
            size={16}
            strokeWidth={1}
          />
          <p className='hover:underline cursor-pointer'>
            Top 5 lý do học sinh sinh viên nên mua laptop gaming Nitro 16
            Phoenix, RTX 4050
          </p>
        </div>
        <hr className='mt-3' />
        {/* <div className=' shadow-md py-4 text-center'> */}
        <h1 className='text-3xl font-bold my-5'>
          Top 5 lý do học sinh sinh viên nên mua laptop gaming Nitro 16 Phoenix,
          RTX 4050
        </h1>
        {/* </div> */}
        <div className='mb-6'>
          <p className='mb-2 flex items-center font-bold text-red-500'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              className='mr-2 h-5 w-5'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z'
              />
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z'
              />
            </svg>
            Hot news
          </p>

          <p className='mb-6 text-gray-800'>
            <p>
              Những năm gần đây, việc chọn mua{' '}
              <a
                className='text-blue-500 underline'
                href='https://phongvu.vn/c/laptop-gaming'
                target='_blank'
                rel='noreferrer noopener'>
                laptop gaming
              </a>{' '}
              đã trở thành xu hướng hấp dẫn đối với học sinh sinh viên, nhờ hiệu
              năng vượt trội, tính linh hoạt và độ bền cao.
            </p>
            <p className=' mt-5'>
              Với mức giá dưới 30 triệu, cấu hình mạnh, thiết kế chuẩn gaming và
              hệ thống tản nhiệt hàng đầu trong phân khúc,{' '}
              <a
                className='text-blue-500 underline'
                href='https://phongvu.vn/acer-nitro-16-phoenix-an16-41-ryzen-5-rtx-4050--s230402670?utm_source=social&amp;utm_medium=technews&amp;utm_campaign=acer-nitro-phoenix'
                target='_blank'
                rel='noreferrer noopener'>
                Nitro 16 Phoenix
              </a>{' '}
              mang đến sự hỗ trợ tuyệt vời cho cả giải trí, học tập và công
              việc. Hãy cùng khám phá 5 lý do tại sao ngay cả game thủ và học
              sinh sinh viên nên sở hữu ngay một chiếc laptop gaming “quốc dân”
              này.
            </p>
          </p>
          <hr className='my-5 border-black border-t-2   ' />

          <ul className='text-blue-500 underline list-disc list-inside dark:text-gray-400'>
            <li className='my-1'>
              <a
                href='https://phongvu.vn/cong-nghe/danh-gia-laptop-acer-nitro-16-phoenix/'
                target='_blank'
                rel='noreferrer noopener'>
                Review laptop gaming Acer Nitro 16 Phoenix card RTX 4050: thiết
                kế mới, cấu hình “khủng long”, giá dưới 30 triệu
              </a>
            </li>

            <li className='my-1'>
              <a
                href='https://phongvu.vn/cong-nghe/hieu-nang-card-rtx-4050-tren-acer-nitro-16/'
                target='_blank'
                rel='noreferrer noopener'>
                RTX 4050 trên Acer Nitro 16 Phoenix mạnh như thế nào?
              </a>
            </li>

            <li className='my-1'>
              <a
                href='https://phongvu.vn/cong-nghe/laptop-acer-nitro-co-tot-khong/'
                target='_blank'
                rel='noreferrer noopener'>
                Top 5 laptop Acer Nitro đáng mua nhất 2023
              </a>
            </li>
          </ul>
          <hr className='my-5 border-black border-t-2   ' />

          <Image
            src='https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fbanner%2FCauhinhcuckhung-800x447.jpg?alt=media&token=0e93b789-4dd7-48ba-a27c-0fb069c8f11d'
            width={800}
            height={500}
            layout='responsive'
            objectFit='cover'
            className='mb-6 rounded-lg shadow-lg'
            alt=''
          />
          <p className='mb-6 text-2xl font-bold'>
            Laptop gaming với mức giá dưới 30 triệu trang bị hiệu năng vượt
            trội, thiết kế “cool ngầu”
          </p>

          <p className='mb-6 text-gray-800'>
            Hầu hết laptop gaming hiện tại đều trang bị cấu hình cao đảm bảo khả
            năng chơi game mượt mà, làm việc hiệu quả (đặc biệt là đồ họa) và
            cũng có thể sử dụng các tác vụ Word, Powerpoint, Excel đối với học
            sinh, sinh viên trở nên đơn giản hơn.
          </p>

          <div className='mb-6 bg-gray-100 border-l-4 border-red-500 p-2'>
            <strong>Note:</strong> Lorem ipsum dolor sit amet, consectetur
            adipisicing elit. Optio odit consequatur porro sequi ab distinctio
            modi. Rerum cum dolores sint, adipisci ad veritatis laborum eaque
            illum saepe mollitia ut voluptatum.
          </div>

          <p className='mb-6 text-gray-800'>
            Trong đó, Nitro 16 Phoenix – Laptop RTX 4050 là sự lựa chọn hoàn hảo
            trong phân khúc laptop gaming dưới 30 triệu. Với sức mạnh của card
            đồ họa GeForce RTX™ 4050 6GB và sự vượt trội của CPU AMD Ryzen™ 5
            7535HS, là một điểm tựa không thể thiếu cho những chiến binh đích
            thực.
          </p>

          <Image
            src='https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fbanner%2Fcsgo.jpg?alt=media&token=5e04b2fe-4327-48fc-a97e-7b0fbcc65ade'
            width={800}
            height={500}
            layout='responsive'
            objectFit='cover'
            className='mb-6 rounded-lg shadow-lg'
            alt=''
          />
          <p className='mb-6 text-gray-800'>
            Sở hữu hiệu năng vượt trội Nitro 16 Phoenix chiến mượt các tựa game
            Esport hấp dẫn như PUBG, Valorant, LoL,… với mức setting cao nhất.
            Ngoài ra, Nitro 16 Phoenix còn đem đến trải nghiệm chơi game mạnh mẽ
            trên các tựa game AAA nổi tiếng hiện nay như God of War, Elden Ring,
            Diablo IV,…
          </p>
          <Image
            src='https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fbanner%2Fd%C3%A9igin.jpg?alt=media&token=2654efa8-c201-42d5-a153-1b7c462ae76d'
            width={800}
            height={500}
            layout='responsive'
            objectFit='cover'
            className='mb-6 rounded-lg shadow-lg'
            alt=''
          />
          <p className='mb-6 text-gray-800'>
            Nitro 16 Phoenix với hiệu năng cao và khả năng xử lý đồ họa mạnh mẽ,
            biến trải nghiệm làm việc với các phần mềm phức tạp như Adobe
            Photoshop, Illustrator, trở thành một điều mượt mà và thú vị. Điều
            này giúp việc thực hiện các tác vụ thiết kế đồ hoạ, đồ họa kỹ thuật
            và xuất bản của sinh viên ngành thiết kế, kỹ thuật trở nên dễ dàng
            và hiệu quả hơn bao giờ hết.
          </p>
          <Image
            src='https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fbanner%2Facer-nitro-16-phoenix-5.jpg?alt=media&token=b8418d3a-fcf6-488d-9bc3-43dae815cea9'
            width={800}
            height={500}
            layout='responsive'
            objectFit='cover'
            className='mb-6 rounded-lg shadow-lg'
            alt=''
          />
          <p className='mb-6 text-gray-800'>
            Bạn hoàn toàn tự tin mang máy tính xách tay chơi game của mình đến
            trường học hoặc văn phòng làm việc. Với Nitro 16 Phoenix, thiết kế
            vẫn giữ phong cách góc cạnh và hình khối vuông vức, tạo cảm giác
            mạnh mẽ. Phía sau, Nitro 16 Phoenix được trang trí với logo mới, các
            đường line RGB sang trọng và thu hút mắt.
          </p>

          <p className='mb-6 text-2xl font-bold'>
            Sở hữu màn hình với tần số quét 165Hz và 100% sRGB duy nhất trong
            phân khúc laptop gaming dưới 30 triệu
          </p>
          <Image
            src='https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fbanner%2Frgb.jpg?alt=media&token=b88b9ce3-890c-4eec-9eef-e1b7f39b6ec5'
            width={800}
            height={500}
            layout='responsive'
            objectFit='cover'
            className='mb-6 rounded-lg shadow-lg'
            alt=''
          />
          <p className='mb-6 text-gray-800'>
            Nitro 16 Phoenix sở hữu công nghệ màn hình tỷ lệ chuẩn 16:10, độ
            phân giải WUXGA (1920×1200), tần số quét lên đến 165Hz và 100% sRGB.
            Đặc biệt, tính năng NVIDIA Advanced Optimus đi kèm mang đến trải
            nghiệm nhìn tuyệt vời, cuốn hút, không gián đoạn và sắc nét sẽ là
            ứng viên không thể bỏ qua đối với tiêu chí này.
          </p>

          <p className='mb-6 text-2xl font-bold'>
            Nổi bật với bàn phím Led RGB đổi màu và cổng kết nối đa dạng phục
            phụ mọi nhu cầu
          </p>

          <p className='mb-6 text-gray-800'>
            Nitro 16 Phoenix cung cấp đầy đủ các cổng kết nối quan trọng như
            HDMI, cổng mạng LAN, USB-C, MicroSD, Jack 3.5mm, USB-A và 2 cổng
            USB-A 3.2. Với chuẩn kết nối có dây Intel® Killer E2600 Ethernet
            Controller và chuẩn Wifi Intel® Killer™ 6 AX1650i, tín hiệu truyền
            đạt mượt mà và độ trễ được giảm thiểu, mang đến trải nghiệm ổn định
            cho người dùng.
          </p>
          <Image
            src='https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fbanner%2FfullLap.jpg?alt=media&token=5745f28f-ef56-4416-83ba-60cc24a4cd38'
            width={800}
            height={500}
            layout='responsive'
            objectFit='cover'
            className='mb-6 rounded-lg shadow-lg'
            alt=''
          />
          <p className='mb-6 text-gray-800'>
            Acer cũng không quên trang bị bàn phím Fullsize trên Nitro 16
            Phoenix, với khoảng cách phím hợp lý và độ nảy tốt. Bàn phím LED RGB
            4 vùng nổi bật, cho phép bạn tùy chỉnh màu sắc theo sở thích. Bàn
            phím Nitro 16 Phoenix có độ nảy tốt và đèn nền, không chỉ giúp mang
            lại cảm giác thoải mái cho game thủ mà còn tạo điều kiện cho học
            sinh sinh viên, học tập và làm việc hiệu quả trong môi trường ánh
            sáng yếu, thao tác nhanh chóng trên bàn phím.
          </p>
          <p className='mb-6 text-2xl font-bold'>
            Thời lượng Pin tốt, tản nhiệt mát nhất phân khúc giúp máy hoạt động
            ổn định, độ bền cao
          </p>
          <Image
            src='https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fbanner%2FCauhinhcuckhung-800x447.jpg?alt=media&token=0e93b789-4dd7-48ba-a27c-0fb069c8f11d'
            width={800}
            height={500}
            layout='responsive'
            objectFit='cover'
            className='mb-6 rounded-lg shadow-lg'
            alt=''
          />
          <p className='mb-6 text-gray-800'>
            Nitro 16 Phoenix chiếc laptop gaming nhưng sở hữu thời lượng pin
            vượt trội 90Wh cho thời gian sử dụng lên đến 4.5h – 5h. Ngoài ra,
            Acer trang bị cho Nitro 16 Phoenix hệ thống tản nhiệt “đồ sộ” bậc
            nhất hiện nay. Với 2 quạt tản nhiệt, 2 cổng hút gió trên/dưới, 4
            cổng thoát nhiệt và gel kim loại lỏng trên CPU giúp máy luôn giữ mức
            nhiệt độ ổn định, mát khi chơi game liên tục trong nhiều tiếng đồng
            hồ.
          </p>

          <div className='grid grid-rows-2 grid-cols-2 gap-4'>
            <div className='row-span-1 col-span-1 '>
              <div className='flex flex-col items-center justify-center'>
                <Image
                  src='https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fbanner%2Fnews1.webp?alt=media&token=39ff0184-f025-4fbe-9445-538424ab835f'
                  width={10}
                  height={10}
                  layout='responsive'
                  objectFit='cover'
                  className='mb-6 rounded-lg shadow-lg'
                  alt=''
                />
                <a
                  href='#'
                  className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
                  Mua Ngay
                </a>
              </div>
            </div>
            <div className='row-span-1 ml-5 col-span-1 flex-col justify-center items-center'>
              <p className='mb-6 text-xl font-bold'>
                Laptop ACER Nitro 16 Phoenix
              </p>
              <p className='mb-6 text-xl font-bold text-red-600'>25.000.000đ</p>
              <ul className='mb-6 text-sm text-slate-500 list-inside list-disc'>
                <li>CPU: AMD Ryzen 5 7535HS</li>

                <li>Màn hình: 16″ IPS (1920 x 1200),165Hz</li>

                <li>RAM: 1 x 8GB DDR5 4800MHz</li>

                <li>Đồ họa: RTX 4050 6GB GDDR6 / AMD Radeon 660M</li>

                <li>Lưu trữ: 512GB SSD M.2 NVMe /</li>

                <li>Hệ điều hành: Windows 11 Home SL</li>

                <li>Pin: 4 cell 90 Wh Pin liền</li>

                <li>Khối lượng: 2.6kg</li>
              </ul>
            </div>

            <div className='row-span-1 col-span-1 '>
              <div className='flex flex-col items-center justify-center'>
                <Image
                  src='https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fbanner%2Fnews1.webp?alt=media&token=39ff0184-f025-4fbe-9445-538424ab835f'
                  height={10}
                  width={10}
                  layout='responsive'
                  objectFit='cover'
                  className='mb-6 rounded-lg shadow-lg'
                  alt=''
                />
                <a
                  href='#'
                  className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
                  Mua Ngay
                </a>
              </div>
            </div>
            <div className='row-span-1 ml-5 col-span-1 flex-col justify-center items-center'>
              <p className='mb-6 text-xl font-bold'>
                Laptop ACER Nitro 16 Phoenix
              </p>
              <p className='mb-6 text-xl font-bold text-red-600'>25.000.000đ</p>
              <ul className='mb-6 text-sm text-slate-500 list-inside list-disc'>
                <li>CPU: AMD Ryzen 5 7535HS</li>

                <li>Màn hình: 16″ IPS (1920 x 1200),165Hz</li>

                <li>RAM: 1 x 8GB DDR5 4800MHz</li>

                <li>Đồ họa: RTX 4050 6GB GDDR6 / AMD Radeon 660M</li>

                <li>Lưu trữ: 512GB SSD M.2 NVMe /</li>

                <li>Hệ điều hành: Windows 11 Home SL</li>

                <li>Pin: 4 cell 90 Wh Pin liền</li>

                <li>Khối lượng: 2.6kg</li>
              </ul>
            </div>
          </div>
          <p className='mt-6 text-2xl font-bold'>
            Chính sách bảo hành VIP 3S1 độc quyền Khi sở hữu chiếc laptop gaming
            quốc dân
          </p>
          <p className='mt-6 text-gray-800'>
            Nitro 16 Phoenix người dùng sẽ được áp dụng chính sách bảo hành VIP
            3S1: bảo hành nhanh chính hãng trong vòng 3 ngày, kể cả Thứ bảy và
            chủ nhật, quá 3 ngày không bảo hành xong Acer sẽ đổi cho người dùng
            một máy mới có giá trị tương đương hoặc cao hơn. Nitro 16 Phoenix
            AN16-41-R5M4 được bán độc quyền tại hệ thống cửa hàng Phong Vũ trên
            toàn quốc với giá bán lẻ 29.990.000 VNĐ, kèm bộ quà tặng Nitro Gears
            trị giá 7 triệu đồng bao gồm bàn phím cơ gaming Predator Aethon TKL
            301, chuột gaming Logitech G903 Hero, balo Predator SUV và mã giảm
            giá 500.000vnđ mua Ram Laptop Kingston 8GB DDR5 4800MHz.
          </p>
        </div>
      </div>

      <div className='col-span-1 '>
        <div className='max-w-3xl mx-auto  '>
          <div className='bg-white border border-gray-300 rounded-lg shadow-lg'>
            <div className='px-5 pt-3 mb-5 '>
              <h2 className='text-2xl font-bold mb-2 text-slate-500'>
                Recent Posts
              </h2>

              <div className='border-t border-gray-300'>
                <div className='py-4'>
                  <p className='text-sm text-gray-600'>August 1, 2023</p>
                  <h3 className='text-xl font-bold mt-2'>
                    <a
                      href='#'
                      className='text-blue-500 hover:text-blue-700 focus:ring-2 focus:ring-blue-300 focus:outline-none'>
                      Top 10 Laptops for Gamers in 2023
                    </a>
                  </h3>
                  <p className='text-gray-800 mt-2'>
                    Looking for the best gaming laptops in 2023? Check out our
                    top 10 picks for the ultimate gaming experience.
                  </p>
                </div>

                <div className='border-t border-gray-300 py-4'>
                  <p className='text-sm text-gray-600'>July 28, 2023</p>
                  <h3 className='text-xl font-bold mt-2'>
                    <a
                      href='#'
                      className='text-blue-500 hover:text-blue-700 focus:ring-2 focus:ring-blue-300 focus:outline-none'>
                      How to Choose the Right Gaming Laptop
                    </a>
                  </h3>
                  <p className='text-gray-800 mt-2'>
                    Not sure which gaming laptop is right for you? Read our
                    guide on how to choose the perfect gaming laptop for your
                    needs.
                  </p>
                </div>

                <div className='border-t border-gray-300 py-4'>
                  <p className='text-sm text-gray-600'>July 15, 2023</p>
                  <h3 className='text-xl font-bold mt-2'>
                    <a
                      href='#'
                      className='text-blue-500 hover:text-blue-700 focus:ring-2 focus:ring-blue-300 focus:outline-none'>
                      The Best Accessories for Your Gaming Setup
                    </a>
                  </h3>
                  <p className='text-gray-800 mt-2'>
                    Upgrade your gaming setup with these must-have accessories
                    for gamers. Enhance your gaming experience to the next
                    level!
                  </p>
                </div>

                <div className='border-t border-gray-300 py-4'>
                  <p className='text-sm text-gray-600'>July 5, 2023</p>
                  <h3 className='text-xl font-bold mt-2'>
                    <a
                      href='#'
                      className='text-blue-500 hover:text-blue-700 focus:ring-2 focus:ring-blue-300 focus:outline-none'>
                      How to Optimize Your Gaming Laptops Performance
                    </a>
                  </h3>
                  <p className='text-gray-800 mt-2'>
                    Learn the best tips and tricks to optimize your gaming
                    laptops performance for smoother gameplay and faster
                    processing.
                  </p>
                </div>
              </div>
              <div className='border-t border-gray-300 mt-4'>
                <div className='flex space-x-4 mt-4'>
                  <button className='text-blue-500 hover:text-blue-700 focus:outline-none border-b-2 border-blue-500 pb-2'>
                    Tags
                  </button>
                  <button className='text-blue-500 hover:text-blue-700 focus:outline-none'>
                    Popular
                  </button>
                  <button className='text-blue-500 hover:text-blue-700 focus:outline-none'>
                    Latest
                  </button>
                </div>

                {/* Tab Content */}
                <div className='mt-4'>
                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 mb-5'>
                    <div className='border border-gray-300 rounded-lg p-4 transition-all duration-300 hover:shadow-lg'>
                      <h3 className='text-xl font-bold mb-2'>
                        <a
                          href='#'
                          className='text-blue-500 hover:text-blue-700 focus:ring-2 focus:ring-blue-300 focus:outline-none'>
                          Best Laptops for Content Creators
                        </a>
                      </h3>
                      <p className='text-gray-800'>
                        Whether youre a video editor, graphic designer, or
                        content creator, these laptops will help you unleash
                        your creativity.
                      </p>
                      <div className='mt-2'>
                        <Image
                          src='https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fbanner%2Fnews1.webp?alt=media&token=39ff0184-f025-4fbe-9445-538424ab835f'
                          height={100}
                          width={100}
                          alt='Content Creator'
                          className='w-full h-24 object-cover rounded-lg'
                        />
                      </div>
                    </div>
                    <div className='border border-gray-300 rounded-lg p-4 transition-all duration-300 hover:shadow-lg'>
                      <h3 className='text-xl font-bold mb-2'>
                        <a
                          href='#'
                          className='text-blue-500 hover:text-blue-700 focus:ring-2 focus:ring-blue-300 focus:outline-none'>
                          Tips for Choosing the Right Gaming Laptop
                        </a>
                      </h3>
                      <p className='text-gray-800'>
                        Dont know which gaming laptop to buy? Read our tips to
                        find the perfect one for your gaming needs.
                      </p>
                      <div className='mt-2'>
                        <Image
                          src='https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fbanner%2Fmsi-800x447.jpg?alt=media&token=fc27c95a-02b2-4ebe-afc0-70fbbc1497d9'
                          width={100}
                          height={100}
                          alt='Content Creator'
                          className='w-full h-24 object-cover rounded-lg'
                        />
                      </div>
                    </div>
                    {/* Add more tab content items */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AsusVivobookGo15
