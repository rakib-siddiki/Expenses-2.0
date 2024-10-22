'use client';

import { FC, useState } from 'react';
import { TMenuData } from '@/types/theHeader';
import { cn } from '@/lib/utils';
import Tab, { Cursor, TabPosition } from './Tab';

interface IProps {
    tabsData: TMenuData;
    className?: string;
}

const AnimatedTabsOnHover: FC<IProps> = ({ tabsData, className }) => {
    const [position, setPosition] = useState<TabPosition>({
        left: 0,
        width: 0,
        opacity: 0,
    });

    return (
        <ul
            role='navigation list'
            onMouseLeave={() => {
                setPosition((pv) => ({
                    ...pv,
                    opacity: 0,
                }));
            }}
            className={cn(
                'relative mx-auto flex w-fit rounded-full border-2 border-black bg-white p-1',
                className,
            )}
        >
            {tabsData?.map(({ label, ...rest }) => (
                <Tab key={label} setPosition={setPosition} {...rest}>
                    {label}
                </Tab>
            ))}

            <Cursor position={position} />
        </ul>
    );
};
export default AnimatedTabsOnHover;
