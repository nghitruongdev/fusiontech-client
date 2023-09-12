/** @format */

'use client'
import { LinkBox, LinkBoxProps, LinkOverlay } from '@chakra-ui/react'
import Link from 'next/link'
import { ReactNode } from 'react'

const NextLinkContainer = ({
  href,
  children,
  ...props
}: {
  href: string
  children: ReactNode
} & LinkBoxProps) => {
  return (
    <LinkBox
      as='div'
      {...props}>
      <LinkOverlay
        as={Link}
        href={href}
      />
      {children}
    </LinkBox>
  )
}
export default NextLinkContainer
