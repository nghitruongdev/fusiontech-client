/** @format */

'use client'
import {
  Button,
  Menu,
  MenuItem,
  MenuList,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/react'
import { Laptop } from 'lucide-react'
import Image from 'next/image'
import { ICategory } from 'types'
import { useRouter } from 'next/router'

export function CategoryDropDown({ categories }: { categories: ICategory[] }) {
  // const router = useRouter()
  const categoryClick = (category: number) => {
    console.log(category)
    // router.push(`/search?category=${category}`);
    window.location.href = `/search?cid=${category}`
  };
  return (
    <>
      <Popover isLazy>
        {({ isOpen }) => (
          <>
            <PopoverTrigger>
              <Button variant={'unstyled'}>
                <div
                  className={`group navBarHover text-white font-semibold   ${
                    isOpen && 'navBarActive'
                  }`}>
                  <div className={`w-4 grid grid-cols-2 gap-[2px]`}>
                    {Array.from({ length: 4 }).map((_, idx) => (
                      <span
                        key={idx}
                        className={`  w-1.5 h-1.5 border-[1px] border-white inline-flex ${
                          isOpen && 'bg-white'
                        }`}></span>
                    ))}
                  </div>
                  Danh mục
                </div>
              </Button>
            </PopoverTrigger>

            <PopoverContent
              color='black'
              mt='3'
              w='200px'
              pos='relative'>
              <PopoverBody>
                <Menu isOpen>
                  <MenuList
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '10px',
                      overflow: 'auto',
                    }}>
                    {categories.map((item) => (
                      <>
                        <MenuItem key={`${Math.random()}`} onClick={() => categoryClick(item.id??0)} >
                          <Image
                            src={item.image ?? ''}
                            width={100}
                            height={100}
                            alt={'/'}
                            className='max-h-[30px] max-w-[30px]  aspect-square mr-2 rounded-3xl object-cover '
                          />
                          {item.name}
                          <hr
                            className='border-spacing-5'
                            style={{ marginTop: '10px' }}
                          />
                        </MenuItem>
                      </>
                    ))}
                  </MenuList>
                </Menu>
              </PopoverBody>
            </PopoverContent>
          </>
        )}
      </Popover>
    </>
  )
}

export function CategoryDropDownButton({ isOpen }: { isOpen?: boolean }) {
  return (
    <div
      className={`group navBarHover text-white font-semibold   ${
        isOpen && 'navBarActive'
      }`}>
      <div className={`w-4 grid grid-cols-2 gap-[2px]`}>
        {Array.from({ length: 4 }).map((_, idx) => (
          <span
            key={idx}
            className={`  w-1.5 h-1.5 border-[1px] border-white inline-flex ${
              isOpen && 'bg-white'
            }`}></span>
        ))}
      </div>
      Danh mục
    </div>
  )
}
