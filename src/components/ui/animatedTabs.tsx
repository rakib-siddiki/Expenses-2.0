'use client';

import { motion } from 'framer-motion';
import { ComponentPropsWithoutRef, FC } from 'react';
import { cn } from '@/lib/utils';

interface IProps extends ComponentPropsWithoutRef<'button'> {
    tabsData: { id: string; label: string }[];
    containerClasses?: string;
    activeTab: string;
    setActiveTab: (id: string) => void;
}
const AnimatedTabs: FC<IProps> = ({
    className,
    containerClasses,
    tabsData,
    activeTab,
    setActiveTab,
    ...rest
}) => {
    return (
        <div className={cn('flex space-x-1', containerClasses)}>
            {tabsData?.map(({ id, label }) => (
                <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={cn(
                        'relative rounded-full px-3 py-1.5 text-sm font-medium outline-sky-400 transition focus-visible:outline-2',
                        activeTab === id && 'text-black dark:hover:text-white dark:text-white',
                        activeTab !== id && 'bg-zinc-200 dark:bg-zinc-800',
                        className,
                    )}
                    style={{
                        WebkitTapHighlightColor: 'transparent',
                    }}
                    {...rest}
                >
                    {activeTab === id && (
                        <motion.span
                            layoutId='bubble'
                            className='absolute inset-0 z-10 bg-white mix-blend-difference rounded-full'
                            transition={{
                                type: 'spring',
                                bounce: 0.2,
                                duration: 0.6,
                            }}
                        />
                    )}
                    {label}
                </button>
            ))}
        </div>
    );
};

export default AnimatedTabs;
