'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { cn } from '@/lib/utils';

const Menu = () => {
    const pathName = usePathname();
    return (
        <div className='flex items-center gap-3'>
            <Link
                href={'/'}
                className={cn(
                    'bg-white text-black  dark:bg-black dark:text-white transition duration-300  px-4 py-1.5 rounded-full inline-block',
                    {
                        'bg-black text-white dark:bg-white dark:text-black': pathName === '/',
                    },
                )}
            >
                Home
            </Link>
            <Link
                href={'/dashboard/add-seller'}
                className={cn(
                    'bg-white text-black  dark:bg-black dark:text-white transition duration-300  px-4 py-1.5 rounded-full inline-block',
                    {
                        'bg-black text-white dark:bg-white dark:text-black':
                            pathName.startsWith('/dashboard'),
                    },
                )}
            >
                Dashboard
            </Link>
        </div>
    );
};

export default Menu;
