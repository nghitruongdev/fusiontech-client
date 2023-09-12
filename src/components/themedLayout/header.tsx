import {
    Box,
    Avatar,
    Text,
    HStack,
    useColorModeValue,
    BoxProps,
    IconButton,
    useColorMode,
    Icon,
} from '@chakra-ui/react'
import React from 'react'
import {
    useGetIdentity,
    useActiveAuthProvider,
    pickNotDeprecated,
} from '@refinedev/core'
import { HamburgerMenu } from './hamburgerMenu'
import type { RefineThemedLayoutV2HeaderProps } from '@refinedev/chakra-ui'
import { useAuthUser } from '@/hooks/useAuth/useAuthUser'
import { Moon, Sun } from 'lucide-react'

export const ThemedHeaderV2: React.FC<RefineThemedLayoutV2HeaderProps> = ({
    isSticky,
    sticky,
}) => {
    const authProvider = useActiveAuthProvider()
    //   const { data: user } = useGetIdentity({
    //     v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
    //   })

    const bgColor = useColorModeValue(
        'refine.header.bg.light',
        'refine.header.bg.dark',
    )

    const { colorMode, toggleColorMode } = useColorMode()

    let stickyProps: BoxProps = {}
    if (pickNotDeprecated(sticky, isSticky)) {
        stickyProps = {
            position: 'sticky',
            top: 0,
            zIndex: 1,
        }
    }

    return (
        <Box
            py="2"
            px="4"
            display="flex"
            alignItems="center"
            w="full"
            height="64px"
            bg={bgColor}
            borderBottom="1px"
            borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
            {...stickyProps}
        >
            <Box
                w="full"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
                <HamburgerMenu />

                <HStack>
                    <IconButton
                        variant="ghost"
                        aria-label="Toggle theme"
                        onClick={toggleColorMode}
                    >
                        <Icon as={colorMode === 'light' ? Moon : Sun} w="24px" h="24px" />
                    </IconButton>
                    <UserInfo />
                </HStack>
            </Box>
        </Box>
    )
}

const UserInfo = () => {
    const { user } = useAuthUser()
    if (user)
        return (
            <>
                {user.displayName && (
                    <Text size="sm" fontWeight="bold">
                        {user.displayName}
                    </Text>
                )}
                {user.photoURL && (
                    <Avatar
                        size="sm"
                        name={user.displayName || 'Profile Photo'}
                        src={user.photoURL}
                    />
                )}
            </>
        )
    return <></>
}
