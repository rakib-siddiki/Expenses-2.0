'use client';

import { useClickOutside } from '@/hooks';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { FC, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import LogoutButton from '@/components/ui/theHeader/Logout';
import { Icons } from '@/components/core';
import ProfileSettings from './ProfileSettings';

const menu = [
    {
        label: 'Add Seller',
        path: '/dashboard/add-seller',
    },
    {
        label: 'Add Items',
        path: '/dashboard/add-items',
    },
    {
        label: 'Add Origin',
        path: '/dashboard/add-origin',
    },
    {
        label: 'Add Stock',
        path: '/dashboard/add-stock',
    },
    {
        label: 'Add Accounts',
        path: '/dashboard/add-accounts',
    },
    {
        label: 'Print out',
        path: '/dashboard/print',
    },
];

const Sidebar: FC = () => {
    const [expanded, setExpanded] = useState(false);
    const elRef = useRef(null);
    useClickOutside(elRef, () => setExpanded(false));
    const pathName = usePathname();
    return (
        <div
            ref={elRef}
            onClick={!expanded ? () => setExpanded(true) : undefined}
            className={cn(
                'bg-muted min-h-[calc(100vh-56px)] h-full transition-all duration-300 relative',
                {
                    'md:translate-x-0 translate-x-[-13rem] cursor-pointer ': !expanded,
                    'translate-x-0 md:translate-x-0': expanded,
                },
            )}
        >
            <Icons.ArrowLeftCircleIcon
                onClick={() => setExpanded((prev) => !prev)}
                className={cn('absolute top-4 right-4 cursor-pointer md:hidden', {
                    'rotate-180 transition-transform duration-200': expanded,
                })}
            />
            <div
                className={cn('space-y-4 h-full pt-4 px-14', {
                    'hidden md:block': !expanded,
                })}
            >
                {menu.map(({ label, path }) => (
                    <Link key={label} href={path} className='block w-11/12 mx-auto'>
                        <Button
                            variant='link'
                            size={'lg'}
                            className={cn('w-full inline-block', {
                                underline: pathName === path,
                            })}
                        >
                            {label}
                        </Button>
                    </Link>
                ))}

                <ProfileSettings />
            </div>
            <LogoutButton
                className={cn('absolute bottom-10 left-1/2 -translate-x-1/2 w-10/12', {
                    'opacity-0 md:opacity-100': !expanded,
                })}
            >
                Log out
            </LogoutButton>
        </div>
    );
};

export default Sidebar;
