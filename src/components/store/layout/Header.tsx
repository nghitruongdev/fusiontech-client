/** @format */
import Image from 'next/image'
import { AiOutlineHeart } from 'react-icons/ai'
import Link from 'next/link'
import { phoneImg } from 'public/assets/images'
import { FiChevronDown } from 'react-icons/fi'
import { FaPlaceOfWorship } from 'react-icons/fa'
import { MdOutlineLocationOn } from 'react-icons/md'
import { Suspense } from 'react'
import { CategoryDropDown, CategoryDropDownButton } from './CategoryDropdown'
import { getCategoriesList } from '@/providers/server-data-provider/data/categories'
import {
  CartButton,
  SearchInput,
  UserInfo,
  VerifyMailBanner,
} from './header-client'
import { Phone } from 'lucide-react'

const Header = async () => {
  return (
    <>
      <div className='w-full bg-blue-600 text-white sticky top-0 z-40'>
        <div className='w-full h-full border-b-[1px] border-b-white'>
          <VerifyMailBanner />
          {/* @ts-expect-error Server Component */}
          <Header.Navbar />
        </div>
        <Header.Bottom />
      </div>
    </>
  )
}

Header.Navbar = async () => {
  const categories = await getCategoriesList()
  return (
    <div className='mx-auto max-w-container px-4 h-20 flex items-center justify-between gap-2 '>
      <Header.Logo />
      <Suspense fallback={<CategoryDropDownButton />}>
        <CategoryDropDown categories={Object.values(categories.data)} />
      </Suspense>
      <SearchInput />
      <Header.FavoriteButton />
      <UserInfo />
      <CartButton />
      {/* <AdminButton /> */}
    </div>
  )
}

Header.Logo = function HeaderLogo() {
  return (
    <Link href='/'>
      <div className='navBarHover flex items-center justify-center border-2'>
        <h1 className='font-extrabold text-3xl'>FusionTech</h1>
      </div>
    </Link>
  )
}

Header.FavoriteButton = function HeaderFavoriteButton() {
  return (
    <div className='navBarHover'>
      <AiOutlineHeart className='text-lg' />
      <div className=''>
        {/* <p className='text-xs'>Sắp</p> */}
        <div className=''>
          <p className='text-xs'>Sản phẩm</p>
          <h2 className='text-base font-semibold -mt-1'>yêu thích +</h2>
        </div>
      </div>
    </div>
  )
}
Header.Bottom = function HeaderBottom() {
  const items = [
    { text: 'Siêu deal giảm giá', href: '#discount' },
    { text: 'Top bán chạy', href: '#top-sell' },
    { text: 'Mới ra mắt', href: '#newest' },
    { text: 'Sản phẩm hot', href: '#top-hot' },
    { text: 'Khác', href: '#others' },
  ]
  return (
    <div className='max-w-container mx-auto py-2 px-6 flex items-center justify-between'>
      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-2'>
          <Image
            className='w-6'
            src={phoneImg}
            alt='phoneImg'
          />
          <p className='text-sm font-semibold'>Hướng dẫn đặt hàng?</p>
          <FiChevronDown />
          <span className='w-[1px] h-4 bg-white inline-flex ml-2'></span>
        </div>
        <div className='flex items-center gap-2'>
          <Phone size={16} />
          <p className='text-sm text-zinc-100'>098366622</p>

          <MdOutlineLocationOn />
          <p className='text-sm text-zinc-100'>Tòa nhà QTSC9 (toà T)</p>
          <FaPlaceOfWorship />
          <p className='text-sm text-zinc-100'>
            Tân Chánh Hiệp, quận 12, TP HCM
          </p>
        </div>
      </div>
      <ul className='flex text-sm font-semibold text-zinc-100'>
        {items.map(({ text, href }, idx) => (
          <li
            key={text}
            className='bottomNavLi'>
            <a href={href}>{text}</a>
            {idx !== items.length - 1 && <span className='mx-1'> | </span>}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Header
