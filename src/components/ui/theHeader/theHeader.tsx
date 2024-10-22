import { getUser } from '@/http/user';
import { cookies } from 'next/headers';
import Link from 'next/link';
import React from 'react';
import { cn } from '@/lib/utils';
import { MobileNav } from '.';
import { ThemeSwitcher } from '../../core';
import Logout from './Logout';
import Menu from './menu';

const TheHeader = async () => {
    const userId = cookies().get('userId')?.value;
    const user = await getUser(userId as string);
    const isAdmin = user?.data && 'role' in user.data && user.data.role === 'ADMIN';
    return (
        <header className='bg-muted h-14 grid place-items-center sticky top-0 z-50'>
            <nav className='container'>
                <div className='flex justify-between items-center w-full'>
                    <Link href={'/'} className='text-lg xl:text-xl font-bold sm:w-1/4'>
                        Expenses Tracker
                    </Link>
                    {isAdmin && (
                        <div className='hidden md:block'>
                            <Menu />
                        </div>
                    )}
                    <div className='flex items-center justify-end gap-4 w-1/4'>
                        {!!userId && (
                            <Logout
                                className={cn('block bg-zinc-200 text-gray-800 hover:bg-zinc-300', {
                                    'max-md:hidden': isAdmin,
                                })}
                                size={'sm'}
                            >
                                Logout
                            </Logout>
                        )}
                        {isAdmin && <MobileNav />}
                        <ThemeSwitcher />
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default TheHeader;
