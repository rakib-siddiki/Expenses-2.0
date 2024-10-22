'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Dispatch, LegacyRef, SetStateAction, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface TabPosition {
    left: number;
    width: number;
    opacity: number;
}

interface ITabs {
    setPosition: Dispatch<SetStateAction<TabPosition>>;
    children: string;
    href?: string;
    tabClassName?: string;
}

export const Cursor = ({ position }: { position: TabPosition }) => {
    return (
        <motion.li
            animate={{
                ...position,
            }}
            className='absolute z-0 h-7 rounded-full bg-black '
        />
    );
};
const Tab = ({ children, setPosition, href = '#', tabClassName }: ITabs) => {
    const ref = useRef<null | HTMLAnchorElement>(null);
    return href ? (
        <Link
            ref={ref}
            href={href}
            onMouseEnter={() => {
                if (!ref?.current) return;
                const { width } = ref.current.getBoundingClientRect();
                setPosition({
                    left: ref.current.offsetLeft,
                    width,
                    opacity: 1,
                });
            }}
            className={cn(
                'relative z-10 block cursor-pointer px-3 py-1.5 text-xs uppercase text-white mix-blend-difference',
                tabClassName,
            )}
        >
            {children}
        </Link>
    ) : (
        <li>
            <button
                ref={ref as LegacyRef<HTMLButtonElement> | undefined}
                onMouseEnter={() => {
                    if (!ref?.current) return;
                    const { width } = ref.current.getBoundingClientRect();
                    setPosition({
                        left: ref.current.offsetLeft,
                        width,
                        opacity: 1,
                    });
                }}
                className='relative z-10 block cursor-pointer  text-xs uppercase text-white mix-blend-difference'
            >
                {children}
            </button>
        </li>
    );
};

export default Tab;
