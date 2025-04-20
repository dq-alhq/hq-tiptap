import { IconBrandCleon } from 'hq-icons'

import { ThemeToggle } from '@/components/theme-toggle'
import { Navbar, Separator } from '@/components/ui'
import type React from 'react'

export default function AppNavbar(props: React.ComponentProps<typeof Navbar>) {
    return (
        <Navbar {...props}>
            <Navbar.Nav>
                <Navbar.Logo aria-label='Goto documenation of Navbar' href='/docs/components/layouts/navbar'>
                    <IconBrandCleon className='size-6 sm:size-5' />
                </Navbar.Logo>

                <Navbar.Section className='ml-auto hidden md:flex'>
                    <Navbar.Flex>
                        <ThemeToggle />
                    </Navbar.Flex>
                </Navbar.Section>
            </Navbar.Nav>

            <Navbar.Compact>
                <Navbar.Flex>
                    <Navbar.Trigger className='-ml-2' />
                    <Separator orientation='vertical' className='h-6 sm:mx-1' />
                    <Navbar.Logo aria-label='Goto documenation of Navbar' href='/docs/components/layouts/navbar'>
                        <IconBrandCleon className='size-5' />
                    </Navbar.Logo>
                </Navbar.Flex>
                <Navbar.Flex>
                    <Navbar.Flex>
                        <ThemeToggle />
                    </Navbar.Flex>
                </Navbar.Flex>
            </Navbar.Compact>
            <Navbar.Inset>{props.children}</Navbar.Inset>
        </Navbar>
    )
}
