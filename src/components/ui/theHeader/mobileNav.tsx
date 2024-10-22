import Link from 'next/link';
import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Icons } from '@/components/core';
import ProfileSettings from '@/app/(protected)/components/ProfileSettings';
import { Button } from '../button';
import LogoutButton from './Logout';

const MobileNav = () => {
    const menu = [
        { label: 'Home', path: '/' },
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
            label: 'Print out',
            path: '/dashboard/print',
        },
    ];
    return (
        <div className='md:hidden'>
            <Sheet>
                <SheetTrigger asChild>
                    <Icons.AlignJustify className='cursor-pointer' />
                </SheetTrigger>
                <SheetContent>
                    <div className='space-y-4 *:block *:w-full mt-6'>
                        {menu.map(({ label, path }) => (
                            <Link key={label} href={path}>
                                <Button className='w-full'>{label}</Button>
                            </Link>
                        ))}
                    </div>
                    <ProfileSettings
                        variant={'default'}
                        className='absolute bottom-10 left-1/2 -translate-x-1/2 w-10/12'
                    />
                    <LogoutButton className='absolute bottom-10 left-1/2 -translate-x-1/2 w-10/12'>
                        Log out
                    </LogoutButton>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default MobileNav;
