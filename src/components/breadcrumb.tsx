/** @format */

import {
  Breadcrumb as ChakraBreadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react'
import React from 'react'
import {
  Action,
  matchResourceFromRoute,
  useBreadcrumb,
  useLink,
  useRefineContext,
  useResource,
  useRouterContext,
  useRouterType,
} from '@refinedev/core'
import { BreadcrumbProps } from '@refinedev/chakra-ui'
import { IconHome } from '@tabler/icons'

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  breadcrumbProps,
  showHome = true,
  hideIcons = false,
  meta,
}) => {
  const routerType = useRouterType()
  const { breadcrumbs } = useBreadcrumb({ meta })
  const Link = useLink()
  const { Link: LegacyLink } = useRouterContext()
  const { hasDashboard } = useRefineContext()

  const ActiveLink = routerType === 'legacy' ? LegacyLink : Link
  const { resources } = useResource()

  if (breadcrumbs.length === 1) {
    return null
  }

  const rootRouteResource = matchResourceFromRoute('/', resources)

  return (
    <ChakraBreadcrumb
      mb='3'
      {...breadcrumbProps}>
      {showHome && (hasDashboard || rootRouteResource?.found) && (
        <BreadcrumbItem>
          <ActiveLink to='/'>
            {rootRouteResource?.resource?.meta?.icon ?? <IconHome size={20} />}
          </ActiveLink>
        </BreadcrumbItem>
      )}
      {breadcrumbs.map(({ label: rawLabel, icon, href }) => {
        const label = translate(rawLabel)
        return (
          <BreadcrumbItem key={label}>
            {!hideIcons && icon}
            {href ? (
              <BreadcrumbLink
                ml={2}
                as={ActiveLink}
                to={href}
                href={href}>
                {label}
              </BreadcrumbLink>
            ) : (
              <BreadcrumbLink ml={2}>{label}</BreadcrumbLink>
            )}
          </BreadcrumbItem>
        )
      })}
    </ChakraBreadcrumb>
  )
}

const translate = (label: string) => {
  const action = label as Action
  switch (action) {
    case 'create':
      return 'Thêm mới'
    case 'edit':
      return 'Chỉnh sửa'
    case 'list':
      return 'Danh sách'
    case 'show':
      return 'Chi tiết'
    default:
      return label
  }
}
