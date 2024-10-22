'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Icons } from './Icons';

export const ThemeSwitcher = ({
    className,
    containerClass,
}: {
    className?: string;
    containerClass?: string;
}) => {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);
    return (
        <>
            {!mounted ? (
                <button className={`w-fit duration-200 hover:scale-110 active:scale-100`}>
                    <span>
                        <Icons.Moon
                            className={`${className}stroke-gray-800 size-6 stroke-[1.25px] dark:hidden`}
                        />
                        <Icons.SunMedium
                            className={`${className} hidden size-6 stroke-gray-50 stroke-[1.25px] dark:block`}
                        />
                    </span>
                </button>
            ) : (
                <button
                    className={cn(
                        'w-fit duration-200 hover:scale-110 active:scale-100',
                        containerClass,
                    )}
                    aria-label='theme switcher button'
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                    {theme === 'light' ? (
                        <Icons.Moon
                            className={`${className} size-6 stroke-gray-800 stroke-[1.25px]`}
                        />
                    ) : (
                        <Icons.SunMedium
                            className={`${className} size-6 stroke-gray-50 stroke-[1.25px]`}
                        />
                    )}
                </button>
            )}
        </>
    );
};
