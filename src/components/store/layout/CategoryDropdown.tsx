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
import NextLinkContainer from '@components/ui/NextLinkContainer'
import Image from 'next/image'
import { ICategory } from 'types'

export function CategoryDropDown({ categories }: { categories: ICategory[] }) {
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
                  <MenuList className='grid gap-[10px] overflow-auto'>
                    {categories.map((item) => (
                      <MenuItem key={`${item.id}`}>
                        <NextLinkContainer
                          href={`/search/danh-muc/${item.id}-${item.slug}`}
                          className={`flex gap-2 w-full`}>
                          <Image
                            src={item.image ?? ''}
                            width={100}
                            height={100}
                            alt={'/'}
                            className='max-h-[30px] max-w-[30px]  aspect-square mr-2 rounded-3xl object-cover '
                          />
                          {item.name}
                        </NextLinkContainer>
                      </MenuItem>
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
